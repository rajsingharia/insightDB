import { ICharts } from "@/interfaces/ICharts";

export enum LoginOrRegisterEnum {
    login,
    register
}

export const BASE_URL = 'http://localhost:3000/api/v1';

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
        name: 'Stacked Area Chart',
        value: 'stackedArea'
    },
    {
        id: 6,
        icon: 'https://cdn-icons-png.flaticon.com/512/3815/3815321.png',
        name: 'Stacked Bar Chart',
        value: 'stackedBar'
    },
    {
        id: 7,
        icon: 'https://cdn-icons-png.flaticon.com/128/7358/7358747.png',
        name: 'Text Area',
        value: 'textArea'
    }
]