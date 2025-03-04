import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: process.env.GOOGLE_APP_USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

export const sendEmail = async (to, category, subject, htmlContent) => {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.GOOGLE_APP_USER}>`,
      to,
      subject: `${category} : ${subject}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return info;

  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Email sending failed");
  }
};
