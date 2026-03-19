import { ApiResponse, News } from '../types/interface';
import { supabase } from '@/connection/connection';

export const homeScreenAPI = {
    async getNews(): Promise<ApiResponse<News[]>> {
        try {
            const { data, error } = await supabase
            .from('news')
            .select('*')
            .limit(4)
            .order('created_at', { ascending: false })

            if(error) console.error('Error fetching news at function homeScreenAPI.getNews:', error);

            return { data: data, error: null }; // replace with actual news item
        } catch (error) {
            console.error('Error fetching news at function homeScreenAPI.getNews:', error);
            return { data: null, error: error as Error }
        }
    },
    async anotherFunction(): Promise<ApiResponse<string>> {
        try {
            // do something else

            return { data: 'result', error: null }; // replace with actual result
        } catch (error) {
            console.error('Error in function homeScreenAPI.anotherFunction:', error);
            return { data: null, error: error as Error }
        }
    }
}