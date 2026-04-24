import { useCallback, useEffect, useState } from 'react'

import { NextClient } from '@/lib/next-client'

import { TestResult } from '@/types/test-result'
import { Build, Routine } from '@/types/testray'

type RoutineBuild = { id: Build['id']; date: string; gitHash: string }

export function useRoutineResults(routineId: Routine['id'] | null): {
	loading: boolean
	results: TestResult[]
	build: RoutineBuild | null
	error: string | null
	refresh: () => Promise<void>
} {
	const [loading, setLoading] = useState(routineId != null)
	const [results, setResults] = useState<TestResult[]>([])
	const [build, setBuild] = useState<RoutineBuild | null>(null)
	const [error, setError] = useState<string | null>(null)

	const refresh = useCallback(async () => {
		setLoading(true)
		setError(null)

		const { data, error } = await NextClient.get<{
			results: TestResult[]
			build: RoutineBuild
		}>(`/api/routine-results/${routineId}`)

		if (error || !data) {
			setResults([])
			setBuild(null)
			setError(error?.message ?? null)
		} else {
			setResults(data.results || [])
			setBuild(data.build)
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

	return { loading, results, build, error, refresh }
}
