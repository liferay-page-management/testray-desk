import { NextResponse } from 'next/server'

import { readCache, writeCache } from '@/lib/cache'
import { getRoutineResults } from '@/lib/get-routine-results'
import { nextRoute } from '@/lib/next-route'

export const GET = nextRoute({
	handler: async (
		request: Request,
		{ params }: { params: Promise<{ id: string }> }
	) => {
		const { id } = await params

		const routineId = Number(id)

		const cached = await readCache(routineId)

		if (cached) {
			return NextResponse.json(cached)
		}

		const data = await getRoutineResults(routineId)

		await writeCache(routineId, data)

		return NextResponse.json(data)
	},
	error: 'Unable to fetch routine results',
})
