"use client"
import axios, { AxiosInstance } from "axios"
import { BASE_URL } from "./Constants";

export default class AuthAxios{
    private static instance: AxiosInstance |null = null;

    public static getAuthAxios() { 
        if(this.instance != null) return this.instance

        // const token = localStorage.getItem('accessToken');

        return axios.create({
            baseURL: BASE_URL,
            withCredentials: true,
            // headers: {
            //     Authorization: `Bearer ${token}`
            // }
        });
    }
}