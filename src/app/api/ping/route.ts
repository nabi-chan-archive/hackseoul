import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import router from '@/utils/next-connect'

router.get(async () => {
  return new NextResponse('pong')
})

export const GET = (request: NextRequest, context: unknown) => {
  return router.run(request, context) as Promise<NextResponse>
}
