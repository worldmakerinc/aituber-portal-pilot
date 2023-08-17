import { NextPage } from 'next'
import { LoginButton } from '../components/LoginButton'

interface Props {}

const Login: NextPage<Props> = ({}) => {
  return (
    <div>
      <LoginButton />
    </div>
  )
}

export default Login
