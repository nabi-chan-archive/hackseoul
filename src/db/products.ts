import { http } from '@/utils/http'
import { supabase } from '@/utils/supabase/client'

export async function readProducts(query: string, brand: string) {
  let brands = await supabase
    .from('brands')
    .select('id, label')
    .eq('query', query)
    .throwOnError()
    .then((response) => response.data ?? [])

  let products = await supabase
    .from('products')
    .select('*')
    .eq('query', query)
    .eq('brand', brand ?? undefined)
    .throwOnError()
    .then((response) => response.data ?? [])

  if (products.length < 10) {
    await http.get('/api/crawl/products', {
      query,
      brand: brand ?? undefined,
      page: 1,
    })
    products = await supabase
      .from('products')
      .select('*')
      .eq('query', query)
      .eq('brand', brand ?? undefined)
      .throwOnError()
      .then((response) => response.data ?? [])

    brands = await supabase
      .from('brands')
      .select('id, label')
      .eq('query', query)
      .throwOnError()
      .then((response) => response.data ?? [])
  }

  return { brands, products }
}
