
import { Route, Routes } from 'react-router-dom'
import { LenisProvider } from './hooks/index.ts'
import { HomePage } from './sections/HomePage.tsx'
import { AdminPage } from './pages/AdminPage.tsx'

export default function App() {
  return (
    <LenisProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </LenisProvider>
  )
}
