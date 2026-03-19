import { supabase } from "@/connection/connection";
import { ApiResponse, Lyrics, SongBook } from "@/types/interface";

export const songBookAPI = {
    async getSongBooks(): Promise<ApiResponse<SongBook[]>> {
        try {
            const {data, error} = await supabase
            .from('songbook')
            .select(`*, lyrics(*)`);

            if(error) console.error('Error fetching songbooks at function songBookAPI.getSongBooks:', error);

            return { data: data , error: null }; // replace with actual songbooks
        } catch (error) {
            console.error('Error fetching songbooks at function songBookAPI.getSongBooks:', error);
            return { data: null, error: error as Error }
        }
    },
    async getLyrics(songId: number): Promise<ApiResponse<string>> {
        try {
            const { data, error } = await supabase
            .from('lyrics')
            .select('content')
            .eq('song_id', songId)
            .single();

            if(error) console.error('Error fetching lyrics at function songBookAPI.getLyrics:', error);

            return { data: data?.content || '', error: null }; // replace with actual lyrics
        } catch (error) {
            console.error('Error fetching lyrics at function songBookAPI.getLyrics:', error);
            return { data: null, error: error as Error }
        }
    },
    async getAllLyrics(from: number, to: number): Promise<ApiResponse<Lyrics[]>> {
        try {
            
            const { data, error } = await supabase
            .from('lyrics')
            .select('*', { count: 'exact' })
            .range(from, to); // limit to pageSize for performance, adjust as needed;

            if(error) console.error('Error fetching all lyrics at function songBookAPI.getAllLyrics:', error);

            return { data: data || [], error: null }; // replace with actual lyrics
        } catch (error) {
            console.error('Error fetching all lyrics at function songBookAPI.getAllLyrics:', error);
            return { data: null, error: error as Error }
        }
    }
}