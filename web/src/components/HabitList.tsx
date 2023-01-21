import { Check } from 'phosphor-react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { api } from '../lib/axios'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

interface HabitListProps {
	date: Date
	onCompletedChanged: (completed: number) => void
}

interface HabitsInfo {
	possibleHabits: {
		id: string
		title: string
		create_at: string
	}[]
	completedHabits: string[]
}

export const HabitList = ({ date, onCompletedChanged }: HabitListProps) => {
	const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

	useEffect(() => {
		api
			.get('day', {
				params: {
					date: date.toISOString(),
				},
			})
			.then((res) => setHabitsInfo(res.data))
	}, [])

	const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

	async function handleToggleHabit(habitId: string) {
		await api.patch(`/habits/${habitId}/toggle`)

		let completedHabits: string[] = []

		const isHabitAlreadyCompleted =
			habitsInfo!.completedHabits.includes(habitId)
		if (isHabitAlreadyCompleted) {
			completedHabits = habitsInfo!.completedHabits.filter(
				(id) => id !== habitId
			)
			setHabitsInfo({
				possibleHabits: habitsInfo!.possibleHabits,
				completedHabits,
			})
		} else {
			completedHabits = [...habitsInfo!.completedHabits, habitId]
		}
		setHabitsInfo({
			possibleHabits: habitsInfo!.possibleHabits,
			completedHabits,
		})
		onCompletedChanged(completedHabits.length)
	}

	return (
		<div className='mt-6 flex flex-col gap-3'>
			{habitsInfo?.possibleHabits.map((habit) => (
				<Checkbox.Root
					key={habit.id}
					checked={habitsInfo.completedHabits.includes(habit.id)}
					disabled={isDateInPast}
					onCheckedChange={() => handleToggleHabit(habit.id)}
					className='flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed'>
					<div className='transition-colors h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500  group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-background'>
						<Checkbox.Indicator>
							<Check size={20} className='text-white' />
						</Checkbox.Indicator>
					</div>
					<span className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
						{habit.title}
					</span>
				</Checkbox.Root>
			))}
		</div>
	)
}
