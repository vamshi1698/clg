/**
 * Email Notification Utility using Resend API
 */
export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const recipients = (Array.isArray(to) ? to : [to]).map((r) => r.trim()).filter(Boolean)
    if (recipients.length === 0) {
      return { success: false, error: 'No recipient email addresses provided' }
    }

    const apiKey = process.env.RESEND_API_KEY
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    if (!apiKey) {
      console.log('\n==================================================')
      console.log('            [OUTBOUND EMAIL (DEV MODE)]           ')
      console.log(`FROM:     ${fromAddress}`)
      console.log(`TO:       ${recipients.join(', ')}`)
      if (replyTo) console.log(`REPLY-TO: ${replyTo}`)
      console.log(`SUBJECT:  ${subject}`)
      console.log('--------------------------------------------------')
      console.log('HTML CONTENT:')
      console.log(html)
      console.log('==================================================\n')

      return { success: true, id: `mock-email-${Date.now()}` }
    }

    const payload: Record<string, any> = {
      from: fromAddress,
      to: recipients,
      subject,
      html,
    }

    if (replyTo) {
      payload.reply_to = replyTo
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    })

    const result = await response.json()
    if (!response.ok) {
      const errorMsg = result.message || `Resend API returned status ${response.status}`
      console.warn(`[Resend Error] ${errorMsg}`)
      return { success: false, error: errorMsg }
    }

    console.log(`[Email] Email sent successfully via Resend. ID: ${result.id} -> TO: ${recipients.join(', ')}`)
    return { success: true, id: result.id }
  } catch (err: any) {
    console.error('Failed to send email:', err)
    return { success: false, error: err.message || 'Unknown email error' }
  }
}
