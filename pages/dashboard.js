import {
  Avatar,
  Button,
  Divider,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import {
  FiBox,
  FiCalendar,
  FiChevronDown,
  FiChevronUp,
  FiDollarSign,
  FiHome,
  FiPieChart,
} from 'react-icons/fi'
import { LoginButton } from '../components/LoginButton'
import MyChart from '../components/MyChart'

export default function Dashboard() {
  const [display, changeDisplay] = useState('hide')
  const { data: session } = useSession()
  const [recentConversation, changeRecentConversation] = useState([''])
  const [loading, setLoading] = useState(false)
  const [userData, setUserData] = useState({
    linked: false,
    youtubeChannelId: '',
    lineUserId: session?.user?.id,
    userId: '',
  })

  const handleClickLink = async () => {
    if (!userData.linked) {
      try {
        setLoading(true)
        // 連携処理
        const apiUrl =
          'https://aituber-line-bot-backend.azurewebsites.net/api/link-youtube'
        const requestData = {
          line_user_id: userData.lineUserId,
          youtube_channel_id: userData.youtubeChannelId,
          display_name: session?.user?.name,
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
          youtube_channel_id: data.youtube_channel_id,
          user_id: data.user_id,
          name: data.name,
        }))
      } catch (error) {
        console.error('Error linking YouTube:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const fetchChannelId = async () => {
    const token = session.user.accessToken
    console.log('token:', token)
    if (!token) {
      console.error('No access token available')
      return
    }
    fetch(
      `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics&mine=true&key=${process.env.YOUTUBE_API_V3_API_KEY}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => {
        const data = response.json()
        console.log('data:', data)
        const channelId = data.items[0].id
        console.log('チャンネルID:', channelId)
      })
      .catch((error) => {
        console.error('Error fetching channel id:', error)
      })
  }

  useEffect(() => {
    const checkLinked = async () => {
      try {
        const requestBody = JSON.stringify({
          line_user_id: session?.user?.id,
        })

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
          youtubeChannelId: data.youtube_channel_id,
          userId: data.user_id,
        }))

        if (data.conversations) {
          changeRecentConversation(data.conversations)
        } else {
          console.error('Error:', data.error)
        }
      } catch (error) {
        console.error('API fetch error:', error)
      }
    }
    checkLinked()
  }, [session])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestBody = JSON.stringify({
          user_id: session?.user?.id,
          num_conversations: 3,
        })
        console.log('requestBody:', requestBody)

        setUserData((prevState) => ({
          ...prevState,
          lineUserId: session?.user?.id,
          youtubeChannelId: session?.channelId,
        }))

        console.log('session:', session)

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
        console.log('data:', data)

        if (data.conversations) {
          changeRecentConversation(data.conversations)
        } else {
          console.error('Error:', data.error)
        }
      } catch (error) {
        console.error('API fetch error:', error)
      }
    }
    fetchData()
  }, [session])

  if (!session?.user) {
    return (
      <div>
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
            <Avatar my={2} src={session?.user?.image || ''} />
            <Text textAlign="center">{session?.user?.name || ''}</Text>
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
            {session?.user?.name || ''}
          </Flex>
        </Heading>
        <Flex justifyContent="space-between" mb={8}>
          <Flex align="left" flexDir="column">
            <Heading as="h2" size="lg" letterSpacing="tight">
              Recent Conversations
            </Heading>
            {recentConversation.map((conversation, index) => (
              <Text>{conversation}</Text>
            ))}
          </Flex>
        </Flex>
        <Text color="gray" fontSize="sm">
          My Balance
        </Text>
        <Text fontWeight="bold" fontSize="2xl">
          $5,750.20
        </Text>
        <MyChart />
        <Flex justifyContent="space-between" mt={8}>
          <Flex align="flex-end">
            <Heading as="h2" size="lg" letterSpacing="tight">
              Transactions
            </Heading>
            <Text fontSize="small" color="gray" ml={4}>
              Apr 2021
            </Text>
          </Flex>
          <IconButton icon={<FiCalendar />} aria-label={''} />
        </Flex>
        <Flex flexDir="column">
          <Flex overflow="auto">
            <Table variant="unstyled" mt={4}>
              <Thead>
                <Tr color="gray">
                  <Th>Name of transaction</Th>
                  <Th>Category</Th>
                  <Th isNumeric>Cashback</Th>
                  <Th isNumeric>Amount</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" mr={2} src="amazon.jpeg" />
                      <Flex flexDir="column">
                        <Heading size="sm" letterSpacing="tight">
                          Amazon
                        </Heading>
                        <Text fontSize="sm" color="gray">
                          Apr 24, 2021 at 1:40pm
                        </Text>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td>Electronic Devices</Td>
                  <Td isNumeric>+$2</Td>
                  <Td isNumeric>
                    <Text fontWeight="bold" display="inline-table">
                      -$242
                    </Text>
                    .00
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" mr={2} src="starbucks.png" />
                      <Flex flexDir="column">
                        <Heading size="sm" letterSpacing="tight">
                          Starbucks
                        </Heading>
                        <Text fontSize="sm" color="gray">
                          Apr 22, 2021 at 2:43pm
                        </Text>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td>Cafe and restaurant</Td>
                  <Td isNumeric>+$23</Td>
                  <Td isNumeric>
                    <Text fontWeight="bold" display="inline-table">
                      -$32
                    </Text>
                    .00
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <Flex align="center">
                      <Avatar size="sm" mr={2} src="youtube.png" />
                      <Flex flexDir="column">
                        <Heading size="sm" letterSpacing="tight">
                          YouTube
                        </Heading>
                        <Text fontSize="sm" color="gray">
                          Apr 13, 2021 at 11:23am
                        </Text>
                      </Flex>
                    </Flex>
                  </Td>
                  <Td>Social Media</Td>
                  <Td isNumeric>+$4</Td>
                  <Td isNumeric>
                    <Text fontWeight="bold" display="inline-table">
                      -$112
                    </Text>
                    .00
                  </Td>
                </Tr>
                {display == 'show' && (
                  <>
                    <Tr>
                      <Td>
                        <Flex align="center">
                          <Avatar size="sm" mr={2} src="amazon.jpeg" />
                          <Flex flexDir="column">
                            <Heading size="sm" letterSpacing="tight">
                              Amazon
                            </Heading>
                            <Text fontSize="sm" color="gray">
                              Apr 12, 2021 at 9:40pm
                            </Text>
                          </Flex>
                        </Flex>
                      </Td>
                      <Td>Electronic Devices</Td>
                      <Td isNumeric>+$2</Td>
                      <Td isNumeric>
                        <Text fontWeight="bold" display="inline-table">
                          -$242
                        </Text>
                        .00
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex align="center">
                          <Avatar size="sm" mr={2} src="starbucks.png" />
                          <Flex flexDir="column">
                            <Heading size="sm" letterSpacing="tight">
                              Starbucks
                            </Heading>
                            <Text fontSize="sm" color="gray">
                              Apr 10, 2021 at 2:10pm
                            </Text>
                          </Flex>
                        </Flex>
                      </Td>
                      <Td>Cafe and restaurant</Td>
                      <Td isNumeric>+$23</Td>
                      <Td isNumeric>
                        <Text fontWeight="bold" display="inline-table">
                          -$32
                        </Text>
                        .00
                      </Td>
                    </Tr>
                    <Tr>
                      <Td>
                        <Flex align="center">
                          <Avatar size="sm" mr={2} src="youtube.png" />
                          <Flex flexDir="column">
                            <Heading size="sm" letterSpacing="tight">
                              YouTube
                            </Heading>
                            <Text fontSize="sm" color="gray">
                              Apr 7, 2021 at 9:03am
                            </Text>
                          </Flex>
                        </Flex>
                      </Td>
                      <Td>Social Media</Td>
                      <Td isNumeric>+$4</Td>
                      <Td isNumeric>
                        <Text fontWeight="bold" display="inline-table">
                          -$112
                        </Text>
                        .00
                      </Td>
                    </Tr>
                  </>
                )}
              </Tbody>
            </Table>
          </Flex>
          <Flex align="center">
            <Divider />
            <IconButton
              icon={display == 'show' ? <FiChevronUp /> : <FiChevronDown />}
              onClick={() => {
                if (display == 'show') {
                  changeDisplay('none')
                } else {
                  changeDisplay('show')
                }
              }}
              aria-label={''}
            />
            <Divider />
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
          isDisabled={!session.user.accessToken}
        >
          YouTubeチャンネルIDを取得
        </Button>
        <Button
          mt={4}
          bgColor="blackAlpha.900"
          color="#fff"
          p={7}
          borderRadius={15}
          onClick={() => handleClickLink}
          isLoading={loading}
          isDisabled={!userData.linked || !userData.youtubeChannelId}
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
          <p>連携状況: {userData.linked ? 'Yes' : 'No'}</p>
        </Text>
        <Text mt={4}>YouTubeチャンネルID: {userData.youtubeChannelId}</Text>
        <Text mt={4}>YouTubeアクセストークン: {session.user.accessToken}</Text>
        <Text mt={4}>LINEユーザーID: {userData.lineUserId}</Text>
        <Text mt={4}>システムユーザーID: {userData.userId}</Text>
      </Flex>
    </Flex>
  )
}
