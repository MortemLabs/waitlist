export function buildVerificationEmailHtml({
  verificationUrl,
  unsubscribeUrl,
  preferencesUrl,
}: {
  verificationUrl: string
  unsubscribeUrl: string
  preferencesUrl: string
}): string {
  return `<!doctype html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark light">
  <title>Mortem</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap">
  <style>
    html,body{margin:0!important;padding:0!important;width:100%!important;background:#0E0D0C!important}
    table,td{border-collapse:collapse!important;mso-table-lspace:0;mso-table-rspace:0}
    img{border:0;outline:none;line-height:100%}
    a{text-decoration:none}
    body,table,td{font-family:'Inter Tight',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif}
    a.m-link:hover{color:#DC2626!important}
    a.m-muted{color:#898379}a.m-muted:hover{color:#EDEEE9!important}
    ::selection{background:#DC2626;color:#EDEEE9}
    @media only screen and (max-width:600px){
      .m-container{width:100%!important}
      .m-px{padding-left:20px!important;padding-right:20px!important}
      .m-stack{display:block!important;width:100%!important;text-align:left!important}
      .m-stack-r{text-align:left!important;padding-top:14px!important}
      .m-h1{font-size:38px!important;line-height:1.05!important}
    }
  </style>
</head>
<body style="margin:0;padding:0;width:100%;background-color:#0E0D0C;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#0E0D0C;opacity:0;">Forensic tooling for onchain trading agents. File the failure. Bury the bug.&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0E0D0C" style="background-color:#0E0D0C;">
    <tr><td align="center" style="padding:24px 12px;">
      <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
      <table role="presentation" class="m-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#0E0D0C;border:1px solid #3a3631;">

        <tr><td height="6" bgcolor="#DC2626" style="height:6px;line-height:6px;font-size:0;background-color:#DC2626;background-image:repeating-linear-gradient(-45deg,#DC2626 0,#DC2626 8px,#0E0D0C 8px,#0E0D0C 16px);">&nbsp;</td></tr>

        <tr><td class="m-px" style="padding:22px 28px;border-bottom:1px solid #3a3631;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td class="m-stack" align="left" valign="middle" width="50%" style="text-align:left;">
              <a href="https://mortemlabs.com" class="m-link" style="color:#EDEEE9;text-decoration:none;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;vertical-align:middle;"><tr>
                  <td width="38" height="38" align="center" valign="middle" bgcolor="#DC2626" style="width:38px;height:38px;background-color:#DC2626;border-bottom:3px solid #0E0D0C;"><span style="font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:700;line-height:38px;color:#EDEEE9;">M</span></td>
                  <td width="12" style="width:12px;font-size:0;">&nbsp;</td>
                  <td valign="middle" style="vertical-align:middle;"><span style="font-family:'Instrument Serif',Georgia,serif;font-size:30px;line-height:1;color:#EDEEE9;letter-spacing:-0.01em;">Mortem<span style="color:#DC2626;">.</span></span></td>
                </tr></table>
              </a>
            </td>
            <td class="m-stack m-stack-r" align="right" valign="middle" width="50%" style="text-align:right;">
              <span style="font-family:'JetBrains Mono',Courier,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#898379;">Forensic tooling for trading agents</span>
            </td>
          </tr></table>
        </td></tr>

        <!-- BODY START -->
        <tr><td class="m-px" style="padding:40px 28px 8px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border:2px solid #DC2626;padding:5px 9px;"><span style="font-family:'JetBrains Mono',Courier,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#DC2626;">Verify &middot; Account</span></td></tr></table>
          <h1 class="m-h1" style="margin:26px 0 0 0;font-family:'Instrument Serif',Georgia,serif;color:#EDEEE9;font-weight:400;font-size:44px;line-height:1.04;letter-spacing:-0.01em;">Confirm your email to file your request<span style="color:#DC2626;">.</span></h1>
          <p style="margin:22px 0 0 0;font-family:'Inter Tight',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.6;color:#898379;">One click verifies the address and moves your request into the queue. This link expires in 30 minutes and can only be used once.</p>
        </td></tr>
        <tr><td class="m-px" style="padding:30px 28px 4px 28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td bgcolor="#DC2626" style="background-color:#DC2626;"><a href="${verificationUrl}" target="_blank" style="display:inline-block;padding:14px 26px;font-family:'JetBrains Mono',Courier,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;font-weight:600;color:#EDEEE9;text-decoration:none;">Verify email &rarr;</a></td></tr></table>
        </td></tr>
        <tr><td class="m-px" style="padding:26px 28px 8px 28px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #3a3631;background-color:#191715;"><tr><td style="padding:14px;">
            <span style="font-family:'JetBrains Mono',Courier,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#898379;">If the button fails</span>
            <div style="margin-top:8px;font-family:'Inter Tight',Helvetica,Arial,sans-serif;font-size:13px;color:#898379;word-break:break-all;"><a href="${verificationUrl}" class="m-link" style="color:#EDEEE9;text-decoration:underline;text-underline-offset:3px;">${verificationUrl}</a></div>
          </td></tr></table>
          <p style="margin:18px 0 0 0;font-family:'Inter Tight',Helvetica,Arial,sans-serif;font-size:13px;line-height:1.6;color:#5b5752;">Didn&rsquo;t request this? No action is needed &mdash; the link expires on its own and nothing was filed.</p>
        </td></tr>        <!-- BODY END -->

        <tr><td class="m-px" style="padding:30px 28px 32px 28px;border-top:1px solid #3a3631;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="text-align:center;">
            <span style="font-family:'Instrument Serif',Georgia,serif;font-size:24px;line-height:1;color:#EDEEE9;letter-spacing:-0.01em;">Mortem<span style="color:#DC2626;">.</span></span>
          </td></tr></table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding-top:26px;text-align:center;">
            <a href="https://docs.mortemlabs.com" class="m-link" style="font-family:'JetBrains Mono',Courier,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#EDEEE9;text-decoration:none;">Docs</a>
            <!-- <span style="font-family:'JetBrains Mono',Courier,monospace;font-size:11px;color:#3a3631;padding:0 10px;">&middot;</span> -->
            <!-- <a href="https://mortem.sh/app" class="m-link" style="font-family:'JetBrains Mono',Courier,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#EDEEE9;text-decoration:none;">App</a> -->
            <!-- <span style="font-family:'JetBrains Mono',Courier,monospace;font-size:11px;color:#3a3631;padding:0 10px;">&middot;</span> -->
            <!-- <a href="https://mortem.sh/pricing" class="m-link" style="font-family:'JetBrains Mono',Courier,monospace;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#EDEEE9;text-decoration:none;">Pricing</a> -->
          </td></tr></table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding-top:22px;text-align:center;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="display:inline-block;"><tr>
              <td style="border:1px solid #3a3631;background-color:#191715;"><a href="https://x.com/mortemlabs" target="_blank" class="m-link" style="display:inline-block;padding:10px 14px;font-family:'JetBrains Mono',Courier,monospace;font-size:11px;letter-spacing:0.12em;color:#EDEEE9;text-decoration:none;">X &nbsp;@mortemlabs</a></td>
              <td width="10" style="width:10px;font-size:0;">&nbsp;</td>
              <td style="border:1px solid #3a3631;background-color:#191715;"><a href="https://github.com/Mortemlabs" target="_blank" class="m-link" style="display:inline-block;padding:10px 14px;font-family:'JetBrains Mono',Courier,monospace;font-size:11px;letter-spacing:0.12em;color:#EDEEE9;text-decoration:none;">GitHub &nbsp;/Mortemlabs</a></td>
            </tr></table>
          </td></tr></table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding-top:26px;text-align:center;">
            <a href="${unsubscribeUrl}" class="m-muted" style="font-family:'Inter Tight',Helvetica,Arial,sans-serif;font-size:12px;color:#898379;text-decoration:underline;text-underline-offset:3px;">Unsubscribe</a>
            <span style="font-size:12px;color:#3a3631;padding:0 8px;">&middot;</span>
            <a href="${preferencesUrl}" class="m-muted" style="font-family:'Inter Tight',Helvetica,Arial,sans-serif;font-size:12px;color:#898379;text-decoration:underline;text-underline-offset:3px;">Manage preferences</a>
          </td></tr></table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="padding-top:16px;text-align:center;">
            <p style="margin:0;font-family:'Inter Tight',Helvetica,Arial,sans-serif;font-size:11px;line-height:1.6;color:#5b5752;">You&rsquo;re receiving this as a member of the Mortem early-access queue.<br>Mortem Labs &middot; [mailing address] &middot; &copy; 2026</p>
          </td></tr></table>
        </td></tr>

      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body>
</html>`
}
