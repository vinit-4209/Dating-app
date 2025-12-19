import nodemailer from 'nodemailer';

export async function sendVerificationEmail({ to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL || 'LoveConnect <no-reply@loveconnect.com>',
    to,
    subject,
    html
  });
}
