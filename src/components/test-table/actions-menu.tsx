'use client'

import { IconDots, IconExternalLink } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { TestResult } from '@/types/test-result'

export function ActionsMenu({ testResult }: { testResult: TestResult }) {
	if (testResult.status !== 'FAILED') {
		return null
	}

	const options = getOptions(testResult)

	if (!options.length) {
		return null
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="icon-sm"
					aria-label="Open test actions"
				>
					<IconDots className="size-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end">
				{options.map((option, i) => (
					<DropdownMenuItem key={i} onSelect={option.onSelect}>
						{option.label}

						{option.icon}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

function getOptions(testResult: TestResult) {
	const options = []

	if (testResult.links.playwrightReport) {
		options.push({
			label: 'Playwright report',
			icon: <IconExternalLink />,
			onSelect: () => {
				window.open(
					testResult.links.playwrightReport,
					'_blank',
					'noopener,noreferrer'
				)
			},
		})
	}

	if (testResult.links.failureMessages) {
		options.push({
			label: 'Failure messages',
			icon: <IconExternalLink />,
			onSelect: () => {
				window.open(
					testResult.links.failureMessages,
					'_blank',
					'noopener,noreferrer'
				)
			},
		})
	}

	if (
		testResult.links.jenkinsConsole &&
		!['Playwright Test', 'JS Unit Test'].includes(testResult.type)
	) {
		options.push({
			label: 'Jenkins Console',
			icon: <IconExternalLink />,
			onSelect: () => {
				window.open(
					testResult.links.jenkinsConsole,
					'_blank',
					'noopener,noreferrer'
				)
			},
		})
	}

	return options
}
