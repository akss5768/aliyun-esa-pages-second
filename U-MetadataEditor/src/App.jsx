import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MetadataEditor from './pages/MetadataEditor.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MetadataEditor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
