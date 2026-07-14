import { getRoutineBuilds } from '@/services/build'
import { getBuildCaseResults } from '@/services/case-result'
import fs from 'node:fs'
import path from 'node:path'

import { inheritMetadata } from '@/lib/inherit-metadata'
import { ROUTINES } from '@/lib/routines'

import { Build } from '@/types/testray'

function getLastReportedBuildIdFile(routineKey: string): string {
	return path.join(process.cwd(), `.last-reported-build-id-${routineKey}`)
}

function readLastReportedBuildId(routineKey: string): Build['id'] | null {
	try {
		const id = Number(
			fs
				.readFileSync(getLastReportedBuildIdFile(routineKey), 'utf-8')
				.trim()
		)

		return Number.isFinite(id) ? id : null
	} catch {
		return null
	}
}

function writeLastReportedBuildId(routineKey: string, id: Build['id']): void {
	fs.writeFileSync(getLastReportedBuildIdFile(routineKey), String(id))
}

async function updateCaseResults(routineKey: string) {
	const routine = ROUTINES[routineKey]

	const [lastBuild, previousBuild] = await getRoutineBuilds({
		routineId: routine.routineId,
		limit: 2,
	})

	if (!lastBuild) {
		process.stdout.write('false')

		return
	}

	const lastReportedId = readLastReportedBuildId(routineKey)

	if (lastReportedId === lastBuild.id) {
		process.stdout.write('false')

		return
	}

	const sourceBuildId = lastReportedId ?? previousBuild?.id

	if (!sourceBuildId) {
		process.stdout.write('false')

		return
	}

	const previousIssues = await getBuildCaseResults({
		buildId: sourceBuildId,
		statuses: ['FAILED', 'BLOCKED', 'UNTESTED'],
	})

	const caseResults = await getBuildCaseResults({
		buildId: lastBuild.id,
		statuses: ['FAILED', 'BLOCKED', 'UNTESTED'],
	})

	for (const caseResult of caseResults) {
		await inheritMetadata(previousIssues, caseResult)
	}

	writeLastReportedBuildId(routineKey, lastBuild.id)
}

async function main() {
	await Promise.all(
		Object.keys(ROUTINES).map((routineKey) => updateCaseResults(routineKey))
	)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
