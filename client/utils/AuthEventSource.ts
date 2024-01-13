import { BASE_URL } from "./Constants";

export default class AuthEventSource{
    private static instance: EventSource | null = null;

    public static getAuthEventSource = (id: string): EventSource => {
        if (!this.instance) {
            this.instance = new EventSource(`${BASE_URL}/fetchSSEData/sse/${id}`);
        }
        return this.instance;
    }
}