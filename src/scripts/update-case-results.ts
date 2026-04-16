import { getRoutineBuilds } from '@/services/build'
import { getBuildCaseResults } from '@/services/case-result'

import { inheritMetadata } from '@/lib/inherit-metadata'
import { TEAMS } from '@/lib/teams'

import { Routine } from '@/types/testray'

async function updateCaseResults(routineId: Routine['id']) {
	const [lastBuild, previousDayBuild] = await getRoutineBuilds({
		routineId,
		limit: 2,
	})

	const previousDayIssues = await getBuildCaseResults({
		buildId: previousDayBuild.id,
		statuses: ['FAILED', 'BLOCKED', 'UNTESTED'],
	})

	const caseResults = await getBuildCaseResults({
		buildId: lastBuild.id,
		statuses: ['FAILED', 'BLOCKED', 'UNTESTED'],
	})

	for (const caseResult of caseResults) {
		await inheritMetadata(previousDayIssues, caseResult)
	}
}

async function main() {
	for (const team of Object.values(TEAMS)) {
		updateCaseResults(team.routineId)
	}
}

main()
