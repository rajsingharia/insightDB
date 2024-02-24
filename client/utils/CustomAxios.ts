"use client"
import axios, { AxiosInstance } from "axios"
import  { FETCH_DATA_BASE_URL, ALERT_BASE_URL, ORG_BASE_URL } from "@/utils/Constants"

export default class CustomAxios{
    private static orgAxiosInstance: AxiosInstance | null = null;
    private static fetchDataAxiosInstance: AxiosInstance | null = null;
    private static alertAxiosInstance: AxiosInstance | null = null;

    public static getOrgAxios() { 
        if(this.orgAxiosInstance != null) return this.orgAxiosInstance
        this.orgAxiosInstance = axios.create({
            baseURL: ORG_BASE_URL,
            withCredentials: true,
        });
        return this.orgAxiosInstance
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