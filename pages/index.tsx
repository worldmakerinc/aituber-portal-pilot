// /pages/index.tsx

import { useSession } from 'next-auth/react'
import Link from 'next/link'

const HomePage = () => {
  const { data: session } = useSession()

  if (!session?.user) {
    return (
      <div>
        <p>ログインしてください。</p>
        <Link href="/login">ログインページへ</Link>
      </div>
    )
  }

  return (
    <div>
      <p>ようこそ、{session.user.name}さん！</p>
      <img src={session.user.image} alt={session.user.name} />
    </div>
  )
}

export default HomePage
