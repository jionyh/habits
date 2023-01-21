import { useState } from 'react'
import {
	ScrollView,
	Alert,
	View,
	Text,
	TextInput,
	TouchableOpacity,
} from 'react-native'
import { BackButton } from '../components/BackButton'
import { Checkbox } from '../components/Checkbox'
import { Feather } from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import colors from 'tailwindcss/colors'
import { api } from '../lib/axios'

const availableWeeDays = [
	'Domingo',
	'Segunda-Feira',
	'Terça-Feira',
	'Quarta-Feira',
	'Quinta-Feira',
	'Sexta-Feira',
	'Sábado',
]

export function New() {
	const [title, setTitle] = useState('')
	const [weekDays, setWeekDays] = useState<number[]>([])

	function handleToggleWeekDay(weekDayIndex: number) {
		if (weekDays.includes(weekDayIndex)) {
			setWeekDays((prevState) =>
				prevState.filter((weekDay) => weekDay !== weekDayIndex)
			)
		} else {
			setWeekDays((prevState) => [...prevState, weekDayIndex])
		}
	}
	async function handleCreateNewHabit() {
		try {
			if (!title.trim() || weekDays.length === 0) {
				return Alert.alert(
					'Novo Hábito',
					'Informe o nome do hábito e escolha a periocidade'
				)
			}
			await api.post('/habits', { title, weekDays })
			setTitle('')
			setWeekDays([])
			Alert.alert('Novo Hábito', 'Hábito criado com sucesso!')
		} catch (e) {
			console.log(e)
			Alert.alert('Ops', 'Não foi possível criar o novo hábito')
		}
	}

	return (
		<View className='flex-1 bg-background px-8 pt-16'>
			<ScrollView
				contentContainerStyle={{ paddingBottom: 100 }}
				showsVerticalScrollIndicator={false}>
				<BackButton />
				<Text className='mt-6 text-white font-extrabold text-3xl'>
					Criar hábito
				</Text>
				<Text className='mt-6 text-white font-extrabold text-base'>
					Qual seu comprometimento?
				</Text>

				<TextInput
					className='h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-2 focus:border-green-600'
					placeholder='Exercícios, dormir bem, etc...'
					placeholderTextColor={colors.zinc[400]}
					onChangeText={setTitle}
					value={title}></TextInput>
				<Text className='font-semibold mt-4 mb-3 text-white text-base'>
					Qual a recorrência?
				</Text>

				{availableWeeDays.map((weekDay, index) => (
					<Checkbox
						title={weekDay}
						key={weekDay}
						checked={weekDays.includes(index)}
						onPress={() => handleToggleWeekDay(index)}
					/>
				))}
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={handleCreateNewHabit}
					className='w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6'>
					<Feather name='check' size={20} color={Colors.white} />
					<Text className='font-semibold text-base text-white ml-2'>
						Confirmar
					</Text>
				</TouchableOpacity>
			</ScrollView>
		</View>
	)
}
