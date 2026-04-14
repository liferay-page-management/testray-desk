import { getRoutineBuilds } from '@/services/build'
import { getCases } from '@/services/case'
import { getBuildCaseResults } from '@/services/case-result'
import { getCaseTypes } from '@/services/case-type'
import { getCaseHistories } from '@/services/history'

import { TestResult } from '@/types/test-result'
import { Case, CaseResult, Routine } from '@/types/testray'

import { getTestResult } from './get-test-result'
import { inheritMetadata } from './inherit-metadata'
import { hasHistory } from './test-history'
import { getTypeWeight } from './test-type'

export async function getRoutineResults(routineId: Routine['id']): Promise<{
	results: TestResult[]
	date: string
}> {
	const [lastBuild, previousDayBuild] = await getRoutineBuilds({
		routineId,
		limit: 2,
	})

	const previousDayFailures = await getBuildCaseResults({
		buildId: previousDayBuild.id,
		statuses: ['FAILED'],
	})

	const caseResults = await getBuildCaseResults({
		buildId: lastBuild.id,
		statuses: ['FAILED', 'BLOCKED', 'UNTESTED'],
	})

	const caseIds = caseResults.map(
		(caseResult) => caseResult.r_caseToCaseResult_c_caseId
	)

	const cases = await getCases(caseIds)

	const caseTypeIds = [
		...new Set(
			cases.map((caseItem) => caseItem.r_caseTypeToCases_c_caseTypeId)
		),
	]

	const caseTypes = await getCaseTypes(caseTypeIds)

	const histories = await getCaseHistories({
		caseIds: cases
			.filter((testCase) => hasHistory(testCase))
			.map((testCase) => testCase.id),
		routineId,
	})

	const casesMap = new Map(cases.map((caseItem) => [caseItem.id, caseItem]))

	const results = []

	for (let caseResult of caseResults) {
		const caseId = caseResult.r_caseToCaseResult_c_caseId

		const testCase = casesMap.get(caseId)

		if (!testCase || testCase.name === 'Top Level Build') {
			continue
		}

		caseResult = await inheritMetadata(previousDayFailures, caseResult)

		const history = histories.get(testCase.id) ?? null

		const isNew = isNewFailure(caseResult, testCase, previousDayFailures)

		const result = getTestResult({
			caseResult,
			testCase,
			isNew,
			caseTypes,
			history,
		})

		results.push(result)
	}

	sortResults(results)

	return { results, date: lastBuild.dateCreated }
}

function isNewFailure(
	caseResult: CaseResult,
	testCase: Case,
	previousCaseResults: CaseResult[]
) {
	if (caseResult.dueStatus.key !== 'FAILED') {
		return false
	}

	const caseIds = new Set(
		previousCaseResults.map(
			(caseResult) => caseResult.r_caseToCaseResult_c_caseId
		)
	)

	return !caseIds.has(testCase.id)
}

function sortResults(results: TestResult[]) {
	return results.sort((a, b) => getTypeWeight(a.type) - getTypeWeight(b.type))
}
