import {
  DefaultTheme,
  MD3DarkTheme,
  overlay,
  useTheme,
} from 'react-native-paper'
import Color from 'color'
import { dayNamesHeight } from './Date/DayNames'
import React from 'react'
import { ValidRangeType } from './Date/Calendar'

export type PaperTheme = typeof MD3DarkTheme | typeof DefaultTheme

export function useLatest<T>(value: T) {
  const ref = React.useRef(value)
  ref.current = value
  return ref
}

export function useHeaderBackgroundColor() {
  const theme = useTheme()
  if (theme.isV3) {
    return theme.colors.surface
  }
  return theme.dark && theme.mode === 'adaptive'
    ? overlay(4, theme.colors.surface)
    : theme.colors.primary
}

export function useHeaderColorIsLight() {
  const theme = useTheme()
  const background =
    theme.dark && theme.mode === 'adaptive'
      ? theme.colors.surface
      : theme.colors.primary
  return Color(background).isLight()
}

export function useHeaderTextColor() {
  const theme = useTheme()
  const isLight = useHeaderColorIsLight()
  if (theme.isV3) {
    return theme.colors.onSurfaceVariant
  }
  return !isLight ? '#fff' : '#000'
}

export function useTextColorOnPrimary() {
  const theme = useTheme()
  const isDark = !Color(theme.colors.primary).isLight()

  if (theme.isV3) {
    if (isDark && theme.dark) {
      return theme.colors.onSurface
    } else {
      return theme.colors.onPrimary
    }
  }

  return isDark ? '#fff' : '#000'
}

export function range(start: number, end: number) {
  return Array(end - start + 1)
    .fill(null)
    .map((_, i) => start + i)
}

export function lightenBy(color: Color, ratio: number) {
  const lightness = color.lightness()
  return color.lightness(lightness + (100 - lightness) * ratio)
}

export function darkenBy(color: Color, ratio: number) {
  const lightness = color.lightness()
  return color.lightness(lightness - lightness * ratio)
}

//new-------->
export const daySize = 35
export const estimatedMonthHeight = 360
export const startAtIndex = 1200
export const totalMonths = startAtIndex * 2
export const beginOffset = estimatedMonthHeight * startAtIndex
export const gridCounts = new Array<number | undefined>(totalMonths)

export const monthGrid = (index: number) => {
  return Array(getGridCount(index))
    .fill(null)
    .map((_, weekGrid) => {
      const days = Array(7).fill(null)
      return { weekGrid, days }
    })
}

export function getIndexCount(index: number): number {
  if (index > startAtIndex) {
    return index - startAtIndex
  }

  return -(startAtIndex - index)
}

export function weeksOffset(index: number): number {
  if (index === startAtIndex) {
    return 0
  }
  let off = 0
  if (index > startAtIndex) {
    for (let i = 0; i < index - startAtIndex; i++) {
      const cIndex = startAtIndex + i
      off += gridCounts[cIndex] || getGridCount(cIndex)
    }
  } else {
    for (let i = 0; i < startAtIndex - index; i++) {
      const cIndex = startAtIndex - i - 1
      off -= gridCounts[cIndex] || getGridCount(cIndex)
    }
  }
  return off
}


export const weekMargin = 2
export const weekSize = daySize + weekMargin
export const montHeaderHeight = 20
export const monthHeaderSingleMarginTop = 4
export const monthHeaderSingleMarginBottom = 8 + 44 + 12
export const monthHeaderSingleHeight =
  monthHeaderSingleMarginTop + monthHeaderSingleMarginBottom

export function getIndexFromHorizontalOffset(
  offset: number,
  width: number
): number {
  return startAtIndex + Math.floor(offset / width)
}

export function getIndexFromVerticalOffset(offset: number): number {
  let estimatedIndex = startAtIndex + Math.ceil(offset / estimatedMonthHeight)

  const realOffset = getVerticalMonthsOffset(estimatedIndex)
  const difference = (realOffset - beginOffset - offset) / estimatedMonthHeight
  if (difference >= 1 || difference <= -1) {
    estimatedIndex -= Math.floor(difference)
  }
  return estimatedIndex
}

export function getHorizontalMonthOffset(index: number, width: number) {
  if (index < 0) {
    return 0
  }
  return width * index
}

export function getVerticalMonthsOffset(index: number) {
  const count = getIndexCount(index)
  const ob = weeksOffset(index)
  const monthsHeight = weekSize * ob
  const c = monthsHeight + count * (dayNamesHeight + montHeaderHeight)

  return (c || 0) + beginOffset
}

export function getMonthHeight(
  scrollMode: 'horizontal' | 'vertical',
  index: number
): number {
  const calendarHeight = getCalendarHeaderHeight(scrollMode)
  const gc = getGridCount(index)
  const currentMonthHeight = weekSize * gc
  const extraHeight =
    scrollMode === 'horizontal' ? monthHeaderSingleHeight : montHeaderHeight
  const c = calendarHeight + currentMonthHeight + extraHeight
  return c || 0
}

export const buttonContainerHeight = 56
export const buttonContainerMarginTop = 4
export const buttonContainerMarginBottom = 8

export function getCalendarHeaderHeight(scrollMode: 'horizontal' | 'vertical') {
  if (scrollMode === 'horizontal') {
    return (
      buttonContainerHeight +
      buttonContainerMarginTop +
      buttonContainerMarginBottom +
      dayNamesHeight
    )
  }
  return dayNamesHeight
}



