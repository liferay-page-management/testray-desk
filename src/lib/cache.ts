import fs from 'node:fs/promises'
import path from 'node:path'

import { TestResult } from '@/types/test-result'
import { Build, Routine } from '@/types/testray'

export type CacheItem = {
	results: TestResult[]
	build: { id: Build['id']; date: string; gitHash: string }
}

const CACHE_DIR = path.join(process.cwd(), '.cache', 'routine-results')

function today(): string {
	const now = new Date()
	const year = now.getFullYear()
	const month = String(now.getMonth() + 1).padStart(2, '0')
	const day = String(now.getDate()).padStart(2, '0')

	return `${year}-${month}-${day}`
}

function cacheFile(routineId: Routine['id'], date: string): string {
	return path.join(CACHE_DIR, `${routineId}-${date}.json`)
}

export async function readCache(
	routineId: Routine['id']
): Promise<CacheItem | null> {
	try {
		const content = await fs.readFile(
			cacheFile(routineId, today()),
			'utf-8'
		)

		return JSON.parse(content) as CacheItem
	} catch {
		return null
	}
}

export async function writeCache(
	routineId: Routine['id'],
	data: CacheItem
): Promise<void> {
	try {
		await fs.mkdir(CACHE_DIR, { recursive: true })
		await fs.writeFile(cacheFile(routineId, today()), JSON.stringify(data))

		await cleanup()
	} catch (e) {
		console.error(e)
	}
}

async function cleanup(): Promise<void> {
	const suffix = `-${today()}.json`

	const files = await fs.readdir(CACHE_DIR)

	await Promise.all(
		files
			.filter((file) => !file.endsWith(suffix))
			.map((file) => fs.rm(path.join(CACHE_DIR, file), { force: true }))
	)
}
