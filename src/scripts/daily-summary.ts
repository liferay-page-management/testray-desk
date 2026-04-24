import { getRoutineBuilds } from '@/services/build'
import fs from 'node:fs'
import path from 'node:path'

import { getRoutineResults } from '@/lib/get-routine-results'
import { TEAMS } from '@/lib/teams'

import { TestResult } from '@/types/test-result'
import { Build, Routine } from '@/types/testray'

const EMOJI_PLAYWRIGHT = ':playwright:'
const EMOJI_JAVA = ':java:'

const LAST_REPORTED_BUILD_ID_FILE = path.join(
	process.cwd(),
	'.last-reported-build-id'
)

function formatResult(result: TestResult): string {
	const isPlaywright = result.type === 'Playwright Test'
	const emoji = isPlaywright ? EMOJI_PLAYWRIGHT : EMOJI_JAVA
	const link = isPlaywright
		? result.links.playwrightReport
		: result.links.failureMessages

	const name = escapeSlackText(result.name)
	const title = link ? `<${link}|${name}>` : name

	return `• ${emoji} ${title}`
}

function escapeSlackText(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
}

function buildRoutineLink(routineId: Routine['id']) {
	return `https://testray.liferay.com/#/project/35392/routines/${routineId}`
}

function readLastReportedBuildId(): Build['id'] | null {
	try {
		const content = fs
			.readFileSync(LAST_REPORTED_BUILD_ID_FILE, 'utf-8')
			.trim()
		const id = Number(content)

		return Number.isFinite(id) ? id : null
	} catch {
		return null
	}
}

function writeLastReportedBuildId(id: Build['id']): void {
	fs.writeFileSync(LAST_REPORTED_BUILD_ID_FILE, String(id))
}

async function main() {
	const team = TEAMS['page-management']

	const [latestBuild] = await getRoutineBuilds({
		routineId: team.routineId,
		limit: 1,
	})

	if (!latestBuild) {
		return
	}

	if (readLastReportedBuildId() === latestBuild.id) {
		return
	}

	const { results } = await getRoutineResults(team.routineId)

	const failures = results.filter((result) => result.status === 'FAILED')
	const newFailures = failures.filter((result) => result.isNew)
	const existingFailuresCount = failures.length - newFailures.length

	const routineUrl = buildRoutineLink(team.routineId)

	const header = `<${routineUrl}|Routine result> · ${newFailures.length} new / ${failures.length} total failures`

	const lines: string[] = [header]

	if (newFailures.length > 0) {
		lines.push('')
		lines.push('*New failures:*')
		lines.push(...newFailures.map(formatResult))
	}

	if (existingFailuresCount > 0) {
		lines.push('')
		lines.push(
			`_${existingFailuresCount} existing failures — see <${routineUrl}|Testray> for the full list_`
		)
	}

	process.stdout.write(lines.join('\n'))

	writeLastReportedBuildId(latestBuild.id)
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
