import { Icon } from '@iconify/react'
import { IconBrowser, IconStack2 } from '@tabler/icons-react'
import { ReactNode } from 'react'

import { TestResult } from '@/types/test-result'

type TypeName = TestResult['type'] | 'Java Log Assertor'

export function getTypeLabel(typeName: TypeName) {
	if (typeName === 'Playwright Test') {
		return 'Playwright'
	} else if (typeName === 'Modules Integration Test') {
		return 'Java Integration'
	} else if (typeName === 'Modules Unit Test') {
		return 'Java Unit'
	} else if (typeName === 'Modules Semantic Versioning Test') {
		return 'Java Semantic Versioning'
	} else if (typeName === 'Automated Functional Test') {
		return 'Poshi'
	} else if (typeName === 'JS Unit Test') {
		return 'JavaScript'
	}

	return typeName
}

export function getTypeIcon(typeName: TypeName, size: number = 20): ReactNode {
	if (
		typeName === 'Modules Integration Test' ||
		typeName === 'Modules Semantic Versioning Test' ||
		typeName === 'Modules Unit Test' ||
		typeName === 'Java Log Assertor'
	) {
		return <Icon icon="logos:java" width={size} />
	}

	if (typeName === 'Playwright Test') {
		return <Icon icon="material-icon-theme:playwright" width={size} />
	}

	if (typeName === 'Automated Functional Test') {
		return <IconBrowser size={size} />
	}

	if (typeName === 'JS Unit Test') {
		return <Icon icon="devicon:javascript" width={size} />
	}

	if (typeName === 'Batch') {
		return <IconStack2 size={size} />
	}

	return null
}

export function getTypeWeight(typeName: TypeName): number {
	const WEIGHTS = {
		'Playwright Test': 0,
		'JS Unit Test': 1,
		'Modules Integration Test': 2,
		'Java Log Assertor': 4,
		'Modules Unit Test': 3,
		'Modules Semantic Versioning Test': 5,
		'Automated Functional Test': 6,
		'Batch': 7,
	}

	return WEIGHTS[typeName] ?? 99
}
