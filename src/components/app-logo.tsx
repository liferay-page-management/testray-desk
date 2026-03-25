import { cn } from '@/lib/utils'

type Size = 'base' | 'lg' | '3xl'

const DIMENSIONS: Record<Size, number> = {
	'base': 15,
	'lg': 16,
	'3xl': 25,
}

export function AppLogo({
	align,
	className,
	showName = true,
	size = 'base',
}: {
	align?: 'center'
	className?: string
	showName?: boolean
	size?: Size
}) {
	const dimension = DIMENSIONS[size]

	return (
		<div
			className={cn(
				'flex',
				{
					'justify-center mr-4': align === 'center',
					'gap-2': size === 'base' || size === 'lg',
					'gap-3': size === '3xl',
				},
				className
			)}
		>
			<img
				className=":block"
				src="/logo.svg"
				alt="Testray Desk"
				width={dimension}
				height={dimension}
			/>

			{showName ? (
				<span
					className={cn('font-semibold', {
						'text-base': size === 'base',
						'text-lg': size === 'lg',
						'text-3xl': size === '3xl',
					})}
				>
					Testray Desk
				</span>
			) : null}
		</div>
	)
}
