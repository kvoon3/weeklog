import { endOfWeek, getISOWeek, getISOWeekYear, parseISO, startOfWeek } from 'date-fns'

export interface WeekRange {
  weekNum: number
  start: Date
  end: Date
}

export function getAllWeekRange(date: Date): WeekRange[] {
  const year = getISOWeekYear(date)
  const thisWeek = getISOWeek(date)
  const ranges: WeekRange[] = []

  for (let w = 1; w <= thisWeek; w += 1) {
    const thursday = parseISO(`${year}-W${String(w).padStart(2, '0')}-4`)
    ranges.push(getWeekRange(thursday))
  }

  return ranges
}

export function getWeekRange(date: Date): WeekRange {
  return {
    weekNum: getISOWeek(date),
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  }
}
