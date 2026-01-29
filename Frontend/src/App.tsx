import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import PromptPage from './pages/PromptPage'
import GeneratePage from './pages/GeneratePage'

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/prompt" element={<PromptPage />} />
            <Route path="/generate" element={<GeneratePage />} />
        </Routes>
    )
}

export default App
