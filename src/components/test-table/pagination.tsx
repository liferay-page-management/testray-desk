'use client'

import {
	IconChevronLeft,
	IconChevronRight,
	IconChevronsLeft,
	IconChevronsRight,
} from '@tabler/icons-react'
import type { PaginationState, Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

import { TestResult } from '@/types/test-result'

export function Pagination({
	table,
	pagination,
	setPagination,
	total,
}: {
	table: Table<TestResult>
	pagination: PaginationState
	setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
	total: number
}) {
	const rows = Math.min(
		pagination.pageSize,
		total - pagination.pageIndex * pagination.pageSize
	)

	return (
		<div className="flex items-center justify-between px-2">
			<div className="flex-1 text-sm text-muted-foreground">
				{rows} {rows === 1 ? 'row' : 'rows'}
			</div>

			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Rows per page</p>

					<Select
						value={`${pagination.pageSize}`}
						onValueChange={(value) => {
							setPagination((previous) => ({
								...previous,
								pageSize: Number(value),
								pageIndex: 0,
							}))
						}}
					>
						<SelectTrigger className="h-8 w-20">
							<SelectValue placeholder={pagination.pageSize} />
						</SelectTrigger>

						<SelectContent side="top">
							{[20, 50, 100, 200].map((pageSize) => (
								<SelectItem
									key={pageSize}
									value={`${pageSize}`}
								>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex min-w-[110px] items-center justify-center text-sm font-medium">
					Page {pagination.pageIndex + 1} of {table.getPageCount()}
				</div>

				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() =>
							setPagination((previous) => ({
								...previous,
								pageIndex: 0,
							}))
						}
						disabled={pagination.pageIndex === 0}
					>
						<span className="sr-only">Go to first page</span>
						<IconChevronsLeft className="size-4" />
					</Button>

					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() =>
							setPagination((previous) => ({
								...previous,
								pageIndex: Math.max(0, previous.pageIndex - 1),
							}))
						}
						disabled={pagination.pageIndex === 0}
					>
						<span className="sr-only">Go to previous page</span>
						<IconChevronLeft className="size-4" />
					</Button>

					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() =>
							setPagination((previous) => ({
								...previous,
								pageIndex: Math.min(
									table.getPageCount() - 1,
									previous.pageIndex + 1
								),
							}))
						}
						disabled={
							pagination.pageIndex >= table.getPageCount() - 1
						}
					>
						<span className="sr-only">Go to next page</span>
						<IconChevronRight className="size-4" />
					</Button>

					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() =>
							setPagination((previous) => ({
								...previous,
								pageIndex: Math.max(
									0,
									table.getPageCount() - 1
								),
							}))
						}
						disabled={
							pagination.pageIndex >= table.getPageCount() - 1
						}
					>
						<span className="sr-only">Go to last page</span>

						<IconChevronsRight className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	)
}
