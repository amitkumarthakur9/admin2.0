import * as React from 'react'
import { StyleSheet, View } from 'react-native'
import {
  IconButton,
  Text,
  useTheme,
  TouchableRipple,
  MD2Theme,
} from 'react-native-paper'
import Day, { EmptyDay } from './Day'


import type {
  CalendarDate,
  CalendarDates,
  ModeType,
  ValidRangeType,
} from './Calendar'
import { dayNamesHeight } from './DayNames'
import {
  daySize, getIndexCount, getMonthHeight, montHeaderHeight, monthGrid, monthHeaderSingleMarginBottom, monthHeaderSingleMarginTop, useTextColorOnPrimary, weekMargin, weeksOffset, addMonths,
  areDatesOnSameDay,
  DisableWeekDaysType,
  getDaysInMonth,
  getFirstDayOfMonth,
  getRealIndex,
  getGridCount,
  isDateBetween,
  showWeekDay,
  useRangeChecker,
} from '../utils'

interface BaseMonthProps {
  locale: undefined | string
  scrollMode: 'horizontal' | 'vertical'
  disableWeekDays?: DisableWeekDaysType
  mode: ModeType
  index: number
  onPressYear: (year: number) => any
  selectingYear: boolean
  onPressDate: (date: Date) => any
  primaryColor: string
  selectColor: string
  roundness: number
  validRange?: ValidRangeType

  // some of these should be required in final implementation
  startDate?: CalendarDate
  endDate?: CalendarDate
  date?: CalendarDate
  dates?: CalendarDates
}

interface MonthRangeProps extends BaseMonthProps {
  mode: 'range'
  startDate: CalendarDate
  endDate: CalendarDate
}

interface MonthSingleProps extends BaseMonthProps {
  mode: 'single'
  date: CalendarDate
}

interface MonthMultiProps extends BaseMonthProps {
  mode: 'multiple'
  dates: CalendarDates
}

