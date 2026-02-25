const APP_URL = process.env.APP_URL || 'http://localhost:5173';

let resend = null;
if (process.env.RESEND_API_KEY) {
  const { Resend } = require('resend');
  resend = new Resend(process.env.RESEND_API_KEY);
}

async function sendMagicLink(email, token, code) {
  const link = `${APP_URL}/auth/callback?token=${token}`;

  if (!resend) {
    console.log(`\n========== MAGIC LINK ==========`);
    console.log(`Email: ${email}`);
    console.log(`Code:  ${code}`);
    console.log(`Link:  ${link}`);
    console.log(`================================\n`);
    return;
  }

  const result = await resend.emails.send({
    from: 'ShiftBridge <onboarding@resend.dev>',
    to: email,
    subject: `${code} is your ShiftBridge login code`,
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0ea5e9;">ShiftBridge</h2>
        <p>Your login code is:</p>
        <div style="font-size: 36px; font-weight: 700; letter-spacing: 6px; text-align: center; padding: 16px; background: #f1f5f9; border-radius: 12px; margin: 16px 0; font-family: monospace;">
          ${code}
        </div>
        <p style="color: #64748b; font-size: 14px;">Enter this code in the app, or tap below to log in:</p>
        <a href="${link}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 8px 0;">
          Log In to ShiftBridge
        </a>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 16px;">Expires in 15 minutes. If you didn't request this, just ignore it.</p>
      </div>
    `,
  });
  console.log('Resend response:', JSON.stringify(result));
}

module.exports = { sendMagicLink };
