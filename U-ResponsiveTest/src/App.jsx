import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ResponsiveTest from './pages/ResponsiveTest.jsx'
function App() {
  return <BrowserRouter><Routes><Route path="/" element={<ResponsiveTest />} /></Routes></BrowserRouter>
}
export default App