function Month(props: MonthSingleProps | MonthRangeProps | MonthMultiProps) {
  const {
    index,
    mode,
    date,
    dates,
    startDate,
    endDate,
    onPressYear,
    selectingYear,
    onPressDate,
    scrollMode,
    primaryColor,
    selectColor,
    roundness,
    disableWeekDays,
    locale,
    validRange,
  } = props
  const theme = useTheme()
  const textColorOnPrimary = useTextColorOnPrimary()
  const realIndex = getRealIndex(index)
  const isHorizontal = scrollMode === 'horizontal'
  const { isDisabled, isWithinValidRange } = useRangeChecker(validRange)
  const { monthName, month, year } = React.useMemo(() => {
    const md = addMonths(new Date(), realIndex)
    const y = md.getFullYear()
    const m = md.getMonth()
    const formatter = new Intl.DateTimeFormat(locale, {
      month: 'long',
    })
    console.log('md', md);

    return { monthName: formatter.format(md), month: m, year: y }
  }, [realIndex, locale])

  const grid = React.useMemo(() => {
    const today = new Date()

    const daysInMonth = getDaysInMonth({ year, month })
    const dayOfWeek = getFirstDayOfMonth({ year, month })
    const emptyDays = dayOfWeek

    return monthGrid(index).map(({ days, weekGrid }) => {
      return {
        weekIndex: weekGrid,
        generatedDays: days.map((_, dayIndex) => {
          const isFirstWeek = weekGrid === 0
          const realDayIndex = emptyDays - dayIndex
          const beforeWeekDay = isFirstWeek && realDayIndex > 0
          const dayOfMonth = weekGrid * 7 + dayIndex - emptyDays + 1
          const afterWeekDay = dayOfMonth > daysInMonth

          const day = new Date(year, month, dayOfMonth)
          const isToday = areDatesOnSameDay(day, today)

          let inRange = false
          let disabled = isDisabled(day)
          let selected = false

          let leftCrop = dayOfMonth === 1
          let rightCrop = dayOfMonth === daysInMonth

          const isFirstDayOfMonth = dayOfMonth === 1
          const isLastDayOfMonth = dayOfMonth === daysInMonth

          if (mode === 'range') {
            const selectedStartDay = areDatesOnSameDay(day, startDate)
            const selectedEndDay = areDatesOnSameDay(day, endDate)
            selected = selectedStartDay || selectedEndDay
            inRange = isDateBetween(day, {
              startDate,
              endDate,
            })
            if (selectedStartDay) {
              leftCrop = true
            }
            if (selectedEndDay) {
              rightCrop = true
            }
            if (dayIndex === 0 && !selectedStartDay) {
              leftCrop = false
            }

            if (dayIndex === 6 && !selectedEndDay) {
              rightCrop = false
            }

            if (
              (isFirstDayOfMonth && selectedEndDay) ||
              (isLastDayOfMonth && selectedStartDay)
            ) {
              inRange = false
            }
          } else if (mode === 'multiple') {
            const safeDates = dates || []
            selected = safeDates.some((d) => areDatesOnSameDay(day, d))

            const yesterday = new Date(year, month, dayOfMonth - 1)
            const tomorrow = new Date(year, month, dayOfMonth + 1)

            const yesterdaySelected = safeDates.some((d) =>
              areDatesOnSameDay(d, yesterday)
            )
            const tomorrowSelected = safeDates.some((d) =>
              areDatesOnSameDay(d, tomorrow)
            )

            if (selected) {
              if (tomorrowSelected && yesterdaySelected) {
                inRange = true
              }
              if (tomorrowSelected && !yesterdaySelected) {
                inRange = true
                leftCrop = true
              }

              if (yesterdaySelected && !tomorrowSelected) {
                inRange = true
                rightCrop = true
              }

              if (isFirstDayOfMonth && !tomorrowSelected) {
                inRange = false
              }

              if (isLastDayOfMonth && !yesterdaySelected) {
                inRange = false
              }

              if (inRange && !leftCrop && !rightCrop) {
                selected = false
              }
            }
          } else if (mode === 'single') {
            selected = areDatesOnSameDay(day, date)
          }

          const isWithinOptionalValidRange = isWithinValidRange(day)

          if (inRange && !disabled) {
            disabled = false
          }

          if (!isWithinOptionalValidRange) {
            disabled = true
          }

          return {
            beforeWeekDay,
            afterWeekDay,
            year,
            month,
            dayOfMonth,
            dayIndex,
            mode,
            selected,
            inRange,
            leftCrop,
            rightCrop,
            isToday,
            disabled,
          }
        }),
      }
    })
  }, [
    year,
    month,
    index,
    isDisabled,
    mode,
    isWithinValidRange,
    startDate,
    endDate,
    dates,
    date,
  ])

  let textFont = theme?.isV3
    ? theme.fonts.titleSmall
    : (theme as any as MD2Theme).fonts.medium

  return (
    <View style={[styles.month, { height: getMonthHeight(scrollMode, index) }]}>
      <View
        style={[
          styles.monthHeader,
          isHorizontal
            ? {
              marginTop: monthHeaderSingleMarginTop,
              marginBottom: monthHeaderSingleMarginBottom,
            }
            : null,
        ]}
      >
        <TouchableRipple
          disabled={!isHorizontal}
          onPress={isHorizontal ? () => onPressYear(year) : undefined}
          accessibilityRole="button"
          accessibilityLabel={`${monthName} ${year}`}
          style={[
            styles.yearButton,
            {
              borderRadius: roundness,
            },
          ]}
        >
          <View
            style={[
              styles.yearButtonInner,
              {
                borderRadius: roundness,
              },
            ]}
          >
            <Text
              maxFontSizeMultiplier={1.5}
              style={[
                styles.monthLabel,
                {
                  ...textFont,
                  color: theme.isV3
                    ? theme.colors.onSurfaceVariant
                    : theme.colors.onSurface,
                },
              ]}
              selectable={false}
            >
              {monthName} {year}
            </Text>
            <View style={isHorizontal ? styles.opacity1 : styles.opacity0}>
              <IconButton
                onPress={isHorizontal ? () => onPressYear(year) : undefined}
                icon={
                  selectingYear
                    ? theme.isV3
                      ? 'menu-up'
                      : 'chevron-up'
                    : theme.isV3
                      ? 'menu-down'
                      : 'chevron-down'
                }
              />
            </View>
          </View>
        </TouchableRipple>
      </View>
      {grid.map(({ weekIndex, generatedDays }) => (
        <View style={styles.week} key={weekIndex}>
          {/* <>
            <Text>{weekIndex}</Text>
          </> */}
          {generatedDays
            .filter((gd) => showWeekDay(gd.dayIndex, disableWeekDays))
            .map((gd) =>
              gd.beforeWeekDay || gd.afterWeekDay ? (
                <EmptyDay key={gd.dayIndex} />
              ) : (
                <Day
                  key={gd.dayIndex}
                  theme={theme}
                  day={gd.dayOfMonth}
                  month={gd.month}
                  year={gd.year}
                  selected={gd.selected}
                  inRange={gd.inRange}
                  leftCrop={gd.leftCrop}
                  rightCrop={gd.rightCrop}
                  onPressDate={onPressDate}
                  isToday={gd.isToday}
                  selectColor={selectColor}
                  primaryColor={primaryColor}
                  disabled={gd.disabled}
                  textColorOnPrimary={textColorOnPrimary}
                />
              )
            )}
        </View>
      ))}
    </View>
  )
}



const styles = StyleSheet.create({
  week: {
    flexDirection: 'row',
    marginBottom: weekMargin,
    height: daySize,
  },
  month: {},
  monthHeader: {
    height: montHeaderHeight,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  monthLabel: { fontSize: 14, opacity: 0.7 },
  yearButton: { alignSelf: 'flex-start', marginLeft: 6 },
  yearButtonInner: {
    paddingLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  opacity0: { opacity: 0 },
  opacity1: { opacity: 1 },
})


export default React.memo(Month)