import { Case, CaseResult, CaseType, Status } from './testray'
import { User } from './user'

export type TestResult = {
	userId?: User['id']
	comment?: string
	caseResultId: number
	caseId: Case['id']
	name: string
	history: Array<{ date: string; status: Status }> | null
	status: CaseResult['dueStatus']['key']
	type: CaseType['name'] | 'Java Log Assertor'
	isNew: boolean
	links: {
		failureMessages?: string
		playwrightReport?: string
		jenkinsConsole?: string
	}
}
