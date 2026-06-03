import { updateCaseResult } from '@/services/case-result'
import { NextResponse } from 'next/server'

import { invalidate } from '@/lib/cache'
import { nextRoute } from '@/lib/next-route'

export const PATCH = nextRoute({
	handler: async (request: Request) => {
		const body = await request.json()

		const { id, routineId, userId, comment } = body

		await updateCaseResult({ id, userId, comment })

		await invalidate(routineId)

		return NextResponse.json({ success: true })
	},
	error: 'Unable to update test case result',
})
