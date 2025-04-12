import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, otp: number) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Gmail SMTP
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Excel Shopping" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP for Excel Shopping',
      html: `
        <div style="font-family: sans-serif;">
          <h2>Your OTP Code</h2>
          <p><strong>${otp}</strong></p>
          <p>This OTP is valid for the next <strong>10 minutes</strong>.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ OTP sent to:", email);
  } catch (error) {
    console.log("❌ Failed to send OTP:", error);
  }
};
