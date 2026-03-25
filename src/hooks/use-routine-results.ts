import { useCallback, useEffect, useState } from 'react'

import { NextClient } from '@/lib/next-client'

import { TestResult } from '@/types/test-result'
import { Routine } from '@/types/testray'

export function useRoutineResults(routineId: Routine['id'] | null): {
	loading: boolean
	results: TestResult[]
	date: string
	error: string | null
	refresh: () => Promise<void>
} {
	const [loading, setLoading] = useState(routineId != null)
	const [results, setResults] = useState<TestResult[]>([])
	const [date, setDate] = useState('')
	const [error, setError] = useState<string | null>(null)

	const refresh = useCallback(async () => {
		setLoading(true)
		setError(null)

		const { data, error } = await NextClient.get<{
			results: TestResult[]
			date: string
		}>(`/api/routine-results/${routineId}`)

		if (error || !data) {
			setResults([])
			setDate('')
			setError(error?.message ?? null)
		} else {
			setResults(data.results || [])
			setDate(data.date)
			setError(null)
		}

		setLoading(false)
	}, [routineId])

	useEffect(() => {
		if (!routineId) {
			return
		}

		const load = async () => {
			await refresh()
		}

		load()
	}, [refresh, routineId])

	return { loading, results, date, error, refresh }
}
