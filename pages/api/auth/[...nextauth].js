import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: "1079624130444-8nv33nrahk1ahem1grkcrqvi7iumm59a.apps.googleusercontent.com",
      clientSecret: "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",
    })
  ],
}) 