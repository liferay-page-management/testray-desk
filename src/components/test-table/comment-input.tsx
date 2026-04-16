'use client'

import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Textarea } from '@/components/ui/textarea'

import { NextClient } from '@/lib/next-client'

import { TestResult } from '@/types/test-result'

import { Spinner } from '../ui/spinner'

export function CommentInput({ testResult }: { testResult: TestResult }) {
	const comment = testResult.comment ?? ''

	const [isEditing, setIsEditing] = useState(false)
	const [value, setValue] = useState(comment)
	const [loading, setLoading] = useState(false)

	const textareaRef = useRef<HTMLTextAreaElement>(null)

	if (testResult.status === 'PASSED') {
		return null
	}

	const onBlur = async () => {
		setLoading(true)

		const { error } = await NextClient.patch('/api/update-case-result', {
			id: testResult.caseResultId,
			comment: value,
		})

		if (error) {
			toast.error(String(error.status), {
				description: error.message,
			})

			setValue(comment)
		}

		setIsEditing(false)

		setLoading(false)
	}

	if (isEditing) {
		return (
			<div className="w-full flex items-center gap-2">
				{loading && <Spinner />}

				<Textarea
					autoFocus
					ref={textareaRef}
					disabled={loading}
					value={value}
					onChange={(event) => setValue(event.target.value)}
					onBlur={onBlur}
					rows={1}
					className="min-h-8 resize-none border-input bg-background px-2 py-1.5 text-sm shadow-none focus-visible:ring-1"
				/>
			</div>
		)
	}

	return (
		<div className="w-full flex items-center">
			<p
				className="w-full cursor-text whitespace-pre-wrap break-all rounded-md px-1 py-1.5 text-sm hover:bg-muted/60"
				onClick={() => setIsEditing(true)}
			>
				{value.trim() || ' '}
			</p>
		</div>
	)
}
