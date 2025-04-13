import nodemailer from "nodemailer";
import { orderShippedTemplate } from "../emailTemplate/order-shipped";

export interface OrderDetails {
  trackingId: string;
  deliveryPartner: string;
  userName: string;
  userEmail: string;
  companyName: string;
}
// Function to send an email
export const sendOrderShippedEmail = async (orderDetails: OrderDetails) => {
  console.log(orderDetails,"order details");
  
  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Gmail SMTP
      port: 465,
      secure: true,

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailContent = orderShippedTemplate(orderDetails);

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
