'use client'

import { IconChevronDown } from '@tabler/icons-react'
import type { Table, VisibilityState } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { TestResult } from '@/types/test-result'

export function ColumnCustomizer({
	table,
	columnVisibility,
	setColumnVisibility,
}: {
	table: Table<TestResult>
	columnVisibility: VisibilityState
	setColumnVisibility: Dispatch<SetStateAction<VisibilityState>>
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm">
					<Settings2 className="size-4" />
					Customize Columns
					<IconChevronDown className="size-4" />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-56">
				{table
					.getAllColumns()
					.filter(
						(column) =>
							column.id !== 'new' &&
							column.id !== 'name' &&
							column.id !== 'actions'
					)
					.map((column) => (
						<DropdownMenuCheckboxItem
							key={column.id}
							className="capitalize"
							checked={columnVisibility[column.id] ?? true}
							onCheckedChange={(value) => {
								setColumnVisibility((previous) => ({
									...previous,
									[column.id]: !!value,
								}))
							}}
						>
							{typeof column.columnDef.header === 'string'
								? column.columnDef.header
								: column.id}
						</DropdownMenuCheckboxItem>
					))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
