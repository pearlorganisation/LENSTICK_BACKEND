import transporter from "../../../config/nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"LENSTICK" <${process.env.NODEMAILER_EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("📧 Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error(error.message);
  }
};

export const sendOtpEmail = async (name, email, otp, type = "REGISTER") => {
  const typeMessages = {
    REGISTER: {
      subject: "Verify your email for registration",
      title: "registration",
    },
    LOGIN: {
      subject: "Login verification code",
      title: "login",
    },
    RESET_PASSWORD: {
      subject: "Password reset verification code",
      title: "password reset",
    },
  };

  const current = typeMessages[type] || typeMessages.REGISTER;

  const html = `
      <div style="font-family:Arial;padding:20px;">
        <h2>Hi ${name},</h2>
        <p>Your ${current.title} OTP is:</p>
        <h1 style="letter-spacing:5px;color:#4F46E5;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p style="font-size:12px;color:#666;">
          If you didn’t request this, please ignore this email.
        </p>
        <br/>
        <p>Best regards,<br/>Team Bonfire</p>
      </div>
    `;

  return sendEmail(email, current.subject, html);
};
