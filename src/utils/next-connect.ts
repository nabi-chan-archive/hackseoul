import { NextResponse, type NextRequest } from 'next/server'
import { createEdgeRouter } from 'next-connect'
import { isDynamicServerError } from 'next/dist/client/components/hooks-server-context'

const router = createEdgeRouter<NextRequest, unknown>()

router.use(async (_req, _event, next) => {
  try {
    return await next()
  } catch (error) {
    if (isDynamicServerError(error)) {
      throw error
    }

    return NextResponse.error()
  }
})

export default router
