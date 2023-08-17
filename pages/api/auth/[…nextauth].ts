import NextAuth from 'next-auth'
import LineProvider from 'next-auth/providers/line'

export default NextAuth({
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID,
      clientSecret: process.env.LINE_CLIENT_SECRET,
      profileUrl: 'https://api.line.me/v2/profile',
      authorization:
        'https://access.line.me/oauth2/v2.1/authorize?response_type=code',
      token: 'https://api.line.me/oauth2/v2.1/token',
      profile(profile) {
        return {
          id: profile.userId,
          name: profile.displayName,
          email: null,
          image: profile.pictureUrl,
        }
      },
    }),
  ],
})
