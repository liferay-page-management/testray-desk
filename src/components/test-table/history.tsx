'use client'

import { HistoryIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'

import { NextClient } from '@/lib/next-client'
import { hasHistory } from '@/lib/test-history'

import { TestResult } from '@/types/test-result'
import { Routine } from '@/types/testray'

export function History({
	testResult,
	routineId,
}: {
	testResult: TestResult
	routineId: Routine['id']
}) {
	const [history, setHistory] = useState(testResult.history)
	const [loading, setLoading] = useState(false)

	if (history) {
		const total = history.length

		const failed = history.filter(
			(entry) => entry.status === 'FAILED'
		).length

		return `Failed ${failed} of last ${total}`
	}

	if (!hasHistory(testResult)) {
		return null
	}

	const onGetHistory = async () => {
		setLoading(true)

		const params = new URLSearchParams({
			routineId: String(routineId),
		})

		const { data, error } = await NextClient.get<{
			history: TestResult['history']
		}>(`/api/case-history/${testResult.caseId}?${params.toString()}`)

		if (error) {
			toast.error(String(error.status), {
				description: error.message,
			})
		} else {
			setHistory(data?.history ?? [])
		}

		setLoading(false)
	}

	return (
		<Button
			type="button"
			variant="outline"
			size="sm"
			onClick={onGetHistory}
			disabled={loading}
		>
			<HistoryIcon />
			Show history
			{loading && <Spinner className="mr-1" />}
		</Button>
	)
}
