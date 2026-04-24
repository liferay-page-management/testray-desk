export type Status = 'PASSED' | 'FAILED' | 'BLOCKED' | 'UNTESTED'

export type Routine = {
	id: number
	name: string
}

export type Build = {
	dateCreated: string
	gitHash: string
	id: number
}

export type CaseResult = {
	id: number
	dueStatus: { key: Status }
	comment?: string
	errors?: string
	r_caseToCaseResult_c_caseId: number
	r_userToCaseResults_userId?: number
	attachments?: string
}

export type Case = {
	id: number
	description: string
	name: string
	r_caseTypeToCases_c_caseTypeId: number
}

export type CaseType = {
	id: number
	name:
		| 'Playwright Test'
		| 'Modules Integration Test'
		| 'Modules Unit Test'
		| 'Modules Semantic Versioning Test'
		| 'Automated Functional Test'
		| 'JS Unit Test'
		| 'Batch'
}

export type History = Array<{
	executionDate: string
	gitHash: string
	status: Status
	testrayRoutineId: Routine['id']
}>
