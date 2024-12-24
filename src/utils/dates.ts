import { format, formatDistance, parseISO } from 'date-fns'

export const formatDate = (date: string | Date) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, 'MMM d, yyyy')
}

export const formatDateTime = (date: string | Date) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, 'MMM d, yyyy h:mm a')
}

export const formatRelative = (date: string | Date) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return formatDistance(date, new Date(), { addSuffix: true })
}

export const formatShortDate = (date: string | Date) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, 'MM/dd/yyyy')
}
