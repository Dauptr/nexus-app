'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const features = [
  {
    title: 'Next.js 16',
    description: 'Latest React framework with App Router and Turbopack',
    badge: 'Framework'
  },
  {
    title: 'TypeScript',
    description: 'Type-safe development with strict mode enabled',
    badge: 'Language'
  },
  {
    title: 'Tailwind CSS 4',
    description: 'Utility-first CSS with modern design system',
    badge: 'Styling'
  },
  {
    title: 'shadcn/ui',
    description: '35+ accessible, customizable UI components',
    badge: 'UI Library'
  },
  {
    title: 'Prisma ORM',
    description: 'Type-safe database access with SQLite',
    badge: 'Database'
  },
  {
    title: 'Zustand + TanStack Query',
    description: 'Modern state management solutions',
    badge: 'State'
  }
]

const techStack = [
  { name: 'Next.js', version: '16.1.3' },
  { name: 'TypeScript', version: '5.x' },
  { name: 'Tailwind CSS', version: '4.x' },
  { name: 'shadcn/ui', version: 'Latest' },
  { name: 'Prisma', version: '6.11.1' },
  { name: 'Zustand', version: 'Latest' },
  { name: 'TanStack Query', version: 'Latest' },
  { name: 'Bun', version: 'Runtime' }
]

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-12 p-6 bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative w-24 h-24 animate-pulse">
          <img
            src="/logo.svg"
            alt="Z.ai Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Z.ai Code Scaffold
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            AI-Powered Development Platform
          </p>
        </div>
        <div className="flex gap-4">
          <Badge variant="secondary" className="text-sm px-4 py-1">
            v1.0.0
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-1">
            Production Ready
          </Badge>
        </div>
      </div>

      <Separator className="w-full max-w-4xl" />

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
        {features.map((feature) => (
          <Card key={feature.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <Badge variant="secondary">{feature.badge}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator className="w-full max-w-4xl" />

      {/* Tech Stack */}
      <div className="max-w-4xl w-full">
        <h2 className="text-2xl font-semibold text-center mb-6">Tech Stack</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <span className="font-medium">{tech.name}</span>
              <span className="text-sm text-muted-foreground">{tech.version}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          Built with{' '}
          <a
            href="https://z.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Z.ai
          </a>
        </p>
      </footer>
    </div>
  )
}
