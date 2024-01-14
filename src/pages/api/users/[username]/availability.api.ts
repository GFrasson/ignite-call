import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../../lib/prisma'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const username = String(req.query.username)
  const { date } = req.query

  if (!date) {
    return res.status(400).json({ message: 'Date not provided.' })
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return res.status(400).json({ message: 'User does not exist.' })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(dayjs())

  if (isPastDate) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) =>
        dayjs(blockedTime.date).tz('America/Sao_Paulo').hour() === time,
    )

    const isTimeInPast = referenceDate
      .set('hour', time)
      .isBefore(dayjs().tz('America/Sao_Paulo'))

    return !isTimeBlocked && !isTimeInPast
  })

  console.log(dayjs(blockedTimes[0].date).tz('America/Sao_Paulo'))

  return res.json({ possibleTimes, availableTimes })
  // return res.json({
  //   possibleTimes,
  //   availableTimes,
  //   blockedDateHour:
  //     blockedTimes.length > 0
  //       ? dayjs(blockedTimes[0].date).locale('pt-br').hour()
  //       : null,
  //   blockedDateGetHour:
  //     blockedTimes.length > 0
  //       ? dayjs(blockedTimes[0].date).locale('pt-br').get('hour')
  //       : null,
  //   blockedDateGetHours:
  //     blockedTimes.length > 0
  //       ? dayjs(blockedTimes[0].date).locale('pt-br').get('hours')
  //       : null,
  //   locale:
  //     blockedTimes.length > 0
  //       ? dayjs(blockedTimes[0].date).locale('pt-br').locale()
  //       : null,
  //   localeLocal:
  //     blockedTimes.length > 0
  //       ? dayjs(blockedTimes[0].date).locale('pt-br').format()
  //       : null,
  //   dateUTC:
  //     blockedTimes.length > 0
  //       ? blockedTimes[0].date.getTimezoneOffset() / 60
  //       : null,
  //   dateTimezone: dayjs(blockedTimes[0].date).tz('America/Sao_Paulo').hour(),
  //   todate: dayjs().tz('America/Sao_Paulo').toDate(),
  // })
}
