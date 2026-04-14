import { getCaseHistory } from '@/services/history'
import { NextResponse } from 'next/server'

import { nextRoute } from '@/lib/next-route'
import { parseHistory } from '@/lib/test-history'

export const GET = nextRoute({
	handler: async (
		request: Request,
		{ params }: { params: Promise<{ id: string }> }
	) => {
		const { id } = await params
		const { searchParams } = new URL(request.url)

		const routineId = searchParams.get('routineId')
			? Number(searchParams.get('routineId'))
			: undefined

		const history = await getCaseHistory({
			caseId: Number(id),
			routineId,
			pageSize: 50,
		})

		return NextResponse.json({ history: parseHistory(history) })
	},
	error: 'Unable to fetch case history',
})
