import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { LogoutButton } from '../components/LogoutButton'
import Link from 'next/link'

const Logout: NextPage = () => {
  const { data: session } = useSession()
  const router = useRouter()

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
