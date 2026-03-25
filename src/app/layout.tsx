import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { AppSidebarHeader } from '@/components/sidebar/app-sidebar-header'

import '@/styles/globals.css'

const raleway = Raleway({
	weight: ['400', '500', '600'],
})

export const metadata: Metadata = {
	title: 'Testray Desk',
	description: 'Testray Desk',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" type="image/svg+xml" href="/logo.svg" />
			</head>

			<body className={`${raleway.className} antialiased`}>
				<SidebarProvider>
					<Toaster position="top-center" />

					<AppSidebar />

					<SidebarInset>
						<AppSidebarHeader />

						{children}
					</SidebarInset>
				</SidebarProvider>
			</body>
		</html>
	)
}
