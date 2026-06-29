import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error("EMAIL_USER and EMAIL_PASS environment variables are required to send email");
    return { success: false, error: "Missing email credentials" };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"LinkRent" <${emailUser}>`,
      to,
      subject,
      html,
    });

    console.log(`📧 EMAIL SENT TO: ${to} SUBJECT: ${subject}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const verifyUrl = `${baseUrl}/verify?token=${token}`;

  const html = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #f1f5f9;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">LinkRent.</h1>
        </div>
        <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 16px; text-align: center;">Welcome to LinkRent!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
          Thank you for signing up. Please click the button below to verify your email address and activate your account.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
            Verify Email Address
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 40px; text-align: center;">
          If you did not create this account, you can safely ignore this email.
        </p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #cbd5e1; font-size: 13px; margin: 0;">
            &copy; ${new Date().getFullYear()} LinkRent. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify your LinkRent Account',
    html,
  });
}

export async function sendAccountStatusUpdateEmail(to: string, name: string, status: string) {
  let subject = "";
  let message = "";

  if (status === "RENTED") {
    subject = "Great news! Your LinkedIn account has been rented 🎉";
    message = `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #2563eb; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">LinkRent.</h1>
          </div>
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">🎉</span>
          </div>
          <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 24px; text-align: center;">Account Rented!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Hi ${name},</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Great news! Your LinkedIn account has passed our review process and is now actively being rented by our team.</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px; padding: 16px; background-color: #f0fdf4; border-radius: 8px; border-left: 4px solid #22c55e;">
            Your monthly payouts will begin shortly. Please ensure your payout details are up to date in your Settings page.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 8px;">Thanks,</p>
          <p style="color: #0f172a; font-size: 16px; font-weight: 600; margin: 0;">The LinkRent Team</p>
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #cbd5e1; font-size: 13px; margin: 0;">&copy; ${new Date().getFullYear()} LinkRent. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  } else if (status === "REJECTED") {
    subject = "Update regarding your LinkedIn account submission";
    message = `
      <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #2563eb; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">LinkRent.</h1>
          </div>
          <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 24px;">Account Status Update</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Hi ${name},</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Thank you for submitting your LinkedIn account. Unfortunately, after a review by our team, we are unable to rent your account at this time.</p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px; padding: 16px; background-color: #f8fafc; border-radius: 8px;">
            This could be due to your connection count, account age, or other security factors.
          </p>
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 8px;">Thanks,</p>
          <p style="color: #0f172a; font-size: 16px; font-weight: 600; margin: 0;">The LinkRent Team</p>
          <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
            <p style="color: #cbd5e1; font-size: 13px; margin: 0;">&copy; ${new Date().getFullYear()} LinkRent. All rights reserved.</p>
          </div>
        </div>
      </div>
    `;
  } else {
    // We don't send emails for "AVAILABLE" 
    return;
  }

  await sendEmail({
    to,
    subject,
    html: message,
  });
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendAdminNewListingEmail(listingDetails: { name: string, email: string, connections: number, linkedinUrl: string }) {
  const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const adminAlertEmail = process.env.ADMIN_ALERT_EMAIL || "beheraguruprasad466777@gmail.com";
  
  const safeName = escapeHtml(listingDetails.name);
  const safeEmail = escapeHtml(listingDetails.email);
  const safeUrl = escapeHtml(listingDetails.linkedinUrl);

  const html = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 40px;">🔔</span>
        </div>
        <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 24px; text-align: center;">New LinkedIn Account Listed</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center;">
          <strong>${safeName}</strong> (${safeEmail}) just listed a new LinkedIn account for rent.
        </p>
        
        <div style="background-color: #f8fafc; padding: 24px; border-radius: 12px; margin: 32px 0; border: 1px solid #e2e8f0;">
          <div style="margin-bottom: 12px; display: flex; justify-content: space-between;">
            <strong style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Connections</strong>
            <span style="color: #0f172a; font-weight: 600;">${listingDetails.connections}</span>
          </div>
          <div style="display: flex; flex-direction: column;">
            <strong style="color: #64748b; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">LinkedIn URL</strong>
            <a href="${safeUrl}" style="color: #2563eb; text-decoration: none; word-break: break-all;">${safeUrl}</a>
          </div>
        </div>

        <div style="text-align: center; margin: 40px 0 20px;">
          <a href="${baseUrl}/admin/accounts" style="background-color: #0f172a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; display: inline-block;">
            Review Account in Admin
          </a>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to: adminAlertEmail,
    subject: `New Account Listed: ${listingDetails.connections} Connections`,
    html,
  });
}

export async function sendPaymentRequestedEmail(to: string, name: string, amount: number) {
  const html = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">LinkRent.</h1>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="background-color: #eff6ff; width: 64px; height: 64px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 32px;">💸</span>
          </div>
        </div>
        <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 24px; text-align: center;">Payout Processing!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Hi ${escapeHtml(name)},</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
          Great news! A new payout of <strong>₹${amount.toFixed(2)}</strong> has been generated for your rented LinkedIn account. 
        </p>
        <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
          <p style="color: #b45309; font-size: 15px; margin: 0; font-weight: 500;">
            Status: Awaiting Verification
          </p>
        </div>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 32px;">
          We typically verify and process payments within a few business days. We will notify you again once the funds have been sent to your chosen payout method!
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 8px;">Thanks,</p>
        <p style="color: #0f172a; font-size: 16px; font-weight: 600; margin: 0;">The LinkRent Team</p>
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #cbd5e1; font-size: 13px; margin: 0;">&copy; ${new Date().getFullYear()} LinkRent. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to,
    subject: `Your ₹${amount.toFixed(2)} Payout is Processing!`,
    html,
  });
}

export async function sendPaymentCompletedEmail(to: string, name: string, amount: number) {
  const html = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">LinkRent.</h1>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <div style="background-color: #dcfce7; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="font-size: 40px;">💰</span>
          </div>
        </div>
        <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 24px; text-align: center;">You've Been Paid!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Hi ${escapeHtml(name)},</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">
          Cha-ching! We have successfully processed your payout of <strong>₹${amount.toFixed(2)}</strong>. 
          The funds have been sent to your registered payout method.
        </p>
        <p style="color: #64748b; font-size: 15px; line-height: 1.6; margin-bottom: 32px; font-style: italic;">
          * Depending on your bank or payment provider, it may take a little time for the funds to reflect in your account balance.
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 8px;">Thanks for being a great partner,</p>
        <p style="color: #0f172a; font-size: 16px; font-weight: 600; margin: 0;">The LinkRent Team</p>
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #cbd5e1; font-size: 13px; margin: 0;">&copy; ${new Date().getFullYear()} LinkRent. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  await sendEmail({
    to,
    subject: `Payment Sent: ₹${amount.toFixed(2)}`,
    html,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  const html = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">LinkRent.</h1>
        </div>
        <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 16px; text-align: center;">Reset your password</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
          We received a request to reset your password. Click the button below to choose a new password.
        </p>
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background-color: #0f172a; color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 40px; text-align: center; line-height: 1.5;">
          If you did not request this, please ignore this email.<br/>This link will expire in 1 hour.
        </p>
        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #cbd5e1; font-size: 13px; margin: 0;">&copy; ${new Date().getFullYear()} LinkRent. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset your LinkRent Password',
    html,
  });
}

export async function sendDripEmail(email: string, name: string) {
  const baseUrl = process.env.NEXTAUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const addAccountUrl = `${baseUrl}/list-account`;

  const html = `
    <div style="background-color: #f8fafc; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 20px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); border: 1px solid #f1f5f9;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="color: #2563eb; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: -1px;">LinkRent.</h1>
        </div>
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="font-size: 48px;">🚀</span>
        </div>
        <h2 style="color: #0f172a; font-size: 24px; margin-bottom: 24px; text-align: center;">You're missing out on ₹900/week!</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 16px;">Hi ${escapeHtml(name) || 'there'},</p>
        <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
          We noticed you created a LinkRent account, but you haven't listed your LinkedIn profile yet. 
          You are just <strong>one step away</strong> from earning guaranteed passive income!
        </p>
        
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
              <span style="color: #22c55e; margin-right: 12px; font-size: 18px;">✓</span>
              <span style="color: #334155; font-size: 15px; line-height: 1.5;">We don't need your password (we use secure session cookies).</span>
            </li>
            <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
              <span style="color: #22c55e; margin-right: 12px; font-size: 18px;">✓</span>
              <span style="color: #334155; font-size: 15px; line-height: 1.5;">We never spam. We strictly use your account for B2B networking.</span>
            </li>
            <li style="display: flex; align-items: flex-start;">
              <span style="color: #22c55e; margin-right: 12px; font-size: 18px;">✓</span>
              <span style="color: #334155; font-size: 15px; line-height: 1.5;">You can cancel and revoke access at any time.</span>
            </li>
          </ul>
        </div>

        <div style="text-align: center; margin: 40px 0;">
          <a href="${addAccountUrl}" style="background-color: #2563eb; color: white; padding: 16px 36px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
            List Your Account Now
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 15px; margin-top: 32px; text-align: center; font-style: italic;">
          Don't leave money on the table. Join hundreds of other professionals renting their accounts today!
        </p>
        
        <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center;">
          <p style="color: #cbd5e1; font-size: 13px; margin: 0;">&copy; ${new Date().getFullYear()} LinkRent. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Still waiting? Earn ₹900 this week. 🚀",
    html,
  });
}
