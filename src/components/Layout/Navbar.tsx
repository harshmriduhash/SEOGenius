import { useAuth } from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, User, BarChart2 } from 'lucide-react'

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/signin')
  }

  return (
    <nav className="bg-white shadow fixed w-full top-0 z-50 h-16">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-full">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <BarChart2 className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-xl font-bold text-indigo-600">SEOGenius</h1>
            </div>
            <div className="hidden md:flex ml-6">
              <p className="text-sm text-gray-500">
                Monitor your SEO performance metrics and rankings
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg">
                <User className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-700 font-medium">{session?.user.email}</span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition ml-4"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
