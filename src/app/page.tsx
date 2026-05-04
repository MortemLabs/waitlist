import { Wordmark } from "@/components/mortem/mark"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="tape h-2 w-full" aria-hidden="true" />
      <div className="mx-auto flex min-h-[calc(100vh-0.5rem)] max-w-7xl items-center justify-center px-4 py-6 md:px-6 lg:px-8">
        <div className="border border-line bg-ink-2 p-8">
          <Wordmark />
          <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground">
            Early-access landing page scaffolded. The waitlist flow and full launch surface are
            being filed next.
          </p>
        </div>
      </div>
    </main>
  )
}
