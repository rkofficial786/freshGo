import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { orderUserTemplate } from "../emailTemplate/order-template-user";

export interface OrderDetails {
  orderId: string;
  customerName: string;
  totalAmount: string;
  orderDate: string;
  customerEmail: string;
  user?: any;
}
// Function to send an email
export const sendUserOrderEmail = async (orderDetails: any) => {
  console.log(orderDetails,"orderdetauls ");
  
  try {
    // Create a transporter
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Gmail SMTP
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const emailContent = orderUserTemplate(orderDetails);

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: orderDetails?.user?.email,
      subject: "Order Confirmation",
      html: emailContent,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Order email sent successfully");
  } catch (error) {
    console.error("Error sending order email", error);
  }
};
