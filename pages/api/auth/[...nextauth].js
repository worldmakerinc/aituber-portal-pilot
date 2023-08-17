import NextAuth from 'next-auth'
import LineProvider from 'next-auth/providers/line'

const authOptions = {
  providers: [
    LineProvider({
      clientId: process.env.LINE_CLIENT_ID ?? '',
      clientSecret: process.env.LINE_CLIENT_SECRET ?? '',
      // profile(profile) {
      //   return {
      //     id: profile.userId,
      //     name: profile.displayName,
      //     email: null,
      //     image: profile.pictureUrl,
      //   }
      // },
    }),
  ],
  // callbacks: {
  //   session: async ({ session, user, token }) => {
  //     return Promise.resolve({
  //       ...session,
  //       user: {
  //         ...session.user,
  //         id: user.id,
  //         name: user.name,
  //         email: user.email,
  //         image: user.image,
  //       },
  //     })
  //   },
  // },
}

export default NextAuth(authOptions)
