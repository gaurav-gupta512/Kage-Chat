# Kage-Chat
Full-Stack Anonymous Feedback Website using NextJS , Resend and MongoDB

**Kage Chat** is a modern web application inspired by platforms like NGL. It allows verified users to receive anonymous messages through a shared link, without requiring the sender to sign in.

## 🛠️ Tech Stack

- **Next.js** – Core React framework for building the web app
- **MongoDB** – For storing user data and messages
- **Resend** – Used for email functionality (e.g., verification)
- **shadcn/ui** – For building a clean and modern component-based UI
- **next-auth (Credentials Provider)** – For user authentication

## 🔐 User Experience

- **Anonymous Messaging**: Anyone with a user’s shareable link can send a message without creating an account.
- **Authentication**: Users sign in using the **Credentials Provider** from `next-auth`.
- **Dashboard**: Logged-in users access a private dashboard where they can:
  - View messages sent to them
  - Delete unwanted or inappropriate messages
- **Live Updates**: Messages are automatically fetched from the MongoDB database every 5 seconds to ensure users see new feedback in real-time.

## 🎯 Key Features

- Anonymous feedback system (like NGL)
- No sign-in required for message senders
- Secure, email-verified user access
- Real-time message updates
- Clean and minimal design using shadcn/ui

---

Built with ❤️ using Next.js, MongoDB, Resend, and shadcn/ui.
