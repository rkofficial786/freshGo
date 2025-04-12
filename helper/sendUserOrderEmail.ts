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

    // // Read the email template

    // const templatePath = path.join(
    //   process.cwd(),
    //   "emailTemplate/order-template-user.html"
    // );
    // const template = fs.readFileSync(templatePath, "utf-8");

    // // Replace placeholders with actual order details
    // const emailContent = template
    //   .replace("{{orderId}}", orderDetails.orderId)
    //   .replace("{{customerName}}", orderDetails.customerName)
    //   .replace("{{totalAmount}}", orderDetails.totalAmount)
    //   .replace("{{orderDate}}", orderDetails.orderDate);

    const emailContent = orderUserTemplate(orderDetails)

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
