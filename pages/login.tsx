import { NextPage } from 'next'
import { LoginButton } from '../components/LoginButton'
import { useSession } from 'next-auth/react'

const Login: NextPage = () => {
    const { data: session } = useSession()

    if (session?.user) {
      return (
        <div>
          <p>{session.user.name}さん、ログイン済みです！</p>
          <img src={session.user.image} alt={session.user.name} />
        </div>
      )
    }
  return (
    <div>
      <LoginButton />
    </div>
  )
}

export default Login
