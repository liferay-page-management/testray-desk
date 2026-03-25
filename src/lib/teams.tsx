import { IconFile } from '@tabler/icons-react'
import type { ReactNode } from 'react'

import { User } from '@/types/user'

type Team = {
	icon: ReactNode
	name: string
	routineId: number
	users: User[]
}

export const TEAMS: Record<string, Team> = {
	'page-management': {
		icon: <IconFile />,
		name: 'Page Management',
		routineId: 985092,
		users: [
			{ id: 5175336, name: 'Víctor' },
			{ id: 9459540, name: 'Vero' },
			{ id: 12929091, name: 'Georgel' },
			{ id: 10981196, name: 'Chaparro' },
			{ id: 9607391, name: 'Rubén' },
			{ id: 44233335, name: 'Javi' },
			{ id: 33780064, name: 'Lourdes' },
			{ id: 5383891, name: 'Sandro' },
		],
	},
}
