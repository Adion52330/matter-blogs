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
  // solve the problem of the redirect to the login page
  secret: "my-super-secret-key",
  // Configure the session.
  session: {
    jwt: true,
    // The session cookie will have the same name as the provider
    fromExtension: true,
  },
});