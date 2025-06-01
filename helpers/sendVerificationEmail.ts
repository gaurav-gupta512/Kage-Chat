import { resend } from "@/lib/resend";
import VerificationEmail from "@/email/VerificationEmail";
import { apiResponse } from "@/types/apiResponse";

export async function sendEmail(
  email: string,
  username: string,
  verificationCode: string
): Promise<apiResponse> {
  try {
    const fromAddress = 'Acme <onboarding@resend.dev>';

    const { error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Verify your account - NGL Clone',
      react: VerificationEmail({ username, otp: verificationCode }),
    });

    if (error) {
      console.error('Resend email error:', error);
      return {
        success: false,
        message: 'Failed to send email. Please try again later.',
      };
    }

    return {
      success: true,
      message: 'Verification email sent successfully!',
    };
  } catch (err: unknown) {
    console.error('Unexpected email error:', err);
    return {
      success: false,
      message: 'An unexpected error occurred while sending email.',
    };
  }
}
