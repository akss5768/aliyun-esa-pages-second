import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MarkdownNote from './pages/MarkdownNote.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarkdownNote />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
