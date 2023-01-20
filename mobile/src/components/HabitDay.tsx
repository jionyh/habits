import {
	TouchableOpacity,
	Dimensions,
	TouchableOpacityProps,
} from 'react-native'
import { generateProgressPercetage } from '../utils/generate-progress-percetage'
import clsx from 'clsx'
import dayjs from 'dayjs'

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BETWEEN = 8
export const DAY_SIZE =
	Dimensions.get('screen').width / WEEK_DAYS - (SCREEN_HORIZONTAL_PADDING + 5)

interface Props extends TouchableOpacityProps {
	amountOfHabits?: number
	amountCompleted?: number
	date: Date
}

export function HabitDay({
	amountCompleted = 0,
	amountOfHabits = 0,
	date,
	...rest
}: Props) {
	const completedPercentage =
		amountOfHabits > 0
			? generateProgressPercetage(amountOfHabits, amountCompleted)
			: 0
	const today = dayjs().startOf('day').toDate()
	const isCurrentDay = dayjs(date).isSame(today)
	return (
		<TouchableOpacity
			className={clsx('m-1 border-2 rounded-lg', {
				'bg-violet-500 border-violet-400': completedPercentage >= 80,
				'bg-violet-600 border-violet-500':
					completedPercentage >= 60 && completedPercentage < 60,
				'bg-violet-700 border-violet-600':
					completedPercentage >= 20 && completedPercentage < 40,
				'bg-violet-900 border-violet-700':
					completedPercentage > 0 && completedPercentage < 20,
				'bg-zinc-900 border-zinc-800': completedPercentage === 0,
				'border-white border-3': isCurrentDay,
			})}
			activeOpacity={0.7}
			style={{ width: DAY_SIZE, height: DAY_SIZE }}
			{...rest}
		/>
	)
}
