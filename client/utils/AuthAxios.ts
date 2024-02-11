"use client"
import axios, { AxiosInstance } from "axios"
import  { AUTH_BASE_URL, FETCH_DATA_BASE_URL, ALERT_BASE_URL } from "@/utils/Constants"

export default class AuthAxios{
    private static authAxiosInstance: AxiosInstance | null = null;
    private static fetchDataAxiosInstance: AxiosInstance | null = null;
    private static alertAxiosInstance: AxiosInstance | null = null;

    public static getAuthAxios() { 
        if(this.authAxiosInstance != null) return this.authAxiosInstance
        this.authAxiosInstance = axios.create({
            baseURL: AUTH_BASE_URL,
            withCredentials: true,
        });
        return this.authAxiosInstance
    }

    public static getFetchDataAxios() { 
        if(this.fetchDataAxiosInstance != null) return this.fetchDataAxiosInstance
        this.fetchDataAxiosInstance = axios.create({
            baseURL: FETCH_DATA_BASE_URL,
            withCredentials: true,
        });
        return this.fetchDataAxiosInstance
    }

    public static getAlertAxios() { 
        if(this.alertAxiosInstance != null) return this.alertAxiosInstance
        this.alertAxiosInstance = axios.create({
            baseURL: ALERT_BASE_URL,
            withCredentials: true,
        });
        return this.alertAxiosInstance
    }

}