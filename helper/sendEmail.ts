import nodemailer from 'nodemailer';
import SMTPConnection from 'nodemailer/lib/smtp-connection';


export const sendEmail = async (email: string, otp: number) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            // service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS  // Your email password or app-specific password
            }
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for Shreya Collection',
            text: `Your One-Time Password (OTP) is ${otp}. This OTP is valid for the next 10 minutes. Please use this code to complete your login process.`
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error to send OTP", error);
    }
};