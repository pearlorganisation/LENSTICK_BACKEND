import axios from "axios";

export const sendOtpSMS = async (phoneNumber, otp) => {
  try {
    const response = await axios.post(
      "https://control.msg91.com/api/v5/otp",
      {
        mobile: "91" + phoneNumber, 
        otp: otp,
        template_id: process.env.MSG91_TEMPLATE_ID 
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "MSG91 Error:",
      error.response?.data || error.message
    );
    throw new Error("Failed to send OTP");
  }
};