import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.HOMEPAGE_URL ?? '',
  timeout: 1000,
})

export const http = {
  post: async <Request = any, Response = unknown>(
    url: string,
    data?: Request
  ) => {
    const res = await instance.post<Response>(url, { data })
    return res.data
  },
  get: async <Response = unknown>(url: string, params: unknown = {}) => {
    const res = await instance.get<Response>(url, { params })
    return res.data
  },
  put: async <Request = any, Response = unknown>(
    url: string,
    data?: Request
  ) => {
    const res = await instance.put<Response>(url, { data })
    return res.data
  },
  delete: async <Response = unknown>(url: string, params: unknown = {}) => {
    const res = await instance.get<Response>(url, { params })
    return res.data
  },
}
