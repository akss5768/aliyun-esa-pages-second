import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Plus,
  Save,
  Trash2,
  Edit2,
  Search,
  Eye,
  EyeOff,
  Download,
  FileText,
  Tag as TagIcon,
  Calendar,
  X,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { format } from 'date-fns'
import testData from '../data/testData.json'

function MarkdownNote() {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showPreview, setShowPreview] = useState(true)
  const [showEditor, setShowEditor] = useState(true)
  const [editingMode, setEditingMode] = useState(false)
  const [tempContent, setTempContent] = useState('')

  useEffect(() => {
    const savedNotes = localStorage.getItem('markdown-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    } else {
      setNotes(testData.notes)
      localStorage.setItem('markdown-notes', JSON.stringify(testData.notes))
    }
  }, [])

  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('markdown-notes', JSON.stringify(notes))
    }
  }, [notes])

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: '新笔记',
      content: '# 新笔记\n\n开始写作...',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setNotes([newNote, ...notes])
    setSelectedNote(newNote)
    setEditingMode(true)
    setTempContent(newNote.content)
  }

  const handleSaveNote = () => {
    if (selectedNote) {
      const updatedNote = {
        ...selectedNote,
        content: tempContent,
        title: tempContent.split('\n')[0].replace(/^#\s*/, '') || '未命名笔记',
        updatedAt: new Date().toISOString()
      }
      setNotes(notes.map(note => note.id === selectedNote.id ? updatedNote : note))
      setSelectedNote(updatedNote)
      setEditingMode(false)
    }
  }

  const handleDeleteNote = (noteId) => {
    if (confirm('确定要删除这个笔记吗？')) {
      setNotes(notes.filter(note => note.id !== noteId))
      if (selectedNote && selectedNote.id === noteId) {
        setSelectedNote(null)
      }
    }
  }

  const handleExportNote = (note) => {
    const blob = new Blob([note.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${note.title}.md`
    link.click()
  }

  const handleEditNote = () => {
    if (selectedNote) {
      setEditingMode(true)
      setTempContent(selectedNote.content)
    }
  }

  const filteredNotes = notes
    .filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* 顶部导航栏 */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <FileText size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Markdown 笔记
              </h1>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索笔记..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                共 {notes.length} 篇笔记
              </div>
              <button
                onClick={handleCreateNote}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus size={18} />
                新建笔记
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notes.length === 0 ? (
          <div className="text-center py-20">
            <FileText size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl text-gray-500 mb-2">暂无笔记</h3>
            <p className="text-gray-400">点击"新建笔记"按钮开始创建</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧笔记列表 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-bold text-gray-800 mb-4">笔记列表</h2>
                <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => {
                        setSelectedNote(note)
                        setEditingMode(false)
                        setTempContent(note.content)
                      }}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedNote?.id === note.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <h3 className={`font-medium mb-2 ${
                        selectedNote?.id === note.id ? 'text-white' : 'text-gray-800'
                      }`}>
                        {note.title}
                      </h3>
                      <p className={`text-sm mb-2 line-clamp-2 ${
                        selectedNote?.id === note.id ? 'text-white/80' : 'text-gray-500'
                      }`}>
                        {note.content.replace(/[#*`]/g, '').substring(0, 100)}
                      </p>
                      <div className={`text-xs ${
                        selectedNote?.id === note.id ? 'text-white/60' : 'text-gray-400'
                      }`}>
                        {format(new Date(note.updatedAt), 'yyyy-MM-dd HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧编辑和预览区域 */}
            <div className="lg:col-span-2">
              {selectedNote ? (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* 工具栏 */}
                  <div className="bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowEditor(!showEditor)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          showEditor ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
                        }`}
                      >
                        <EyeOff size={18} />
                      </button>
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          showPreview ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-200'
                        }`}
                      >
                        <Eye size={18} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      {editingMode ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingMode(false)
                              setTempContent(selectedNote.content)
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <X size={16} />
                            取消
                          </button>
                          <button
                            onClick={handleSaveNote}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                          >
                            <Save size={16} />
                            保存
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={handleEditNote}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Edit2 size={16} />
                            编辑
                          </button>
                          <button
                            onClick={() => handleExportNote(selectedNote)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                          >
                            <Download size={16} />
                            导出
                          </button>
                          <button
                            onClick={() => handleDeleteNote(selectedNote.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 size={16} />
                            删除
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 编辑和预览区域 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-300px)]">
                    {showEditor && (
                      <div className="border-r overflow-hidden">
                        <textarea
                          value={editingMode ? tempContent : selectedNote.content}
                          onChange={(e) => setTempContent(e.target.value)}
                          disabled={!editingMode}
                          className="w-full h-full p-6 resize-none focus:outline-none markdown-editor disabled:bg-gray-50"
                          placeholder="开始输入 Markdown 内容..."
                        />
                      </div>
                    )}

                    {showPreview && (
                      <div className="overflow-y-auto">
                        <div className="p-6 markdown-preview">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {editingMode ? tempContent : selectedNote.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 底部信息 */}
                  <div className="bg-gray-50 border-t px-6 py-3 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        创建: {format(new Date(selectedNote.createdAt), 'yyyy-MM-dd HH:mm')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        更新: {format(new Date(selectedNote.updatedAt), 'yyyy-MM-dd HH:mm')}
                      </span>
                    </div>
                    <div>
                      字数: {selectedNote.content.length}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <FileText size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl text-gray-500 mb-2">请选择一个笔记</h3>
                  <p className="text-gray-400">从左侧列表中选择要查看或编辑的笔记</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MarkdownNote
