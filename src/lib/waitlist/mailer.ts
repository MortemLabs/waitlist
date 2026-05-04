import { Resend } from "resend"
import { getAppUrl, getResendApiKey, getResendFromEmail } from "@/lib/env"

let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (resendClient !== null) {
    return resendClient
  }

  resendClient = new Resend(getResendApiKey())
  return resendClient
}

export async function sendVerificationEmail({
  email,
  verificationToken,
}: {
  email: string
  verificationToken: string
}) {
  const appUrl = getAppUrl()
  const verificationUrl = `${appUrl}/verify/${verificationToken}`

  await getResendClient().emails.send({
    from: getResendFromEmail(),
    html: `
      <div style="background:#0E0D0C;color:#EDEEE9;padding:32px;font-family:Inter Tight,Arial,sans-serif">
        <p style="font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#A39C95;margin:0 0 16px">Mortem · Early Access</p>
        <h1 style="font-family:Instrument Serif,Georgia,serif;font-size:36px;line-height:1.05;margin:0 0 16px">Verify the operator.</h1>
        <p style="font-size:16px;line-height:1.7;color:#C3BFB9;margin:0 0 24px">
          Your place in line is filed. Verify the email below so referral credit and queue position count.
        </p>
        <p style="margin:0 0 28px">
          <a href="${verificationUrl}" style="display:inline-block;background:#DC2626;color:#EDEEE9;padding:14px 20px;text-decoration:none;font-family:JetBrains Mono,monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase">
            Verify email
          </a>
        </p>
        <p style="font-size:14px;line-height:1.7;color:#A39C95;margin:0">
          If the button fails, file this link manually:
        </p>
        <p style="font-size:14px;line-height:1.7;color:#EDEEE9;word-break:break-all;margin:8px 0 0">
          ${verificationUrl}
        </p>
      </div>
    `,
    subject: "Mortem early access — verify your email",
    text: `Verify your Mortem early-access request: ${verificationUrl}`,
    to: email,
  })
}
