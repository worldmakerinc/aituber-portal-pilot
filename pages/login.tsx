import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { LoginButton } from '../components/LoginButton'

const Login: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (session?.user) {
    router.push('/dashboard')
  }
  return (
    <div>
      <LoginButton />
    </div>
  )
}

export default Login
