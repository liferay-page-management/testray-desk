import { getRoutineResults } from '@/lib/get-routine-results'
import { TEAMS } from '@/lib/teams'

import { TestResult } from '@/types/test-result'
import { Routine } from '@/types/testray'

const EMOJI_PLAYWRIGHT = ':playwright:'
const EMOJI_JAVA = ':java:'

function formatResult(result: TestResult): string {
	const isPlaywright = result.type === 'Playwright Test'
	const emoji = isPlaywright ? EMOJI_PLAYWRIGHT : EMOJI_JAVA
	const link = isPlaywright
		? result.links.playwrightReport
		: result.links.failureMessages

	const title = link ? `<${link}|${result.name}>` : result.name

	return `• ${emoji} ${title}`
}

function buildRoutineLink(routineId: Routine['id']) {
	return `https://testray.liferay.com/#/project/35392/routines/${routineId}`
}

async function main() {
	const team = TEAMS['page-management']

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
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
