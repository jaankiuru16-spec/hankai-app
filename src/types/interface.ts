
export interface SongBook {
  id: string
  title: string
  artist: string
  created_at: string
  lyrics: Lyrics[] | []
}
export interface Lyrics{
    id: string
    songbook_id: string
    title: string
    content: string
    language: string
    created_at: string
}

export interface Events {
    id: string
    title: string
    description: string | null
    date: string
    time: string
    location: string
    organizer: string
    category: string
    created_at: string
}

export interface News {
    id: string
    title: string
    image: string
    category: string
}

export interface Menu {
    id: string
    name: string
    week_start: string
    menu_days: MenuDay[] | []
}

export interface MenuDay{
    id: string
    menu_id: string
    day_of_week: string
    menu_categories: MenuCategories[] | []
}

export interface MenuCategories{
    id: string
    day_id: string
    name: string
    menu_items: MenuItems[] | []
}

export interface MenuItems{
    id: string
    category_id: string
    name: string
}

export interface ApiResponse<T> {
  data: T | null
  error: Error | null
}