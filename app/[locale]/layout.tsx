import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"

import { ThemeProvider } from "@/components/theme-provider"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"
import "../globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://your-next-webapp.vercel.app"
  ),
  title: {
    template: "%s | your-next-webapp",
    default: "your-next-webapp - Modern Next.js Full-Stack Starter Template",
  },
  description:
    "A production-ready, full-stack Next.js web application template built with Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, next-intl, and Firebase Auth.",
  keywords: [
    "Next.js",
    "React 19",
    "Tailwind CSS v4",
    "Firebase Auth",
    "next-intl",
    "SaaS Boilerplate",
    "Starter Kit",
  ],
  authors: [{ name: "exxaio", url: "https://github.com/exxaio" }],
  creator: "exxaio",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-next-webapp.vercel.app",
    title: "your-next-webapp - Modern Next.js Full-Stack Starter Template",
    description:
      "A production-ready, full-stack Next.js web application template built with Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, next-intl, and Firebase Auth.",
    siteName: "your-next-webapp",
  },
  twitter: {
    card: "summary_large_image",
    title: "your-next-webapp - Modern Next.js Full-Stack Starter Template",
    description:
      "A production-ready, full-stack Next.js web application template built with Next.js 16, React 19, Tailwind CSS v4, shadcn/ui, next-intl, and Firebase Auth.",
  },
}

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "en" | "zh-CN")) {
    notFound()
  }

  setRequestLocale(locale)

  const messages = await getMessages()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
