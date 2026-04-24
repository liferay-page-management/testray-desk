'use client'

import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { getTypeLabel } from '@/lib/test-type'

import { TestResult } from '@/types/test-result'
import { Build } from '@/types/testray'

type RoutineBuild = { id: Build['id']; date: string; gitHash: string }

export function ExportButton({
	results,
	build,
}: {
	results: TestResult[]
	build: RoutineBuild
}) {
	const handleExport = () => {
		const payload = buildExport(results, build)

		const blob = new Blob([JSON.stringify(payload, null, 2)], {
			type: 'application/json',
		})

		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')

		document.body.appendChild(link)

		link.href = url
		link.download = `test-failures-${new Date().toISOString().split('T')[0]}.json`

		link.click()

		document.body.removeChild(link)

		URL.revokeObjectURL(url)
	}

	return (
		<Button variant="outline" size="sm" onClick={handleExport}>
			<Download className="size-4" />
			Export as JSON
		</Button>
	)
}

function buildExport(results: TestResult[], build: RoutineBuild) {
	return {
		buildId: build.id,
		buildDate: build.date,
		hash: build.gitHash,
		failures: results.map((result) => {
			if (result.type === 'Java Log Assertor') {
				return {
					name: result.name,
					type: getTypeLabel(result.type),
					errors: result.errors,
				}
			}

			const { lastPassedHash, firstFailedHash } = findHashes(
				result.history
			)

			return {
				name: result.name,
				type: getTypeLabel(result.type),
				errors: result.errors,
				lastPassedHash,
				firstFailedHash,
			}
		}),
	}
}

function findHashes(history: TestResult['history']) {
	if (!history) {
		return { lastPassedHash: null, firstFailedHash: null }
	}

	let lastPassedHash: string | null = null
	let firstFailedHash: string | null = null

	for (const entry of history) {
		if (entry.status === 'PASSED') {
			lastPassedHash = entry.gitHash
			break
		}

		if (entry.status === 'FAILED') {
			firstFailedHash = entry.gitHash
		}
	}

	return { lastPassedHash, firstFailedHash }
}
