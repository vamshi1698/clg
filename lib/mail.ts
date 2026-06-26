/**
 * Email Notification Utility using Resend API
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[]
  subject: string
  html: string
}): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const recipients = Array.isArray(to) ? to : [to]
    const apiKey = process.env.RESEND_API_KEY
    const fromAddress = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

    if (!apiKey) {
      console.log('\n==================================================')
      console.log('                 [OUTBOUND EMAIL]                 ')
      console.log(`FROM:    ${fromAddress}`)
      console.log(`TO:      ${recipients.join(', ')}`)
      console.log(`SUBJECT: ${subject}`)
      console.log('--------------------------------------------------')
      console.log('HTML CONTENT:')
      console.log(html)
      console.log('==================================================\n')
      
      return { success: true, id: `mock-email-${Date.now()}` }
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipients,
        subject,
        html,
      }),
    })

    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message || `Resend API returned status ${response.status}`)
    }

    console.log(`[Email] Email sent successfully via Resend. ID: ${result.id}`)
    return { success: true, id: result.id }
  } catch (err: any) {
    console.error('Failed to send email:', err)
    return { success: false, error: err.message || 'Unknown email error' }
  }
}
