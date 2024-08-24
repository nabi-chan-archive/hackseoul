export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          crawl_at: string | null
          created_at: string
          id: string
          label: string | null
          query: string | null
        }
        Insert: {
          crawl_at?: string | null
          created_at?: string
          id: string
          label?: string | null
          query?: string | null
        }
        Update: {
          crawl_at?: string | null
          created_at?: string
          id?: string
          label?: string | null
          query?: string | null
        }
        Relationships: []
      }
      crawl_data: {
        Row: {
          created_at: string
          html: string | null
          id: number
          url: string | null
        }
        Insert: {
          created_at?: string
          html?: string | null
          id?: number
          url?: string | null
        }
        Update: {
          created_at?: string
          html?: string | null
          id?: number
          url?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          crawl_at: string
          created_at: string
          id: number
          images: string[] | null
          original_price: number | null
          price: number | null
          product_id: string | null
          query: string | null
          shipping_price: number | null
          title: string | null
        }
        Insert: {
          crawl_at?: string
          created_at?: string
          id?: number
          images?: string[] | null
          original_price?: number | null
          price?: number | null
          product_id?: string | null
          query?: string | null
          shipping_price?: number | null
          title?: string | null
        }
        Update: {
          crawl_at?: string
          created_at?: string
          id?: number
          images?: string[] | null
          original_price?: number | null
          price?: number | null
          product_id?: string | null
          query?: string | null
          shipping_price?: number | null
          title?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          crawl_at: string | null
          created_at: string
          external_data: Json | null
          id: number
          images: string[] | null
          product_id: number | null
          reviewed_at: string | null
          score: number | null
          title: string | null
        }
        Insert: {
          content?: string | null
          crawl_at?: string | null
          created_at?: string
          external_data?: Json | null
          id?: number
          images?: string[] | null
          product_id?: number | null
          reviewed_at?: string | null
          score?: number | null
          title?: string | null
        }
        Update: {
          content?: string | null
          crawl_at?: string | null
          created_at?: string
          external_data?: Json | null
          id?: number
          images?: string[] | null
          product_id?: number | null
          reviewed_at?: string | null
          score?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
