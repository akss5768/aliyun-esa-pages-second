import { useState, useEffect } from 'react'
import { Plus, Trash2, Play, Save, ArrowRight, ChevronRight, Settings } from 'lucide-react'

const WorkflowDesigner = () => {
  const [workflows, setWorkflows] = useState([])
  const [selectedWorkflow, setSelectedWorkflow] = useState(null)
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [showNewNodeModal, setShowNewNodeModal] = useState(false)
  const [newNodeName, setNewNodeName] = useState('')
  const [newNodeType, setNewNodeType] = useState('task')
  const [showNewWorkflowModal, setShowNewWorkflowModal] = useState(false)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [selectedNodeForEdge, setSelectedNodeForEdge] = useState(null)

  const nodeTypes = [
    { id: 'task', label: '任务节点', color: 'bg-blue-500' },
    { id: 'condition', label: '条件节点', color: 'bg-yellow-500' },
    { id: 'start', label: '开始节点', color: 'bg-green-500' },
    { id: 'end', label: '结束节点', color: 'bg-red-500' }
  ]

  useEffect(() => {
    const savedWorkflows = localStorage.getItem('taskflow_workflows')
    if (savedWorkflows) {
      setWorkflows(JSON.parse(savedWorkflows))
    } else {
      const defaultWorkflows = [
        {
          id: '1',
          name: '项目审批流程',
          description: '标准的项目审批工作流',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: '发布部署流程',
          description: '代码发布和部署的标准流程',
          createdAt: new Date().toISOString()
        }
      ]
      setWorkflows(defaultWorkflows)
      localStorage.setItem('taskflow_workflows', JSON.stringify(defaultWorkflows))
    }

    const savedNodes = localStorage.getItem('taskflow_nodes')
    if (savedNodes) {
      setNodes(JSON.parse(savedNodes))
    } else {
      const defaultNodes = [
        { id: '1', name: '开始', type: 'start', x: 100, y: 200, workflowId: '1' },
        { id: '2', name: '需求评审', type: 'task', x: 300, y: 200, workflowId: '1' },
        { id: '3', name: '技术评审', type: 'task', x: 500, y: 200, workflowId: '1' },
        { id: '4', name: '审批通过', type: 'condition', x: 700, y: 200, workflowId: '1' },
        { id: '5', name: '结束', type: 'end', x: 900, y: 200, workflowId: '1' }
      ]
      setNodes(defaultNodes)
      localStorage.setItem('taskflow_nodes', JSON.stringify(defaultNodes))
    }

    const savedEdges = localStorage.getItem('taskflow_edges')
    if (savedEdges) {
      setEdges(JSON.parse(savedEdges))
    } else {
      const defaultEdges = [
        { from: '1', to: '2', workflowId: '1' },
        { from: '2', to: '3', workflowId: '1' },
        { from: '3', to: '4', workflowId: '1' },
        { from: '4', to: '5', workflowId: '1' }
      ]
      setEdges(defaultEdges)
      localStorage.setItem('taskflow_edges', JSON.stringify(defaultEdges))
    }

    if (workflows.length > 0 && !selectedWorkflow) {
      setSelectedWorkflow(workflows[0])
    }
  }, [])

  useEffect(() => {
    if (selectedWorkflow) {
      const workflowNodes = nodes.filter(n => n.workflowId === selectedWorkflow.id)
      const workflowEdges = edges.filter(e => e.workflowId === selectedWorkflow.id)
      setNodes(workflowNodes)
      setEdges(workflowEdges)
    }
  }, [selectedWorkflow])

  const handleCreateWorkflow = () => {
    if (!newWorkflowName.trim()) return

    const newWorkflow = {
      id: Date.now().toString(),
      name: newWorkflowName,
      description: '自定义工作流',
      createdAt: new Date().toISOString()
    }

    const updatedWorkflows = [...workflows, newWorkflow]
    setWorkflows(updatedWorkflows)
    localStorage.setItem('taskflow_workflows', JSON.stringify(updatedWorkflows))
    setSelectedWorkflow(newWorkflow)

    setNewWorkflowName('')
    setShowNewWorkflowModal(false)
  }

  const handleCreateNode = () => {
    if (!newNodeName.trim()) return

    const newNode = {
      id: Date.now().toString(),
      name: newNodeName,
      type: newNodeType,
      x: 100,
      y: 100 + Math.random() * 200,
      workflowId: selectedWorkflow.id
    }

    const updatedNodes = [...nodes, newNode]
    setNodes(updatedNodes)
    localStorage.setItem('taskflow_nodes', JSON.stringify(updatedNodes))

    setNewNodeName('')
    setShowNewNodeModal(false)
  }

  const handleDeleteNode = (nodeId) => {
    if (window.confirm('确定要删除这个节点吗？')) {
      const updatedNodes = nodes.filter(n => n.id !== nodeId)
      const updatedEdges = edges.filter(e => e.from !== nodeId && e.to !== nodeId)
      setNodes(updatedNodes)
      setEdges(updatedEdges)
      localStorage.setItem('taskflow_nodes', JSON.stringify(updatedNodes))
      localStorage.setItem('taskflow_edges', JSON.stringify(updatedEdges))
    }
  }

  const handleCreateEdge = (fromId, toId) => {
    const newEdge = {
      from: fromId,
      to: toId,
      workflowId: selectedWorkflow.id
    }

    const updatedEdges = [...edges, newEdge]
    setEdges(updatedEdges)
    localStorage.setItem('taskflow_edges', JSON.stringify(updatedEdges))
    setSelectedNodeForEdge(null)
  }

  const handleDeleteEdge = (edgeIndex) => {
    const updatedEdges = edges.filter((_, i) => i !== edgeIndex)
    setEdges(updatedEdges)
    localStorage.setItem('taskflow_edges', JSON.stringify(updatedEdges))
  }

  const getNodeTypeInfo = (type) => {
    return nodeTypes.find(nt => nt.id === type) || nodeTypes[0]
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">工作流设计器</h1>
          <p className="text-gray-600 mt-1">创建和管理工作流程</p>
        </div>
        <button
          onClick={() => setShowNewWorkflowModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>创建工作流</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-4">工作流列表</h3>
          <div className="space-y-3">
            {workflows.map((workflow) => (
              <button
                key={workflow.id}
                onClick={() => setSelectedWorkflow(workflow)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedWorkflow?.id === workflow.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{workflow.name}</div>
                <div className="text-sm opacity-75 mt-1">
                  {workflow.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
          {selectedWorkflow && (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedWorkflow.name}</h2>
                  <p className="text-gray-600">{selectedWorkflow.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowNewNodeModal(true)}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>添加节点</span>
                  </button>
                  <button className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <Play className="w-4 h-4" />
                    <span>运行</span>
                  </button>
                </div>
              </div>

              <div className="relative bg-gray-50 rounded-lg p-8 min-h-[500px] overflow-auto">
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {edges.map((edge, index) => {
                    const fromNode = nodes.find(n => n.id === edge.from)
                    const toNode = nodes.find(n => n.id === edge.to)
                    if (!fromNode || !toNode) return null

                    return (
                      <g key={index}>
                        <line
                          x1={fromNode.x + 80}
                          y1={fromNode.y + 40}
                          x2={toNode.x}
                          y2={toNode.y + 40}
                          stroke="#94a3b8"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                        <polygon
                          points={`${toNode.x},${toNode.y + 40} ${toNode.x - 10},${toNode.y + 35} ${toNode.x - 10},${toNode.y + 45}`}
                          fill="#94a3b8"
                        />
                      </g>
                    )
                  })}
                </svg>

                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                  </marker>
                </defs>

                <div className="relative space-y-4">
                  {nodes.map((node) => {
                    const nodeType = getNodeTypeInfo(node.type)
                    return (
                      <div
                        key={node.id}
                        className="absolute cursor-pointer"
                        style={{ left: node.x, top: node.y }}
                      >
                        <div
                          onClick={() => setSelectedNodeForEdge(selectedNodeForEdge === node.id ? null : node.id)}
                          className={`${nodeType.color} text-white px-4 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow min-w-[150px] ${selectedNodeForEdge === node.id ? 'ring-4 ring-blue-300' : ''}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{node.name}</span>
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteNode(node.id)
                                }}
                                className="hover:bg-white hover:bg-opacity-20 p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {selectedNodeForEdge === node.id && (
                          <div className="absolute -right-48 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-lg p-2 z-10">
                            <p className="text-sm text-gray-600 mb-2">点击另一个节点连接</p>
                            <div className="flex space-x-1">
                              {nodes.filter(n => n.id !== node.id).map(n => (
                                <button
                                  key={n.id}
                                  onClick={() => handleCreateEdge(node.id, n.id)}
                                  className="bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-sm"
                                >
                                  {n.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {nodeTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded ${type.color}`}></div>
                    <span className="text-sm text-gray-600">{type.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showNewWorkflowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">创建新工作流</h2>
            <input
              type="text"
              value={newWorkflowName}
              onChange={(e) => setNewWorkflowName(e.target.value)}
              placeholder="工作流名称"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowNewWorkflowModal(false)
                  setNewWorkflowName('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateWorkflow}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {showNewNodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">添加节点</h2>
            <input
              type="text"
              value={newNodeName}
              onChange={(e) => setNewNodeName(e.target.value)}
              placeholder="节点名称"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                节点类型
              </label>
              <div className="grid grid-cols-2 gap-2">
                {nodeTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setNewNodeType(type.id)}
                    className={`p-3 rounded-lg border-2 transition-all flex items-center space-x-2 ${
                      newNodeType === type.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded ${type.color}`}></div>
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => {
                  setShowNewNodeModal(false)
                  setNewNodeName('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateNode}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WorkflowDesigner
