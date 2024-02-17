import { ICharts } from "@/interfaces/ICharts";

export enum LoginOrRegisterEnum {
    login,
    register
}

export const FETCH_DATA_BASE_URL = 'http://localhost:3001/api/v1';
export const ALERT_BASE_URL = 'http://localhost:3002/api/v1';
export const ALERT_TRIGGER_BASE_URL = 'http://localhost:3003/api/v1';
export const ORG_BASE_URL = 'http://localhost:3004/api/v1';

export const SupportedCharts: ICharts[] = [
    {
        id: 1,
        icon: 'https://cdn-icons-png.flaticon.com/512/404/404621.png',
        name: 'Bar Chart',
        value: 'bar'
    },
    {
        id: 2,
        icon: 'https://cdn-icons-png.flaticon.com/512/3815/3815321.png',
        name: 'Line Chart',
        value: 'line'
    },
    {
        id: 3,
        icon: 'https://cdn-icons-png.flaticon.com/512/3589/3589902.png',
        name: 'Pie Chart',
        value: 'pie'
    },
    {
        id: 4,
        icon: 'https://cdn-icons-png.flaticon.com/512/7665/7665284.png',
        name: 'Scatter Chart',
        value: 'scatter'
    },
    {
        id: 5,
        icon: 'https://cdn-icons-png.flaticon.com/512/3815/3815321.png',
        name: 'Multi Type Chart',
        value: 'multi'
    },
    {
        id: 6,
        icon: 'https://cdn-icons-png.flaticon.com/128/7358/7358747.png',
        name: 'Text Area',
        value: 'text'
    }
]