export const otpTemplate = (
  otp: string, 
  type: "VERIFY_EMAIL" | "RESET_PASSWORD" = "VERIFY_EMAIL",
  baseUrl: string
) => {
  const title = type === "RESET_PASSWORD" ? "Reset your password" : "Verify your email address";
  const message = type === "RESET_PASSWORD" 
    ? "We received a request to reset your Arinvoice password. Use the code below to proceed:" 
    : "Welcome to Arinvoice! Please use the following One-Time Password (OTP) to verify your account:";

  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f8fafc;">
      <div style="background-color: #ffffff; padding: 40px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); text-align: center;">
        
        <img src="${baseUrl}/logo_transparent.png" alt="Arinvoice Logo" style="height: 48px; margin-bottom: 24px; display: inline-block;" />
        
        <h2 style="color: #0f172a; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.5px;">
          ${title}
        </h2>
        
        <p style="color: #64748b; font-size: 16px; line-height: 1.5; margin-bottom: 32px;">
          ${message}
        </p>
        
        <div style="background-color: #fff7ed; border: 1px solid #fed7aa; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
          <h1 style="color: #ea580c; letter-spacing: 8px; margin: 0; font-size: 36px; font-weight: 900; font-family: monospace;">
            ${otp}
          </h1>
        </div>
        
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 8px;">
          This code will expire securely in <strong>10 minutes</strong>.
        </p>
        <p style="color: #94a3b8; font-size: 14px; margin-bottom: 0;">
          If you didn't request this, you can safely ignore this email.
        </p>
        
      </div>
      
      <div style="text-align: center; margin-top: 24px;">
        <p style="color: #cbd5e1; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
          By Arinova Studio
        </p>
      </div>
    </div>
  `;
};