import { TestrayClient } from '@/lib/testray-client'

import { Routine } from '@/types/testray'

export async function getRoutine(id: Routine['id']) {
	return await TestrayClient.get<Routine>({
		url: `https://testray.liferay.com/o/c/routines/${id}`,
	})
}
