// /pages/index.tsx

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { LoginButton } from '../components/LoginButton'

const HomePage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session?.user) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <p>ログインしてください。</p>
        <LoginButton />
      </div>
    )
  }

  router.push('/dashboard')
}

export default HomePage
