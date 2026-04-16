import { updateCaseResult } from '@/services/case-result'

import { CaseResult } from '@/types/testray'

export async function inheritMetadata(
	previousDayIssues: CaseResult[],
	caseResult: CaseResult
) {
	const previousDayCaseResult = previousDayIssues.find(
		({ r_caseToCaseResult_c_caseId }) =>
			r_caseToCaseResult_c_caseId ===
			caseResult.r_caseToCaseResult_c_caseId
	)

	if (!previousDayCaseResult) {
		return caseResult
	}

	const previousUserId = previousDayCaseResult.r_userToCaseResults_userId
	const previousComment = previousDayCaseResult.comment

	const shouldInheritUserId =
		previousUserId && !caseResult.r_userToCaseResults_userId

	const shouldInheritComment = previousComment && !caseResult.comment

	if (!shouldInheritUserId && !shouldInheritComment) {
		return caseResult
	}

	return await updateCaseResult({
		id: caseResult.id,
		userId: shouldInheritUserId ? previousUserId : undefined,
		comment: shouldInheritComment ? previousComment : undefined,
	})
}
