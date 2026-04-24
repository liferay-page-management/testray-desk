'use client'

import { Download } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { TestResult } from '@/types/test-result'

export function ExportButton({ results }: { results: TestResult[] }) {
	const handleExport = () => {
		const payload = buildExport(results)

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

function buildExport(results: TestResult[]) {
	return []
}
