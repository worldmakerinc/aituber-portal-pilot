import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { LogoutButton } from '../components/LogoutButton'
import Link from 'next/link'

const Logout: NextPage = () => {
  const { data: session } = useSession()

  if (!session?.user) {
    return (
      <div>
        <p>ログインしていません。</p>
        <Link href="/login">ログインページへ</Link>
      </div>
    )
  }
  return (
    <div>
      <LogoutButton />
    </div>
  )
}

export default Logout
