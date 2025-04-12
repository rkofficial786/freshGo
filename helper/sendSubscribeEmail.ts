import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Function to send a welcome email
export const sendSubscribeEmail = async (email: string) => {
    try {
        // Create a transporter
        let transporter = nodemailer.createTransport({
            host: "smtpout.secureserver.net",
            port: 465,
            // service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS  // Your email password or app-specific password
            }
        });

        // Read the email template
        const templatePath = path.join(process.cwd(), 'emailTemplate/subscribe-template.html');
        const template = fs.readFileSync(templatePath, 'utf-8');

        // Replace placeholders with actual subscriber details
        const emailContent = template
            .replaceAll('{{Your Company Name}}', 'Shreya Collection') // Replace with your company name
            .replace('[Your Website URL]', 'https://www.shreyacollection.in') // Replace with your website URL
            .replace('[Your Support Email]', 'info@shreyacollection.in') // Replace with your support email
            .replace('[Year]', new Date().getFullYear().toString())

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Shreya Collection!',
            html: emailContent,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email', error);
    }
};
