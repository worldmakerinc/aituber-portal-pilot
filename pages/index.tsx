// /pages/index.tsx

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const HomePage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  if (!session?.user) {
    return (
      <div>
        <p>ログインしてください。</p>
        <Link href="/login">ログインページへ</Link>
      </div>
    )
  }

  router.push('/dashboard')
}

export default HomePage
