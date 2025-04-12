import nodemailer from "nodemailer";
import { orderShippedTemplate } from "../emailTemplate/order-shipped";

export interface OrderDetails {
    trackingId: string,
    deliveryPartner: string,
    userName: string,
    userEmail: string,
    companyName: string
}
// Function to send an email
export const sendOrderShippedEmail = async (orderDetails: OrderDetails) => {
  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: "smtpout.secureserver.net",
      port: 465,
      // service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app-specific password
      },
    });

    const emailContent = orderShippedTemplate(orderDetails)

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: orderDetails?.userEmail,
      subject: "Order Shipped",
      html: emailContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Order email sent successfully");
  } catch (error) {
    console.error("Error sending order email", error);
  }
};
