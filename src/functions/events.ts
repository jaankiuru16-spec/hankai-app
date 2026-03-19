import { supabase } from "@/connection/connection";
import { ApiResponse, Events } from "@/types/interface";

export const eventsAPI = {
    async getEvents(): Promise<ApiResponse<Events[]>> {
        try {
            const { data, error } = await supabase
            .from('events')
            .select('*')
            .limit(4)
            .order('created_at', { ascending: false })

            if(error) console.error('Error fetching events at function eventsAPI.getEvents:', error);

            return {data: data, error: null};
        } catch (error) {
            console.error('Error fetching events at function eventsAPI.getEvents:', error);
            return {data: null, error: error as Error};
        }
    }
}