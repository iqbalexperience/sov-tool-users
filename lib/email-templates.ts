import { saasMeta } from "./constants";

const baseLayout = ({ title, content, buttonText, buttonUrl, footer }: {
  title: string;
  content: string;
  buttonText: string;
  buttonUrl: string;
  footer: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    :root {
      --primary: #000000;
      --primary-foreground: #ffffff;
      --background: #fcfcfc;
      --card: #ffffff;
      --text: #1a1a1a;
      --text-muted: #666666;
      --border: #e2e2e2;
    }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6; 
      color: var(--text); 
      margin: 0; 
      padding: 0; 
      background-color: var(--background); 
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: var(--background);
      padding: 48px 0;
    }
    .container { 
      max-width: 560px; 
      margin: 0 auto; 
      padding: 40px; 
      background: var(--card); 
      border: 1px solid var(--border); 
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }
    .brand {
      font-size: 14px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--primary);
      margin-bottom: 32px;
      text-transform: uppercase;
    }
    .header { 
      font-size: 28px; 
      font-weight: 700; 
      letter-spacing: -0.03em;
      color: #000000; 
      margin-bottom: 16px; 
      line-height: 1.2;
    }
    .content { 
      font-size: 16px; 
      color: var(--text-muted); 
      margin-bottom: 32px; 
    }
    .button-container {
      margin-bottom: 32px;
    }
    .button { 
      display: inline-block; 
      padding: 14px 28px; 
      background-color: var(--primary); 
      color: var(--primary-foreground) !important; 
      text-decoration: none; 
      border-radius: 8px; 
      font-weight: 600; 
      font-size: 15px;
      text-align: center; 
      transition: opacity 0.2s ease;
    }
    .footer { 
      margin-top: 40px; 
      font-size: 13px; 
      color: #999999; 
      border-top: 1px solid var(--border); 
      padding-top: 24px; 
      text-align: left;
    }
    @media (max-width: 600px) {
      .container { padding: 24px; margin: 20px; }
      .header { font-size: 24px; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="brand">${saasMeta.name}</div>
      <div class="header">${title}</div>
      <div class="content">
        ${content}
      </div>
      <div class="button-container">
        <a href="${buttonUrl}" class="button">${buttonText}</a>
      </div>
      <div class="footer">
        ${footer}<br>
        &copy; ${new Date().getFullYear()} ${saasMeta.name}. ${saasMeta.description}
      </div>
    </div>
  </div>
</body>
</html>
`

export const emailVerificationTemplate = ({ verificationUrl }: { verificationUrl: string }) =>
  baseLayout({
    title: "Verify your email address",
    content: `Welcome to ${saasMeta.name}! We're excited to have you on board. To get started, please confirm your email address by clicking the button below.`,
    buttonText: "Verify Email",
    buttonUrl: verificationUrl,
    footer: "If you didn't create an account with us, you can safely ignore this email."
  })

export const resetPasswordTemplate = ({ resetUrl }: { resetUrl: string }) =>
  baseLayout({
    title: "Reset your password",
    content: `We received a request to reset the password for your ${saasMeta.name} account. No problem! Just click the link below to set a new one.`,
    buttonText: "Reset Password",
    buttonUrl: resetUrl,
    footer: "If you didn't request a password reset, you can safely ignore this email. This link will remain active for 1 hour."
  })

export const magicLinkTemplate = ({ loginUrl }: { loginUrl: string }) =>
  baseLayout({
    title: "Your magic link is here",
    content: `Use the secure link below to sign in to your ${saasMeta.name} account. This link will expire after one use.`,
    buttonText: "Sign In to Dashboard",
    buttonUrl: loginUrl,
    footer: "If you didn't request a magic link, you can safely ignore this email."
  })



export const orgInvitationTemplate = ({ invitedByUsername, invitedByEmail, teamName, inviteLink }: any) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>You're Invited to Join!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';">
    <center style="width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); overflow: hidden;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                <tr>
                    <td style="padding: 30px 0; text-align: center; background-color: #ffffff;">
                        <img src="${process.env.BETTER_AUTH_URL + "/logo.png"}" alt="${saasMeta.name}" style="height: 40px; width: 40px; display: inline-block; vertical-align: middle; margin-right: 10px;">
                        <span style="font-size: 24px; font-weight: 700; color: #333333; vertical-align: middle;">${saasMeta.name}</span>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 0 40px 40px 40px; text-align: center;">
                        <h1 style="font-size: 28px; color: #1a202c; margin-bottom: 20px; line-height: 1.3;">You're Invited to Join <strong style="color: #2563eb;">${teamName}</strong>!</h1>
                        <p style="font-size: 16px; color: #4a5568; line-height: 1.6; margin-bottom: 25px;">
                            Hello, you've been invited by <strong style="color: #333;">${invitedByUsername}</strong> (${invitedByEmail}) to join the <strong style="color: #333;">${teamName}</strong> organization on <strong style="color: #333;">${saasMeta.name}</strong>.
                            <br><br>
                            Click the button below to accept your invitation and get started on your journey with us.
                        </p>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" style="padding-bottom: 20px;">
                                    <a href="${inviteLink}" style="background-color: #2563eb; color: #ffffff; padding: 14px 28px; border-radius: 6px; font-size: 18px; text-decoration: none; display: inline-block; font-weight: 600;">
                                        Accept Invitation
                                    </a>
                                </td>
                            </tr>
                        </table>
                        <p style="font-size: 14px; color: #718096; margin-top: 30px; line-height: 1.5;">
                            If you have any questions, feel free to reply to this email or visit our help center.
                            <br>
                            Thanks,<br>
                            The ${saasMeta.name} Team
                        </p>
                    </td>
                </tr>
                <tr>
                    <td style="padding: 20px 40px; text-align: center; font-size: 12px; color: #a0aec0; background-color: #f7fafc; border-top: 1px solid #edf2f7;">
                        &copy; 2025 ${saasMeta.name}. All rights reserved.
                    </td>
                </tr>
            </table>
        </div>
    </center>
</body>
</html>`}