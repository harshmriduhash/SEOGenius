import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/auth'
import AppLayout from './components/Layout/AppLayout'
import SignIn from './pages/auth/SignIn'
import SignUp from './pages/auth/SignUp'
import MainDashboard from './components/Dashboard/MainDashboard'
import ContentGenerator from './components/Dashboard/ContentGenerator'
import KeywordAnalysis from './components/Dashboard/KeywordAnalysis'
import SERPAnalysis from './components/Dashboard/SERPAnalysis'
import RankTracker from './components/Dashboard/RankTracker'
import BacklinkAnalysis from './components/Dashboard/BacklinkAnalysis'
import TechnicalSEOAudit from './components/Dashboard/TechnicalSEOAudit'
import LocalSEO from './components/Dashboard/LocalSEO'
import ChatInterface from './components/Chat/ChatInterface'
import ContentTranslator from './components/Multilingual/ContentTranslator'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />

            {/* Protected routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<MainDashboard />} />
              <Route path="content" element={<ContentGenerator />} />
              <Route path="keywords" element={<KeywordAnalysis />} />
              <Route path="serp" element={<SERPAnalysis />} />
              <Route path="rankings" element={<RankTracker />} />
              <Route path="backlinks" element={<BacklinkAnalysis />} />
              <Route path="technical-seo" element={<TechnicalSEOAudit />} />
              <Route path="local-seo" element={<LocalSEO />} />
              <Route path="chat" element={<ChatInterface />} />
              <Route path="translate" element={<ContentTranslator />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
