import NextAuth from 'next-auth'
import LineProvider from 'next-auth/providers/line'

const authOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID ?? '',
      clientSecret: process.env.LINE_CLIENT_SECRET ?? '',
      // profile(profile) {
      //   console.log('Fetched LINE profile:', profile)
      //   return {
      //     id: profile.sub,
      //     name: profile.name,
      //     email: null,
      //     image: profile.picture,
      //   }
      // },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid
      }
      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }
      return token
    },
  },
  session: {
    strategy: 'jwt',
  },
}

export default NextAuth(authOptions)