export type DisableWeekDaysType = number[]

export function showWeekDay(
  dayIndex: number,
  disableWeekDays?: DisableWeekDaysType
): boolean {
  return !(disableWeekDays && disableWeekDays.some((di) => di === dayIndex))
}

export function dateToUnix(d: Date): number {
  return Math.round(d.getTime() / 1000)
}

export function addMonths(date: Date, count: number) {
  let n = date.getDate()
  let n2 = new Date(date.getTime())
  n2.setDate(1)
  n2.setMonth(n2.getMonth() + count)
  n2.setDate(
    Math.min(
      n,
      getDaysInMonth({ year: n2.getFullYear(), month: n2.getMonth() })
    )
  )

  return n2
}

// https://stackoverflow.com/a/1185068/2508481
// pass in any date as parameter anyDateInMonth based on dayjs
export function getDaysInMonth({
  year,
  month,
}: {
  year: number
  month: number
}): number {
  return [
    31,
    isLeapYear({ year }) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month]
}

export function getFirstDayOfMonth({
  year,
  month,
}: {
  year: number
  month: number
}): number {
  return new Date(year, month, 1).getDay()
}

export function useRangeChecker(validRange: ValidRangeType | undefined) {
  const validStart = validRange?.startDate
  const validEnd = validRange?.endDate
  const startUnix =
    validStart instanceof Date
      ? dateToUnix(getStartOfDay(validStart))
      : undefined

  const endUnix =
    validEnd instanceof Date ? dateToUnix(getEndOfDay(validEnd)) : undefined

  const validDisabledDatesRef = useLatest(validRange?.disabledDates)

  const isWithinValidRange = React.useCallback(
    (day: Date) => {
      return isDateWithinOptionalRange(day, {
        startUnix: startUnix,
        endUnix: endUnix,
      })
    },
    [startUnix, endUnix]
  )

  const isDisabled = React.useCallback(
    (day: Date) => {
      return validDisabledDatesRef.current
        ? validDisabledDatesRef.current.some((disabledDate) =>
          areDatesOnSameDay(disabledDate, day)
        )
        : false
    },
    [validDisabledDatesRef]
  )

  return { isDisabled, isWithinValidRange, validStart, validEnd }
}

export function areDatesOnSameDay(a: Date, b?: Date | null | undefined) {
  if (!b) {
    return false
  }

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

export function isDateBetween(
  date: Date,
  {
    startDate,
    endDate,
  }: {
    startDate?: Date | null | undefined
    endDate?: Date | null | undefined
  }
): boolean {
  if (!startDate || !endDate) {
    return false
  }
  return date <= endDate && date >= startDate
}

/**
 * Check if a date is within an optional range.
 *
 * If the range doesn't exist, it defaults to `true`.
 */
export function isDateWithinOptionalRange(
  date: Date,
  {
    startUnix,
    endUnix,
  }: { startUnix: number | undefined; endUnix: number | undefined }
) {
  const dateUnix = dateToUnix(date)
  // if startUnix is provided and date is before start
  if (startUnix && dateUnix < startUnix) {
    return false
  }

  // if endUnix is provided and date is after end
  if (endUnix && dateUnix > endUnix) {
    return false
  }

  return true
}

export function isLeapYear({ year }: { year: number }) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}



export function getGridCount(index: number) {

  const cHeight = gridCounts[index]
  if (cHeight) {
    return cHeight
  }
  const monthDate = addMonths(new Date(), getRealIndex(index))
  const h = getGridCountForDate(monthDate)
  gridCounts[index] = h
  console.log(gridCounts);

  return h
}

export function getGridCountForDate(date: Date) {
  const year = date.getFullYear()
  const month = date.getMonth()
  const daysInMonth = getDaysInMonth({ year, month })
  const dayOfWeek = getFirstDayOfMonth({ year, month })
  return Math.ceil((daysInMonth + dayOfWeek) / 7)
}

export function getRealIndex(index: number) {
  return index - startAtIndex
}

export function getInitialIndex(date: Date | undefined) {
  if (!date) {
    return startAtIndex
  }

  const today = new Date()
  const months = differenceInMonths(today, date)

  return startAtIndex + months
}

export function useInputFormatter({ locale }: { locale: string | undefined }) {
  return React.useMemo(() => {
    return new Intl.DateTimeFormat(locale, {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
  }, [locale])
}
export function getStartOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)
}
export function getEndOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)
}
export function useInputFormat({
  formatter,
  locale,
}: {
  formatter: Intl.DateTimeFormat
  locale: string | undefined
}) {
  return React.useMemo(() => {
    // TODO: something cleaner and more universal?
    const inputDate = formatter.format(new Date(2020, 10 - 1, 1))
    return inputDate
      .replace('2020', locale === 'pt' ? 'AAAA' : 'YYYY')
      .replace('10', 'MM')
      .replace('01', 'DD')
  }, [formatter, locale])
}

export function differenceInMonths(firstDate: Date, secondDate: Date) {
  let diffMonths = (secondDate.getFullYear() - firstDate.getFullYear()) * 12
  diffMonths -= firstDate.getMonth()
  diffMonths += secondDate.getMonth()
  return diffMonths
}
