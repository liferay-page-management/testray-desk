import { updateCaseResult } from '@/services/case-result'
import { NextResponse } from 'next/server'

import { nextRoute } from '@/lib/next-route'

export const PATCH = nextRoute({
	handler: async (request: Request) => {
		const body = await request.json()

		const { id, userId, comment } = body

		await updateCaseResult({ id, userId, comment })

		return NextResponse.json({ success: true })
	},
	error: 'Unable to update test case result',
})
