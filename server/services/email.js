const APP_URL = process.env.APP_URL || 'http://localhost:5173';

let resend = null;
if (process.env.RESEND_API_KEY) {
  const { Resend } = require('resend');
  resend = new Resend(process.env.RESEND_API_KEY);
}

async function sendMagicLink(email, token) {
  const link = `${APP_URL}/auth/callback?token=${token}`;

  if (!resend) {
    console.log(`\n========== MAGIC LINK ==========`);
    console.log(`Email: ${email}`);
    console.log(`Link:  ${link}`);
    console.log(`================================\n`);
    return;
  }

  await resend.emails.send({
    from: 'ShiftBridge <onboarding@resend.dev>',
    to: email,
    subject: 'Your ShiftBridge Login Link',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0ea5e9;">ShiftBridge</h2>
        <p>Tap below to log in. This link expires in 15 minutes.</p>
        <a href="${link}" style="display: inline-block; background: #0ea5e9; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
          Log In to ShiftBridge
        </a>
        <p style="color: #94a3b8; font-size: 13px;">If you didn't request this, just ignore it.</p>
      </div>
    `,
  });
}

module.exports = { sendMagicLink };
