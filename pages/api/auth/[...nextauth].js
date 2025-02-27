import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { createPool } from "mysql2/promise";
import bcrypt from "bcryptjs";

const pool = createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sjm_db",
});

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const [users] = await pool.query(
            "SELECT id, email, name, password, plan_type FROM users WHERE email = ?",
            [credentials.email]
          );

          if (users.length === 0) {
            throw new Error("No user found with this email");
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            users[0].password
          );

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: users[0].id,
            email: users[0].email,
            name: users[0].name,
            planType: users[0].plan_type,
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [user.email]
          );

          if (rows.length === 0) {
            await pool.query("INSERT INTO users (email, name) VALUES (?, ?)", [
              user.email,
              user.name,
            ]);
          }
          return true;
        } catch (error) {
          console.error("Error saving user:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      try {
        const [rows] = await pool.query(
          "SELECT id, plan_type FROM users WHERE email = ?",
          [session.user.email]
        );

        if (rows.length > 0) {
          session.user.id = rows[0].id;
          session.user.planType = rows[0].plan_type;
        }
        return session;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  events: {
    signIn: async (message) => {
      console.log("User signed in:", message);
    },
  },
  redirect: async (url, baseUrl) => {
    if (url.startsWith(baseUrl)) {
      return url;
    }
    // Allows relative callback URLs
    if (url.startsWith("/")) {
      return new URL(url, baseUrl).toString();
    }
    return "/dashboard";
  },
};

export default NextAuth(authOptions);
