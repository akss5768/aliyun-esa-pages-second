import { useState, useRef, useEffect } from 'react'
import {
  Upload,
  FileImage,
  Film,
  Music,
  FileText,
  Download,
  Save,
  Trash2,
  Plus,
  X,
  Edit2,
  Tag as TagIcon,
  Calendar,
  User,
  Hash,
  Type,
  AlignLeft
} from 'lucide-react'
import * as piexifjs from 'piexifjs'

// IndexedDB 工具函数
const DB_NAME = 'MetadataEditorDB'
const DB_VERSION = 1
const STORE_NAME = 'mediaFiles'

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

const saveToDB = async (file) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.put(file)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const deleteFromDB = async (fileId) => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(fileId)
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

const loadFromDB = async () => {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result || [])
    request.onerror = () => reject(request.error)
  })
}

function MetadataEditor() {
  const [mediaFiles, setMediaFiles] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newTag, setNewTag] = useState('')
  const fileInputRef = useRef(null)

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files)
    for (const file of files) {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const mediaType = file.type.split('/')[0]
        const newMedia = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          size: file.size,
          mediaType: mediaType,
          preview: event.target.result,
          metadata: {
            title: file.name.split('.')[0],
            description: '',
            author: '',
            date: new Date().toISOString().split('T')[0],
            tags: [],
            copyright: '',
            license: 'All Rights Reserved',
            width: 0,
            height: 0,
            duration: 0
          }
        }
        await saveToDB(newMedia)
        setMediaFiles(prev => [newMedia, ...prev])
        setSelectedFile(newMedia)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateMetadata = (field, value) => {
    if (selectedFile) {
      setSelectedFile({
        ...selectedFile,
        metadata: { ...selectedFile.metadata, [field]: value }
      })
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && selectedFile && !selectedFile.metadata.tags.includes(newTag.trim())) {
      setSelectedFile({
        ...selectedFile,
        metadata: {
          ...selectedFile.metadata,
          tags: [...selectedFile.metadata.tags, newTag.trim()]
        }
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    if (selectedFile) {
      setSelectedFile({
        ...selectedFile,
        metadata: {
          ...selectedFile.metadata,
          tags: selectedFile.metadata.tags.filter(tag => tag !== tagToRemove)
        }
      })
    }
  }

  const handleSaveMetadata = async () => {
    if (selectedFile) {
      await saveToDB(selectedFile)
      setMediaFiles(prev =>
        prev.map(file => file.id === selectedFile.id ? selectedFile : file)
      )
      setIsEditing(false)
    }
  }

  const handleDeleteFile = async (fileId) => {
    if (confirm('确定要删除这个媒体文件吗？')) {
      await deleteFromDB(fileId)
      setMediaFiles(prev => prev.filter(file => file.id !== fileId))
      if (selectedFile && selectedFile.id === fileId) {
        setSelectedFile(null)
      }
    }
  }

  const handleExportMetadata = async (file) => {
    // 导出修改了元数据的原始媒体文件
    try {
      let blob
      const baseName = file.metadata.title || file.name.split('.')[0]
      const extension = file.name.split('.').pop()

      if (file.mediaType === 'image') {
        // 对于图片,使用 piexifjs 修改 EXIF 元数据
        try {
          // 将 dataUrl 转换为 Blob
          const response = await fetch(file.preview)
          const originalBlob = await response.blob()
          
          // 将 Blob 转换为 ArrayBuffer
          const buffer = await originalBlob.arrayBuffer()
          const base64Data = arrayBufferToBase64(buffer)
          const dataUrl = `data:${file.type};base64,${base64Data}`

          // 创建 EXIF 数据
          const exifObj = {
            '0th': {
              [piexif.ImageIFD.DocumentName]: file.metadata.title.substring(0, 64),
              [piexif.ImageIFD.ImageDescription]: file.metadata.description.substring(0, 2000),
              [piexif.ImageIFD.Artist]: file.metadata.author.substring(0, 64),
              [piexif.ImageIFD.Copyright]: file.metadata.copyright.substring(0, 128),
              [piexif.ImageIFD.DateTime]: file.metadata.date,
              [piexif.ImageIFD.Software]: 'Metadata Editor'
            },
            'Exif': {
              [piexif.ExifIFD.UserComment]: file.metadata.title,
              [piexif.ExifIFD.ImageDescription]: file.metadata.description
            }
          }

          // 将 EXIF 数据插入到图片中
          const exifBytes = piexifjs.dump(exifObj)
          const newDataUrl = piexifjs.insert(exifBytes, dataUrl)

          // 转换为 Blob
          blob = dataUrlToBlob(newDataUrl)
        } catch (exifError) {
          console.warn('无法修改图片 EXIF,导出原始文件:', exifError)
          // 如果 EXIF 修改失败,导出原始文件
          const response = await fetch(file.preview)
          blob = await response.blob()
        }
      } else if (file.mediaType === 'audio' || file.mediaType === 'video') {
        // 对于音频和视频,直接导出原始文件
        // 浏览器端无法直接修改视频/音频的元数据
        const response = await fetch(file.preview)
        blob = await response.blob()
        
        // 提示用户
        console.warn('音频/视频文件的元数据只能在导出时更改文件名')
      } else {
        // 其他文件类型
        const response = await fetch(file.preview)
        blob = await response.blob()
      }

      // 创建下载链接
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${baseName}.${extension}`
      
      link.click()
      
      // 释放 URL 对象
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('导出文件失败:', error)
      alert('导出文件失败,请重试')
    }
  }

  // 辅助函数: ArrayBuffer 转 Base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  // 辅助函数: DataURL 转 Blob
  const dataUrlToBlob = (dataUrl) => {
    const arr = dataUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
  }

  const handleExportAll = async () => {
    // 导出所有修改了元数据的原始媒体文件
    try {
      for (const file of mediaFiles) {
        let blob
        const baseName = file.metadata.title || file.name.split('.')[0]
        const extension = file.name.split('.').pop()

        if (file.mediaType === 'image') {
          // 对于图片,使用 piexifjs 修改 EXIF 元数据
          try {
            const response = await fetch(file.preview)
            const originalBlob = await response.blob()
            const buffer = await originalBlob.arrayBuffer()
            const base64Data = arrayBufferToBase64(buffer)
            const dataUrl = `data:${file.type};base64,${base64Data}`

            // 创建 EXIF 数据
            const exifObj = {
              '0th': {
                [piexif.ImageIFD.DocumentName]: file.metadata.title.substring(0, 64),
                [piexif.ImageIFD.ImageDescription]: file.metadata.description.substring(0, 2000),
                [piexif.ImageIFD.Artist]: file.metadata.author.substring(0, 64),
                [piexif.ImageIFD.Copyright]: file.metadata.copyright.substring(0, 128),
                [piexif.ImageIFD.DateTime]: file.metadata.date,
                [piexif.ImageIFD.Software]: 'Metadata Editor'
              },
              'Exif': {
                [piexif.ExifIFD.UserComment]: file.metadata.title,
                [piexif.ExifIFD.ImageDescription]: file.metadata.description
              }
            }

            const exifBytes = piexifjs.dump(exifObj)
            const newDataUrl = piexifjs.insert(exifBytes, dataUrl)
            blob = dataUrlToBlob(newDataUrl)
          } catch (exifError) {
            console.warn('无法修改图片 EXIF,导出原始文件:', exifError)
            const response = await fetch(file.preview)
            blob = await response.blob()
          }
        } else {
          // 其他媒体类型
          const response = await fetch(file.preview)
          blob = await response.blob()
        }

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${baseName}.${extension}`
        link.click()
        URL.revokeObjectURL(url)

        // 延迟避免浏览器阻止
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error('批量导出文件失败:', error)
      alert('批量导出文件失败,请重试')
    }
  }

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image': return <FileImage size={48} className="text-blue-500" />
      case 'video': return <Film size={48} className="text-purple-500" />
      case 'audio': return <Music size={48} className="text-green-500" />
      default: return <FileText size={48} className="text-gray-500" />
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  useEffect(() => {
    const loadFiles = async () => {
      const files = await loadFromDB()
      setMediaFiles(files)
    }
    loadFiles()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <TagIcon size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                媒体元数据编辑器
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                已加载 {mediaFiles.length} 个文件
              </div>
              {mediaFiles.length > 0 && (
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download size={18} />
                  导出全部
                </button>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Upload size={18} />
                上传文件
              </button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileUpload}
                accept="image/*,video/*,audio/*"
                multiple
                className="hidden"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {mediaFiles.length === 0 ? (
          <div className="text-center py-20">
            <Upload size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl text-gray-500 mb-2">暂无媒体文件</h3>
            <p className="text-gray-400 mb-4">点击"上传文件"按钮开始添加媒体</p>
            <p className="text-sm text-gray-400">支持图片、视频、音频文件</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧文件列表 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">文件列表</h2>
                <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {mediaFiles.map((file) => (
                    <div
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedFile?.id === file.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {getMediaIcon(file.mediaType)}
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate ${
                            selectedFile?.id === file.id ? 'text-white' : 'text-gray-800'
                          }`}>
                            {file.name}
                          </h3>
                          <p className={`text-sm ${
                            selectedFile?.id === file.id ? 'text-white/80' : 'text-gray-500'
                          }`}>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧编辑区域 */}
            <div className="lg:col-span-2">
              {selectedFile ? (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-800">元数据编辑</h2>
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <X size={16} />
                            取消
                          </button>
                          <button
                            onClick={handleSaveMetadata}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Save size={16} />
                            保存
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleDeleteFile(selectedFile.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 size={16} />
                            删除
                          </button>
                          <button
                            onClick={() => handleExportMetadata(selectedFile)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Download size={16} />
                            导出
                          </button>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Edit2 size={16} />
                            编辑
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 媒体预览 */}
                  <div className="mb-6">
                    <div className="media-preview-container rounded-xl">
                      {selectedFile.mediaType === 'image' && (
                        <img src={selectedFile.preview} alt={selectedFile.name} />
                      )}
                      {selectedFile.mediaType === 'video' && (
                        <video src={selectedFile.preview} controls />
                      )}
                      {selectedFile.mediaType === 'audio' && (
                        <audio src={selectedFile.preview} controls />
                      )}
                    </div>
                  </div>

                  {/* 元数据表单 */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <FileText size={20} className="text-blue-600 mt-1" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">文件名</label>
                          <input
                            type="text"
                            value={selectedFile.name}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <Type size={20} className="text-purple-600 mt-1" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">标题</label>
                          <input
                            type="text"
                            value={selectedFile.metadata.title}
                            onChange={(e) => handleUpdateMetadata('title', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <AlignLeft size={20} className="text-green-600 mt-1" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                          <textarea
                            value={selectedFile.metadata.description}
                            onChange={(e) => handleUpdateMetadata('description', e.target.value)}
                            disabled={!isEditing}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <User size={20} className="text-orange-600 mt-1" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">作者</label>
                          <input
                            type="text"
                            value={selectedFile.metadata.author}
                            onChange={(e) => handleUpdateMetadata('author', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <Calendar size={20} className="text-red-600 mt-1" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">日期</label>
                          <input
                            type="date"
                            value={selectedFile.metadata.date}
                            onChange={(e) => handleUpdateMetadata('date', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                        <Hash size={20} className="text-indigo-600 mt-1" />
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">版权</label>
                          <input
                            type="text"
                            value={selectedFile.metadata.copyright}
                            onChange={(e) => handleUpdateMetadata('copyright', e.target.value)}
                            disabled={!isEditing}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 标签管理 */}
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                      <TagIcon size={20} className="text-pink-600 mt-1" />
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {selectedFile.metadata.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm flex items-center gap-2"
                            >
                              {tag}
                              {isEditing && (
                                <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="hover:opacity-80"
                                >
                                  <X size={14} />
                                </button>
                              )}
                            </span>
                          ))}
                        </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                              placeholder="输入标签后按回车添加..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={handleAddTag}
                              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                              <Plus size={18} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 文件信息 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">文件大小</div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatFileSize(selectedFile.size)}
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">文件类型</div>
                        <div className="text-lg font-bold text-purple-600">
                          {selectedFile.type}
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">标签数量</div>
                        <div className="text-lg font-bold text-green-600">
                          {selectedFile.metadata.tags.length}
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                        <div className="text-sm text-gray-600 mb-1">媒体类型</div>
                        <div className="text-lg font-bold text-orange-600 capitalize">
                          {selectedFile.mediaType}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <TagIcon size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-500 mb-2">请选择一个文件</h3>
                  <p className="text-gray-400">从左侧文件列表中选择要编辑的媒体文件</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MetadataEditor
