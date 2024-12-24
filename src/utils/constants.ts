export const APP_NAME = 'SEOGenius'

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  CONTENT: '/content',
  KEYWORDS: '/keywords',
  SERP: '/serp',
  RANKINGS: '/rankings',
  BACKLINKS: '/backlinks',
  TECHNICAL_SEO: '/technical-seo',
  LOCAL_SEO: '/local-seo',
  CHAT: '/chat',
  TRANSLATE: '/translate'
} as const

export const API_ERROR_MESSAGES = {
  UNAUTHORIZED: 'Please sign in to continue',
  FORBIDDEN: 'You do not have permission to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  GENERIC: 'An error occurred. Please try again.'
} as const

export const DATE_FORMATS = {
  FULL: 'MMM d, yyyy',
  SHORT: 'MM/dd/yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
  ISO: 'yyyy-MM-dd'
} as const

export const CHART_COLORS = {
  PRIMARY: '#4F46E5',
  SECONDARY: '#10B981',
  TERTIARY: '#F59E0B',
  QUATERNARY: '#EF4444',
  GRAY: '#6B7280'
} as const

export const TABLE_PAGE_SIZES = [10, 25, 50, 100] as const

export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'ru', name: 'Russian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' }
] as const
