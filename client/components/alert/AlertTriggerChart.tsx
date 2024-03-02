import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

import React, { useEffect, useState } from 'react';
import { alertTriggered } from '@/app/(root)/alerts/page'
import moment from 'moment';


interface AlertTriggerChart {
    alertTriggers: alertTriggered[];
}


export const AlertTriggerChart: React.FC<AlertTriggerChart> = ({ alertTriggers }) => {

    const hourlyCountsSuccess = new Array(24).fill(0);
    const hourlyCountsFailure = new Array(24).fill(0);
    alertTriggers.forEach((alert) => {
        const hour = moment(alert.createdAt).hour();
        alert.isSuccessful ? hourlyCountsSuccess[hour]++ : hourlyCountsFailure[hour]++;
    });
    const hourLabels = Array.from({ length: 24 }, (_, i) => moment().startOf('day').hour(i).format('h A'));
    const chartData = {
        labels: hourLabels,
        datasets: [
            {
                label: 'Successful Alerts',
                data: hourlyCountsSuccess,
                fill: true,
                borderColor: 'green',
                backgroundColor: "#00FF0020",
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: 'Unsuccessful Alerts',
                data: hourlyCountsFailure,
                fill: true,
                borderColor: 'red',
                backgroundColor: "#FF000020",
                borderWidth: 2,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className='flex flex-col items-center h-full w-full'>
            <Line
                data={chartData}
                options={chartOptions} />
        </div>
    );
}

