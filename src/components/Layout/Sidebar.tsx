import { Link, useLocation } from 'react-router-dom'
import {
  BarChart,
  FileText,
  Search,
  Link as LinkIcon,
  Settings,
  Map,
  MessageCircle,
  Globe,
  X
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart },
  { name: 'Content', href: '/content', icon: FileText },
  { name: 'Keywords', href: '/keywords', icon: Search },
  { name: 'SERP Analysis', href: '/serp', icon: Search },
  { name: 'Rankings', href: '/rankings', icon: BarChart },
  { name: 'Backlinks', href: '/backlinks', icon: LinkIcon },
  { name: 'Technical SEO', href: '/technical-seo', icon: Settings },
  { name: 'Local SEO', href: '/local-seo', icon: Map },
  { name: 'Chat Assistant', href: '/chat', icon: MessageCircle },
  { name: 'Translate', href: '/translate', icon: Globe },
]

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:sticky top-0 md:top-16 h-screen z-50 transform
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300 ease-in-out
          w-64 bg-white shadow-sm md:shadow-none
        `}
      >
        <div className="h-full px-3 py-4">
          {/* Mobile close button */}
          <div className="flex justify-end md:hidden mb-4">
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => onClose()}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md
                    ${isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-indigo-600' : 'text-gray-400'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
