import 'dotenv/config';
import { Resend } from 'resend';

const main = async () => {
  const userEmail = process.env.TEST_EMAIL_TO;
  if (!userEmail) {
    throw new Error('Please set TEST_EMAIL_TO in .env');
  }

  const from = process.env.FROM_EMAIL;
  const subject = 'XStore password reset email test';
  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; background:#f5f7fb; margin:0; padding:32px;">
        <table width="100%" style="max-width:620px; margin:0 auto; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 20px 50px rgba(0,0,0,0.08);" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#0f2d6e; padding:32px; text-align:center; color:#ffffff;">
              <h1 style="margin:0; font-size:26px;">XStore email delivery test</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px; color:#17233d; font-size:16px; line-height:1.6;">
              <p style="margin:0 0 16px;">This is a test email sent through Resend to verify your production email integration.</p>
              <p style="margin:0;">If you received this message, your Resend settings are working correctly.</p>
            </td>
          </tr>
          <tr>
            <td style="background:#f0f4ff; padding:24px; color:#556080; font-size:14px; text-align:center;">
              <p style="margin:0;">XStore • Secure password reset delivery</p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured in .env');
  }

  if (!from) {
    throw new Error('FROM_EMAIL is not configured in .env');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const response = await resend.emails.send({
    from,
    to: userEmail,
    subject,
    html,
  });

  console.log('Resend send response:', response);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});