import fs from 'node:fs/promises'
import path from 'node:path'

import { TestResult } from '@/types/test-result'
import { Build, Routine } from '@/types/testray'

export type CacheItem = {
	results: TestResult[]
	build: { id: Build['id']; date: string; gitHash: string }
}

const CACHE_DIR = path.join(process.cwd(), '.cache', 'routine-results')

function cacheFile(routineId: Routine['id'], buildId: Build['id']): string {
	return path.join(CACHE_DIR, `${routineId}-${buildId}.json`)
}

export async function readCache(
	routineId: Routine['id'],
	buildId: Build['id']
): Promise<CacheItem | null> {
	try {
		const content = await fs.readFile(
			cacheFile(routineId, buildId),
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
		await fs.writeFile(
			cacheFile(routineId, data.build.id),
			JSON.stringify(data)
		)

		await cleanup(routineId, data.build.id)
	} catch (e) {
		console.error(e)
	}
}

export async function invalidate(routineId: Routine['id']): Promise<void> {
	try {
		await cleanup(routineId)
	} catch (e) {
		console.error(e)
	}
}

async function cleanup(
	routineId: Routine['id'],
	keepBuildId?: Build['id']
): Promise<void> {
	const prefix = `${routineId}-`
	const keep =
		keepBuildId !== undefined ? `${routineId}-${keepBuildId}.json` : null

	const files = await fs.readdir(CACHE_DIR)

	await Promise.all(
		files
			.filter((file) => file.startsWith(prefix) && file !== keep)
			.map((file) => fs.rm(path.join(CACHE_DIR, file), { force: true }))
	)
}
