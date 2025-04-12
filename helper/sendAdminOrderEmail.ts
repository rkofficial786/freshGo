import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export interface OrderDetails {
    orderId: string;
    customerName: string;
    totalAmount: string;
    orderDate: string;
    customerEmail: string;
}
// Function to send an email
export const sendAdminOrderEmail = async (orderDetails: OrderDetails) => {
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
        const templatePath = path.join(process.cwd(), 'emailTemplate/order-template.html');
        const template = fs.readFileSync(templatePath, 'utf-8');

        // Replace placeholders with actual order details
        const emailContent = template
            .replace('{{orderId}}', orderDetails.orderId)
            .replace('{{customerName}}', orderDetails.customerName)
            .replace('{{totalAmount}}', orderDetails.totalAmount)
            .replace('{{orderDate}}', orderDetails.orderDate);

        // Define email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.REC_EMAIL,
            subject: 'New Order Received',
            html: emailContent,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Order email sent successfully');
    } catch (error) {
        console.error('Error sending order email', error);
    }
};
