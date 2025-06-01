import dbConnect from "@/lib/dbConnect";
import userModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/sendVerificationEmail";
import { z } from "zod";

// Input validation schema
const signUpSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  await dbConnect();

  try {
    const body = await request.json();
    const { username, email, password } = signUpSchema.parse(body); // ✅ Validate input

    const existingUserByUsername = await userModel.findOne({ username, isVerified: true });
    if (existingUserByUsername) {
      return Response.json({ success: false, message: "Username already taken" }, { status: 400 });
    }

    const existingUserByEmail = await userModel.findOne({ email });
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({ success: false, message: "Email already registered" }, { status: 400 });
      }

      // Update existing unverified user
      existingUserByEmail.username = username;
      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.verificationCode = verificationCode;
      existingUserByEmail.verificationCodeExpiry = expiryDate;
      await existingUserByEmail.save();
    } else {
      // Create new user
      const newUser = new userModel({
        username,
        email,
        password: hashedPassword,
        verificationCode,
        verificationCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }

    const emailResponse = await sendEmail(email, username, verificationCode);
    if (!emailResponse.success) {
      console.error("Email sending failed:", emailResponse.message); // 🐞 Add this
      return Response.json({ success: false, message: emailResponse.message }, { status: 400 });
    }

    return Response.json({ success: true, message: "User registered. Please verify your email." }, { status: 201 });

  } catch (error: any) {
    console.error("Registration error:", error);
    let message = "Couldn't register user";

    // Specific zod validation error message
    if (error?.issues) {
      message = error.issues[0].message;
    }

    return Response.json({ success: false, message }, { status: 500 });
  }
}
