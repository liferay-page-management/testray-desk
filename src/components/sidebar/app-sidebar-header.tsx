'use client'

import { useParams } from 'next/navigation'

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

import { TEAMS } from '@/lib/teams'

export function AppSidebarHeader() {
	const params = useParams<{ id?: string }>()

	const teamId = params.id

	const team = teamId ? TEAMS[teamId] : null

	return (
		<header className="flex gap-4 h-16 items-center border-b p-4">
			<SidebarTrigger />

			{team ? (
				<>
					<Separator orientation="vertical" />

					<div className="flex items-center gap-2 font-medium">
						<span className="[&>svg]:size-5">{team.icon}</span>

						<span className="text-base">{team.name}</span>
					</div>
				</>
			) : null}
		</header>
	)
}
