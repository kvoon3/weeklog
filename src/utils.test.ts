import { describe, expect, it } from 'vitest'
import { getAllWeekRange } from './utils'

describe('utils', () => {
  it('get all weeks', () => {
    expect(getAllWeekRange(new Date('2025-07-16')).length).toBe(29)
  })
})
