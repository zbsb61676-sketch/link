/**
 * This is a simulated email service.
 * Once you have a provider (like Resend, SendGrid, or Nodemailer), 
 * you can replace the console.log with actual API calls.
 */

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("=========================================");
  console.log(`📧 SIMULATED EMAIL SENT`);
  console.log(`TO: ${to}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`BODY:`);
  console.log(html.replace(/<[^>]*>?/gm, '')); // Strip HTML for console readability
  console.log("=========================================");

  return { success: true };
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
