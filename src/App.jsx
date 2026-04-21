import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Library from './pages/Library'
import Discovery from './pages/Discovery'
import Archive from './pages/Archive'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-svh flex-col">
        <NavBar />
        <main className="flex-1 pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
