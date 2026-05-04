function requireEnv(name: string): string {
  const value = process.env[name]

  if (!value || value.trim().length === 0) {
    throw new Error(`${name} is required.`)
  }

  return value
}

export function getDatabaseUrl(): string {
  return requireEnv("DATABASE_URL")
}

export function getResendApiKey(): string {
  return requireEnv("RESEND_API_KEY")
}

export function getResendFromEmail(): string {
  return requireEnv("RESEND_FROM_EMAIL")
}

export function getAppUrl(): string {
  return requireEnv("NEXT_PUBLIC_APP_URL").replace(/\/$/u, "")
}
