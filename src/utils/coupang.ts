import axios from 'axios'
import { stringify } from 'qs'
import { supabase } from '@/utils/supabase/client'

export const coupang = async (url: string, params: unknown = {}) => {
  const fullUrl = `https://www.coupang.com${url}?${stringify(params)}`
  const cached = await supabase
    .from('crawl_data')
    .select('html, created_at')
    .eq('url', fullUrl)
    .order('created_at', { ascending: false })
    .single()
    .then((data) => data.data)

  let html = cached?.html ?? ''
  if (!cached) {
    const data = await axios
      .get<string>(url, {
        params,
        baseURL: 'https://www.coupang.com',
        headers: {
          authority: 'weblog.coupang.com',
          scheme: 'https',
          origin: 'https://www.coupang.com',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': 'macOS',
          'user-agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Whale/3.20.182.14 Safari/537.36',
          cookie:
            'PCID=31489593180081104183684; _fbp=fb.1.1644931520418.1544640325; gd1=Y; X-CP-PT-locale=ko_KR; MARKETID=31489593180081104183684; sid=03ae1c0ed61946c19e760cf1a3d9317d808aca8b; overrideAbTestGroup=%5B%5D; x-coupang-origin-region=KOREA; x-coupang-accept-language=ko_KR;',
          referer: fullUrl,
        },
      })
      .then((res) => res.data)

    html = data
  }

  await supabase
    .from('crawl_data')
    .insert({
      html,
      url: fullUrl,
    })
    .single()
    .throwOnError()

  return html
}
