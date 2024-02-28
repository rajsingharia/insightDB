import { FETCH_DATA_BASE_URL } from "@/utils/Constants"

export default class AuthEventSource{
    private static instance: EventSource | null = null;

    public static getAuthEventSource = (id: string): EventSource => {
        if (!this.instance) {
            this.instance = new EventSource(`${FETCH_DATA_BASE_URL}/fetchSSEData/sse/${id}`);
        }
        return this.instance;
    }
}