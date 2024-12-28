'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';

interface Timestamp {
    time: string;
    score: number;
}

interface Timestamps { 
    data: Timestamp[];
}

const CustomTooltip: React.FC<TooltipProps<number, string>> = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black text-white p-2 border border-gray-700">
                <p>{`Score: ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};

const TimeSeriesChart: React.FC<Timestamps> = ({ data }) => {
    const [zoomDomain, setZoomDomain] = useState({ start: 0, end: data.length - 1 });
    const [yDomain, setYDomain] = useState<[number, number]>([0, 100]);

    useEffect(() => {
        const zoomedData = data.slice(zoomDomain.start, zoomDomain.end + 1);
        const scores = zoomedData.map(d => d.score);
        const minScore = Math.min(...scores);
        const maxScore = Math.max(...scores);
        setYDomain([minScore, maxScore]);
    }, [zoomDomain, data]);

    const handleZoom = (start: number, end: number) => {
        setZoomDomain({ start, end });
    };

    const handlePredefinedZoom = (points: number) => {
        const end = data.length - 1;
        const start = Math.max(0, end - points + 1);
        setZoomDomain({ start, end });
    };

    const maxTicks = 10;
    const interval = Math.ceil((zoomDomain.end - zoomDomain.start + 1) / maxTicks);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-full h-64 sm:h-96 lg:w-[500px] lg:h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.slice(zoomDomain.start, zoomDomain.end + 1)}>
                        <XAxis dataKey="time" interval={interval - 1} tick={false} />
                        <YAxis domain={yDomain} tickCount={11} interval="preserveStartEnd" />
                        <Tooltip content={<CustomTooltip />} />
                        <Line dataKey="score" stroke="#ffffff" dot={true} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="zoom-controls flex justify-center space-x-2 mt-4">
                <button className='btn btn-neutral btn-sm' onClick={() => handlePredefinedZoom(5)}>Last 5</button>
                <button className='btn btn-neutral btn-sm' onClick={() => handlePredefinedZoom(10)}>Last 10</button>
                <button className='btn btn-neutral btn-sm' onClick={() => handlePredefinedZoom(20)}>Last 20</button>
                <button className='btn btn-neutral btn-sm' onClick={() => handleZoom(0, data.length - 1)}>Reset</button>
            </div>
        </div>
    );
};

export default TimeSeriesChart;
