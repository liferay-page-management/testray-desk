import type { ReactNode } from 'react'

import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty'

export function PageState({
	icon,
	title,
	text,
}: {
	icon: ReactNode
	title: string
	text: string
}) {
	return (
		<div className="flex min-h-[calc(100dvh-4rem)] items-center justify-center p-6">
			<Empty className="w-full max-w-xl gap-8">
				<EmptyHeader className="gap-4">
					<EmptyMedia variant="icon" className="size-12">
						{icon}
					</EmptyMedia>
					<EmptyTitle className="text-xl">{title}</EmptyTitle>
					<EmptyDescription className="max-w-md text-base">
						{text}
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	)
}
