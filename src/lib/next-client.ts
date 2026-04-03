type Error = {
	status: number
	message: string
}

type Result<T> = { data: T | null; error: Error | null }

export async function get<T>(url: string): Promise<Result<T>> {
	let data: T | null = null
	let error: Error | null = null

	const response = await fetch(url)

	if (!response.ok) {
		const body = await response.json()

		const message =
			typeof body?.error === 'string'
				? body?.error
				: `Request failed: HTTP ${response.status}`

		error = {
			status: response.status,
			message,
		}

		return { data, error }
	}

	data = await response.json()

	return { data, error }
}

export async function patch<T>(
	url: string,
	payload: Record<string, unknown>
): Promise<{ data: T | null; error: Error | null }> {
	let data: T | null = null
	let error: Error | null = null

	const response = await fetch(url, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(payload),
	})

	if (!response.ok) {
		const body = await response.json()

		const message =
			typeof body?.error === 'string'
				? body?.error
				: `Request failed: HTTP ${response.status}`

		error = {
			status: response.status,
			message,
		}

		return { data, error }
	}

	if (response.status === 204) {
		data = null
	} else {
		data = await response.json()
	}

	return { data, error }
}

export const NextClient = {
	get,
	patch,
}
