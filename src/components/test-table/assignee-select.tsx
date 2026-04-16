'use client'

import { IconUserFilled } from '@tabler/icons-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'

import { NextClient } from '@/lib/next-client'

import { TestResult } from '@/types/test-result'
import { User } from '@/types/user'

export function AssigneeSelect({
	testResult,
	users,
}: {
	testResult: TestResult
	users: User[]
}) {
	const initialUserId = testResult.userId

	const [selected, setSelected] = useState<string | undefined>(
		initialUserId && initialUserId !== 0 ? String(initialUserId) : undefined
	)
	const [loading, setLoading] = useState(false)

	if (testResult.status === 'PASSED') {
		return null
	}

	const onValueChange = async (value: string) => {
		const previous = selected
		const nextUserId = Number(value)

		setSelected(nextUserId ? value : undefined)
		setLoading(true)

		const { error } = await NextClient.patch('/api/update-case-result', {
			id: testResult.caseResultId,
			userId: nextUserId,
		})

		if (error) {
			toast.error(String(error.status), {
				description: error.message,
			})

			setSelected(previous)
		}

		setLoading(false)
	}

	return (
		<Select key={selected} value={selected} onValueChange={onValueChange}>
			<SelectTrigger disabled={loading} className="h-8 w-full">
				<div className="flex items-center gap-2">
					{loading && <Spinner />}

					{selected ? (
						<IconUserFilled className="fill-cyan-600" />
					) : null}

					<SelectValue placeholder="Assign" />
				</div>
			</SelectTrigger>

			<SelectContent align="start">
				{selected ? (
					<SelectItem value="0" className="text-muted-foreground">
						Unassign
					</SelectItem>
				) : null}

				{users.map((user) => (
					<SelectItem
						key={`${user.id}-${user.name}`}
						value={String(user.id)}
					>
						{user.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
