"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function StorageUsageChart({ data }: { data: { name: string; size: number }[] }) { // size in GB
    return (
        <Card className="bg-[#141519] border-[#23252b]">
            <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
                <CardDescription>Approximate storage used by media (GB)</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="name"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value} GB`}
                        />
                        <Tooltip
                            cursor={{ fill: '#23252b' }}
                            contentStyle={{ backgroundColor: '#1f2128', borderColor: '#333' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Bar dataKey="size" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? "#ff640a" : "#333"} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
