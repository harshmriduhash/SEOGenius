import toast from 'react-hot-toast'

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public details?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const handleError = (error: unknown) => {
  console.error('Error:', error)
  
  if (error instanceof AppError) {
    toast.error(error.message)
    return
  }
  
  if (error instanceof Error) {
    toast.error(error.message)
    return
  }
  
  toast.error('An unexpected error occurred')
}

export const isAppError = (error: unknown): error is AppError => {
  return error instanceof AppError
}

export const createError = (message: string, code?: string, details?: Record<string, any>) => {
  return new AppError(message, code, details)
}
