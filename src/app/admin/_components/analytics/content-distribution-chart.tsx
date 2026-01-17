"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ['#ff640a', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899'];

export function ContentDistributionChart({ data }: { data: { name: string; value: number }[] }) {
    return (
        <Card className="bg-[#141519] border-[#23252b]">
            <CardHeader>
                <CardTitle>Content Distribution</CardTitle>
                <CardDescription>Movies by Genre</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1f2128', borderColor: '#333' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
