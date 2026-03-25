import {
	IconCircleCheckFilled,
	IconCircleDotFilled,
	IconCircleXFilled,
	IconExclamationCircleFilled,
} from '@tabler/icons-react'

import { Badge } from '@/components/ui/badge'

import { TestResult } from '@/types/test-result'

export function getStatusBadge(status: TestResult['status']) {
	const icon = getStatusIcon(status)

	if (status === 'PASSED') {
		return (
			<Badge className="bg-green-50 text-green-600">
				{icon}

				{getStatusLabel(status)}
			</Badge>
		)
	} else if (status === 'FAILED') {
		return (
			<Badge className="bg-red-50 text-red-600">
				{icon}

				{getStatusLabel(status)}
			</Badge>
		)
	} else if (status === 'BLOCKED') {
		return (
			<Badge className="bg-yellow-50 text-yellow-600">
				{icon}

				{getStatusLabel(status)}
			</Badge>
		)
	} else if (status === 'UNTESTED') {
		return (
			<Badge className="bg-gray-50 text-gray-600">
				{icon}

				{getStatusLabel(status)}
			</Badge>
		)
	}
}

export function getStatusIcon(status: TestResult['status']) {
	if (status === 'PASSED') {
		return <IconCircleCheckFilled className="fill-green-600" />
	} else if (status === 'FAILED') {
		return <IconCircleXFilled className="fill-red-600" />
	} else if (status === 'BLOCKED') {
		return <IconExclamationCircleFilled className="fill-yellow-600" />
	} else if (status === 'UNTESTED') {
		return <IconCircleDotFilled className="fill-gray-600" />
	}
}

export function getStatusLabel(status: TestResult['status']): string {
	const normalized = status.toLowerCase()

	return normalized.charAt(0).toUpperCase() + normalized.slice(1)
}
