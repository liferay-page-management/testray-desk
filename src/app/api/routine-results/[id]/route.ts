import { NextResponse } from 'next/server'

import { getRoutineResults } from '@/lib/get-routine-results'
import { nextRoute } from '@/lib/next-route'

export const GET = nextRoute({
	handler: async (
		request: Request,
		{ params }: { params: Promise<{ id: string }> }
	) => {
		const { id } = await params

		const routineId = Number(id)

		const data = await getRoutineResults(routineId)

		return NextResponse.json(data)
	},
	error: 'Unable to fetch routine results',
})
