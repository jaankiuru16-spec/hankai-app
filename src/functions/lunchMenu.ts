import { supabase } from '@/connection/connection';
import { ApiResponse, Menu, MenuCategories, MenuDay, MenuItems } from '../types/interface';

export const lunchMenuAPI = {
    async getMenu(): Promise<ApiResponse<Menu[]>> {
        try {
            const { data, error} = await supabase
            .from('menu')
            .select(`*, menu_days(*, menu_categories(*, menu_items(*)))`)
            .eq('week_start', new Date().toISOString().split('T')[0]) // filter for current week

            if(error) console.error('Error fetching menu at function lunchMenuAPI.getMenu:', error);
            
            return { data: data, error: null }; // replace with actual menu
        } catch (error) {
            console.error('Error fetching menu at function lunchMenuAPI.getMenu:', error);
            return { data: null, error: error as Error }
        }
    }
}