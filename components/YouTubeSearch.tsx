import axios, { AxiosRequestConfig } from 'axios'

export const YoutubeSearch: any = async () => {
  try {
    const keyword = 'しまぶーのIT大学'
    console.log('keyword:', keyword)

    const config: AxiosRequestConfig = {
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      params: {
        part: 'snippet',
        q: keyword,
        maxResults: 50,
        key: process.env.YOUTUBE_API_V3_API_KEY,
      },
    }
    const res = await axios(config)

    console.log('検索結果:', res.data.items)

    return res.data.items
  } catch (error) {
    throw error
  }
}
