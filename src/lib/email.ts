import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"LinkRent" <${process.env.EMAIL_USER}>`,
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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #0f172a;">Welcome to LinkRent!</h2>
      <p style="color: #334155; font-size: 16px;">
        Thank you for signing up. Please click the button below to verify your email address and activate your account.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
        If you did not create this account, you can safely ignore this email.
      </p>
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
      <p>Hi ${name},</p>
      <p>Great news! Your LinkedIn account has passed our review process and is now actively being rented by our team.</p>
      <p>Your monthly payouts will begin shortly. Please ensure your payout details are up to date in your Settings page.</p>
      <br/>
      <p>Thanks,</p>
      <p>The LinkRent Team</p>
    `;
  } else if (status === "REJECTED") {
    subject = "Update regarding your LinkedIn account submission";
    message = `
      <p>Hi ${name},</p>
      <p>Thank you for submitting your LinkedIn account. Unfortunately, after a review by our team, we are unable to rent your account at this time.</p>
      <p>This could be due to your connection count, account age, or other security factors.</p>
      <br/>
      <p>Thanks,</p>
      <p>The LinkRent Team</p>
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

export async function sendAdminNewListingEmail(listingDetails: { name: string, email: string, connections: number, linkedinUrl: string }) {
  const adminEmail = process.env.EMAIL_USER as string; // Send to ourselves
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
      <h2 style="color: #0f172a;">🔔 New LinkedIn Account Listed!</h2>
      <p style="color: #334155; font-size: 16px;">
        <strong>${listingDetails.name}</strong> (${listingDetails.email}) just listed a new LinkedIn account for rent.
      </p>
      
      <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Connections:</strong> ${listingDetails.connections}</p>
        <p style="margin: 5px 0;"><strong>LinkedIn URL:</strong> <a href="${listingDetails.linkedinUrl}">${listingDetails.linkedinUrl}</a></p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="https://link-iota-nine.vercel.app/admin/accounts" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
          Review Account in Admin Panel
        </a>
      </div>
    </div>
  `;

  await sendEmail({
    to: adminEmail,
    subject: `New Account Listed: ${listingDetails.connections} Connections`,
    html,
  });
}
