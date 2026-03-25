import { NextResponse } from 'next/server'

import { TestrayException } from '@/lib/testray-exception'

export function nextRoute<TArgs extends unknown[]>({
	handler,
	error,
}: {
	handler: (request: Request, ...args: TArgs) => Promise<Response>
	error: string
}) {
	return async (request: Request, ...args: TArgs) => {
		try {
			return await handler(request, ...args)
		} catch (e) {
			if (e instanceof TestrayException) {
				return NextResponse.json(
					{ error: e.message },
					{ status: e.status }
				)
			}

			return NextResponse.json({ error }, { status: 500 })
		}
	}
}
