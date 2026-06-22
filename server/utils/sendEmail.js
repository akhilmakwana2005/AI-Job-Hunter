import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  // Create a transporter using ethereal for testing if no real SMTP is provided
  // In production, you would use SendGrid, Mailgun, AWS SES, etc.
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL || 'your-email@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'your-app-password',
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || 'AI Job Hunter'} <${process.env.FROM_EMAIL || 'noreply@aijobhunter.com'}>`,
    to: options.email,
    subject: options.subject,
    html: options.html || `<p>${options.message}</p>`,
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
