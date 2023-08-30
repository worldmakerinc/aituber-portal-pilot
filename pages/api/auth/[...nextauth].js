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
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.YOUTUBE_API_V3_CLIENT_SECRET ?? '',
      authorizationUrl:
        'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
      scope: 'https://www.googleapis.com/auth/youtube.readonly',
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('signIn user:', user)
      console.log('signIn account:', account)
      console.log('signIn profile:', profile)

      if (account.provider === 'google') {
        user.accessToken = account.access_token
      }
      return true
    },
    session: ({ session, user, token }) => {
      const currentSessionUser = { ...session.user }
      console.log('session: session', session)
      console.log('session: user', user)
      console.log('session: token', token)
      if (session?.user) {
        session.user.id = token.uid
        // session.user.email = currentSessionUser.email
        // session.user.image = currentSessionUser.image
        // session.user.name = currentSessionUser.name
        session.user.accessToken = token.accessToken
      }
      return session
    },
    jwt: async ({ user, token }) => {
      console.log('jwt: user', user)
      console.log('jwt: token', token)
      if (user) {
        token.uid = user.id
        token.accessToken = user.accessToken
      }
      return token
    },
  },
}

export default NextAuth(authOptions)
