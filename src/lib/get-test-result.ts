import { TestResult } from '@/types/test-result'
import { Case, CaseResult, CaseType, History } from '@/types/testray'

import { parseHistory } from './test-history'

export function getTestResult({
	caseResult,
	testCase,
	history,
	isNew,
	caseTypes,
}: {
	caseResult: CaseResult
	testCase: Case
	history: History | null
	isNew: boolean
	caseTypes: CaseType[]
}): TestResult {
	const type = getType(testCase, caseTypes)

	return {
		userId: caseResult.r_userToCaseResults_userId,
		comment: caseResult.comment,
		caseResultId: caseResult.id,
		caseId: testCase.id,
		name: testCase.name,
		history: history && parseHistory(history),
		status: caseResult.dueStatus.key,
		type,
		isNew,
		links: getLinks(caseResult.attachments),
	}
}

function getLinks(attachments: CaseResult['attachments']): TestResult['links'] {
	const parsedAttachaments = parseAttachments(attachments)

	return {
		playwrightReport: parsedAttachaments['Playwright Report']?.url,
		failureMessages: parsedAttachaments['Failure Messages']?.url,
	}
}

function getType(testCase: Case, types: CaseType[]): TestResult['type'] {
	if (testCase.name.includes('PortalLogAssertor')) {
		return 'Java Log Assertor'
	}

	const type = types.find(
		({ id }) => id === testCase.r_caseTypeToCases_c_caseTypeId
	)

	return type!.name
}

function parseAttachments(attachments: CaseResult['attachments']) {
	if (!attachments) {
		return {}
	}

	const parsed = JSON.parse(attachments)

	const entries: Record<string, { url?: string; value?: string }> = {}

	for (const item of parsed) {
		if (typeof item !== 'object' || item === null) {
			continue
		}

		const attachment = item as {
			name?: string
			url?: string
			value?: string
		}

		if (!attachment.name) {
			continue
		}

		entries[attachment.name] = {
			url: attachment.url,
			value: attachment.value,
		}
	}

	return entries
}
