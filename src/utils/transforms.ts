import { type Json } from '../types/database.types'

export const transformNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number') return value
  if (typeof value === 'string') return Number(value) || fallback
  return fallback
}

export const transformString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') return value
  if (typeof value === 'number') return String(value)
  if (value === null || value === undefined) return fallback
  return fallback
}

export const transformArray = <T>(value: unknown, transform: (item: unknown) => T): T[] => {
  if (!Array.isArray(value)) return []
  return value.map(transform)
}

export const transformDate = (value: unknown): Date | null => {
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
  }
  return null
}

export const parseJson = (value: string | null): Json => {
  if (!value) return null
  try {
    return JSON.parse(value) as Json
  } catch {
    return null
  }
}

export const formatFileSize = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export const toTitleCase = (text: string): string => {
  return text.replace(
    /\w\S*/g,
    (word) => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
  )
}
