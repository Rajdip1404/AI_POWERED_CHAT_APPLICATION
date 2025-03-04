import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "../utils/emailTemplates.js";
import { sendEmail } from "../utils/email.config.js";
export const sendVerificationEmail = async (email, verificationCode) => {
  const recipient = [{ email }];
  const subject = "Verify Your Email";
  const html = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationCode
  );
  const category = "Email verification";

  try {
    await sendEmail(recipient[0].email, category, subject, html);
    
  } catch (error) {
    console.log("Error sending verification email:", error.message);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  const subject = `Welcome ${name} to the family!`;
  const html = `<h1>Welcome ${name} to the family! </h1>`;
  const category = "Welcome";

  try {
    await sendEmail(recipient[0].email, category, subject, html);
    
  } catch (error) {
    console.log("Error sending Welcome email:", error.message);
  }
};

export const sendResetPasswordEmail = async (email, resetLink) => {
  const recipient = [{ email }];
  const subject = "Reset Your Password";
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetLink);
  const category = "Password Reset";

  try {
    await sendEmail(recipient[0].email, category, subject, html);
    
  } catch (error) {
    console.log("Error sending reset password email:", error.message);
  }
}

export const sendSuccessResetPasswordEmail = async (email) => {
  const recipient = [{ email }];
  const subject = "Successfully Reset Password";
  const html = PASSWORD_RESET_SUCCESS_TEMPLATE;
  const category = "Password Reset Successful";

  try {
    await sendEmail(recipient[0].email, category, subject, html);
  } catch (error) {
    console.log("Error sending reset password email:", error.message);
  }
}
