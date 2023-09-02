import {
  Avatar,
  Button,
  Flex,
  Heading,
  Icon,
  Link,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FiBox, FiDollarSign, FiHome, FiPieChart } from 'react-icons/fi'
import { LoginButton } from '../components/LoginButton'

export default function Dashboard() {
  const { data: session } = useSession()
  const [recentConversation, changeRecentConversation] = useState([''])
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    linked: false,
    userId: '',
    lineUserId: session?.line?.id,
    image: session?.line?.image,
    displayName: session?.line?.name || '',
    youtubeChannelId: '',
    youtubeAccessToken: '',
  })

  const handleClickLink = async () => {
    if (!userData.linked) {
      const lineUserId = localStorage.getItem('lineUserId')
      if (!lineUserId) {
        alert('LINEユーザーIDが存在しません。')
        return
      } else if (!userData.youtubeChannelId) {
        alert('YouTubeチャンネルIDが存在しません。')
        return
      } else if (!userData.displayName) {
        alert('の表示名が存在しません。')
        return
      }
      try {
        setLoading(true)
        // 連携処理
        const apiUrl =
          'https://aituber-line-bot-backend.azurewebsites.net/api/link-youtube'
        const requestData = {
          line_user_id: userData.lineUserId,
          youtube_channel_id: userData.youtubeChannelId,
          display_name: userData.displayName,
        }
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        })
        if (!response.ok) {
          throw new Error('Failed to link YouTube')
        }
        const data = await response.json()
        setUserData((prevState) => ({
          ...prevState,
          linked: data.linked,
          userId: data.user_id,
        }))
        alert('連携が完了しました。')
        console.log('data:', data)
      } catch (error) {
        console.error('Error linking YouTube:', error)
      } finally {
        setLoading(false)
      }
    } else {
      alert('すでに連携済みです。')
    }
  }

  const fetchChannelId = async () => {
    const token = userData.youtubeAccessToken
    if (!token) {
      console.error('No access token available')
      return
    }
    fetch('https://www.googleapis.com/youtube/v3/channels?part=id&mine=true', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('data:', data)
        const channelId = data.items[0].id
        console.log('チャンネルID:', channelId)
        setUserData((prevState) => ({
          ...prevState,
          youtubeChannelId: channelId,
        }))
      })
      .catch((error) => {
        console.error('Error fetching channel id:', error)
      })
  }

  useEffect(() => {
    const checkLinked = async () => {
      const lineUserId = localStorage.getItem('lineUserId')
      if (lineUserId) return
      try {
        const requestBody = JSON.stringify({
          line_user_id: lineUserId,
        })

        console.log('checkLinked requestBody:', requestBody)

        const response = await fetch(
          'https://aituber-line-bot-backend.azurewebsites.net/api/check-youtube-link',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          }
        )

        const data = await response.json()
        setUserData((prevState) => ({
          ...prevState,
          linked: data.linked,
          userId: data.user_id,
        }))

        if (data.linked) {
          setUserData((prevState) => ({
            ...prevState,
            youtubeChannelId: data.youtube_channel_id,
          }))
        }
      } catch (error) {
        console.error('API fetch error:', error)
      }
    }
    const fetchRecentLineConversation = async () => {
      const lineUserId = localStorage.getItem('lineUserId')
      if (!lineUserId) {
        console.log('lineUserIdが存在しないため、最近の会話を取得できません。')
        return
      }
      try {
        const requestBody = JSON.stringify({
          user_id: lineUserId,
          num_conversations: 3,
        })
        console.log('fetchRecentConversation requestBody:', requestBody)

        const response = await fetch(
          'https://aituber-line-bot-backend.azurewebsites.net/api/line/recent-conversation',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: requestBody,
          }
        )

        const data = await response.json()

        if (data.conversations) {
          changeRecentConversation(data.conversations)
        } else {
          console.error('Error:', data.error)
        }
      } catch (error) {
        console.error('API fetch error:', error)
      }
    }

    console.log('session:', session)
    if (!session) return
    else if (session.line) {
      setUserData((prevState) => ({
        ...prevState,
        lineUserId: session.line.id,
        image: session.line.image,
        displayName: session.line.name,
      }))
      localStorage.setItem('lineUserId', session.line.id)
      localStorage.setItem('image', session.line.image)
      localStorage.setItem('displayName', session.line.name)
    } else if (session.google) {
      setUserData((prevState) => ({
        ...prevState,
        youtubeAccessToken: session.google.accessToken,
      }))
    }
    checkLinked()
    fetchRecentLineConversation()
  }, [session])

  useEffect(() => {
    const lineUserId = localStorage.getItem('lineUserId')
    const image = localStorage.getItem('image')
    const displayName = localStorage.getItem('displayName')
    setUserData((prevState) => ({
      ...prevState,
      lineUserId,
      image,
      displayName,
    }))
  })

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

  return (
    <Flex
      h={[null, null, '100vh']}
      maxW="2000px"
      flexDir={['column', 'column', 'row']}
      overflow="hidden"
    >
      {/* Column 1 */}
      <Flex
        w={['100%', '100%', '10%', '15%', '15%']}
        flexDir="column"
        alignItems="center"
        backgroundColor="#020202"
        color="#fff"
      >
        <Flex
          flexDir="column"
          h={[null, null, '100vh']}
          justifyContent="space-between"
        >
          <Flex flexDir="column" as="nav">
            <Heading
              mt={50}
              mb={[25, 50, 100]}
              fontSize={['4xl', '4xl', '2xl', '3xl', '4xl']}
              alignSelf="center"
              letterSpacing="tight"
            >
              Rise.
            </Heading>
            <Flex
              flexDir={['row', 'row', 'column', 'column', 'column']}
              align={['center', 'center', 'center', 'flex-start', 'flex-start']}
              wrap={['wrap', 'wrap', 'nowrap', 'nowrap', 'nowrap']}
              justifyContent="center"
            >
              <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                <Link display={['none', 'none', 'flex', 'flex', 'flex']}>
                  <Icon as={FiHome} fontSize="2xl" className="active-icon" />
                </Link>
                <Link
                  _hover={{ textDecor: 'none' }}
                  display={['flex', 'flex', 'none', 'flex', 'flex']}
                >
                  <Text className="active">Home</Text>
                </Link>
              </Flex>
              <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                <Link display={['none', 'none', 'flex', 'flex', 'flex']}>
                  <Icon as={FiPieChart} fontSize="2xl" />
                </Link>
                <Link
                  _hover={{ textDecor: 'none' }}
                  display={['flex', 'flex', 'none', 'flex', 'flex']}
                >
                  <Text>Credit</Text>
                </Link>
              </Flex>
              <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                <Link display={['none', 'none', 'flex', 'flex', 'flex']}>
                  <Icon as={FiDollarSign} fontSize="2xl" />
                </Link>
                <Link
                  _hover={{ textDecor: 'none' }}
                  display={['flex', 'flex', 'none', 'flex', 'flex']}
                >
                  <Text>Wallet</Text>
                </Link>
              </Flex>
              <Flex className="sidebar-items" mr={[2, 6, 0, 0, 0]}>
                <Link display={['none', 'none', 'flex', 'flex', 'flex']}>
                  <Icon as={FiBox} fontSize="2xl" />
                </Link>
                <Link
                  _hover={{ textDecor: 'none' }}
                  display={['flex', 'flex', 'none', 'flex', 'flex']}
                >
                  <Text>Services</Text>
                </Link>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDir="column" alignItems="center" mb={10} mt={5}>
            <Avatar my={2} src={userData.image || ''} />
            <Text textAlign="center">{userData.displayName || ''}</Text>
          </Flex>
        </Flex>
      </Flex>

      {/* Column 2 */}
      <Flex
        w={['100%', '100%', '60%', '60%', '55%']}
        p="3%"
        flexDir="column"
        overflow="auto"
        minH="100vh"
      >
        <Heading fontWeight="normal" mb={4} letterSpacing="tight">
          Welcome back,{' '}
          <Flex display="inline-flex" fontWeight="bold">
            {userData.displayName}
          </Flex>
        </Heading>
        <Flex justifyContent="space-between" mb={8}>
          <Flex align="left" flexDir="column">
            <Heading as="h2" size="lg" letterSpacing="tight" mb={4}>
              Recent Conversations
            </Heading>
            {recentConversation.map((conversation, index) => (
              <Text>{conversation}</Text>
            ))}
          </Flex>
        </Flex>
      </Flex>

      {/* Column 3 */}
      <Flex
        w={['100%', '100%', '30%']}
        bgColor="#F5F5F5"
        p="3%"
        flexDir="column"
        overflow="auto"
        minW={[null, null, '300px', '300px', '400px']}
      >
        <Heading letterSpacing="tight">Functions</Heading>
        <Button
          mt={4}
          bgColor="blackAlpha.900"
          color="#fff"
          p={7}
          borderRadius={15}
          onClick={() => signOut()}
        >
          サインアウト
        </Button>
        <Button
          mt={4}
          bgColor="blackAlpha.900"
          color="#fff"
          p={7}
          borderRadius={15}
          onClick={() => signIn('google')}
        >
          Googleログイン
        </Button>
        <Button
          mt={4}
          bgColor="blackAlpha.900"
          color="#fff"
          p={7}
          borderRadius={15}
          onClick={fetchChannelId}
          isDisabled={!session.google?.accessToken}
        >
          YouTubeチャンネルIDを取得
        </Button>
        <Button
          mt={4}
          bgColor="blackAlpha.900"
          color="#fff"
          p={7}
          borderRadius={15}
          onClick={() => {
            const channelId = userData.youtubeChannelId
            if (channelId) {
              const url = `https://www.youtube.com/channel/${channelId}`
              window.open(url, '_blank')
            } else {
              console.error(
                'YouTubeチャンネルIDが存在しないため、ページを開くことができません。'
              )
            }
          }}
          isDisabled={!userData.youtubeChannelId}
        >
          YouTubeチャンネルページを開く
        </Button>
        <Button
          mt={4}
          bgColor="blackAlpha.900"
          color="#fff"
          p={7}
          borderRadius={15}
          onClick={handleClickLink}
          isLoading={loading}
          isDisabled={userData.linked || !userData.youtubeChannelId}
          _loading={{
            bgColor: 'gray.500',
            _hover: { bgColor: 'gray.500' },
            _active: { bgColor: 'gray.500' },
          }}
        >
          {userData.linked ? 'YouTube連携済み' : 'YouTubeと連携する'}
          {loading && <Spinner />}
        </Button>
        <Heading letterSpacing="tight" mt={8}>
          Status
        </Heading>
        <Text mt={4}>
          <p>連携状況: {userData.linked ? '連携済み' : '未連携'}</p>
        </Text>
        <Text mt={4}>YouTubeチャンネルID: {userData.youtubeChannelId}</Text>
        <Text mt={4}>
          YouTubeアクセストークン: {userData.youtubeAccessToken}
        </Text>
        <Text mt={4}>LINEユーザーID: {userData.lineUserId}</Text>
        <Text mt={4}>システムユーザーID: {userData.userId}</Text>
      </Flex>
    </Flex>
  )
}
