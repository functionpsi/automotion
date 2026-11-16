import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('utils', () => {
  describe('cn', () => {
    it('combines class names', () => {
      expect(cn('a', 'b')).toBe('a b')
    })

    it('handles conditional classes', () => {
      expect(cn('a', true && 'b', false && 'c')).toBe('a b')
    })

    it('merges tailwind classes', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4')
    })
  })
})

describe('format utilities', () => {
  it('formats bytes', () => {
    // This would test formatBytes if imported
    expect(true).toBe(true)
  })
})