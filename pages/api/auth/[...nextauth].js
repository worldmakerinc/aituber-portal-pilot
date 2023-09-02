import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import LineProvider from 'next-auth/providers/line'

const authOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID ?? '',
      clientSecret: process.env.LINE_CLIENT_SECRET ?? '',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.YOUTUBE_API_V3_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('signIn user:', user)
      console.log('signIn account:', account)
      console.log('signIn profile:', profile)

      if (account.provider === 'google') {
        user.google = {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          accessToken: account.access_token,
        }
      } else if (account.provider === 'line') {
        user.line = {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
      return true
    },
    session: ({ session, token }) => {
      console.log('session: session', session)
      console.log('session: token', token)
      if (token.google) {
        session.google = token.google
      }
      if (token.line) {
        session.line = token.line
      }
      return session
    },
    jwt: async ({ token, user }) => {
      console.log('jwt: user', user)
      console.log('jwt: token', token)
      if (user?.google) {
        token.google = user.google
      }
      if (user?.line) {
        token.line = user.line
      }
      return token
    },
  },
}

export default NextAuth(authOptions)
