import { NextResponse, type NextRequest } from 'next/server'
import { createEdgeRouter } from 'next-connect'
import { toString } from 'lodash-es'

const router = createEdgeRouter<NextRequest, unknown>()

router.use(async (_req, _event, next) => {
  try {
    return await next()
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Uncaught Server Error', error: toString(error) },
      { status: 500 }
    )
  }
})

export default router
