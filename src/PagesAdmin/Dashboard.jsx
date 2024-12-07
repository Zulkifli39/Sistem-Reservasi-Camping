"use client";
import {TrendingUp} from "lucide-react";
import {Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer} from "recharts";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

const chartData = [
  {month: "Senin", desktop: 186, mobile: 80},
  {month: "Selasa", desktop: 305, mobile: 200},
  {month: "Rabu", desktop: 237, mobile: 120},
  {month: "Kamis", desktop: 73, mobile: 190},
  {month: "Jumat", desktop: 209, mobile: 130},
  {month: "Sabtu", desktop: 214, mobile: 140},
  {month: "Minggu", desktop: 214, mobile: 140},
];

const Dashboard = () => {
  const calculateTotalVisitors = () => {
    return chartData.reduce((sum, data) => sum + data.desktop + data.mobile, 0);
  };

  const calculateGrowthRate = () => {
    const firstMonthTotal = chartData[0].desktop + chartData[0].mobile;
    const lastMonthTotal = chartData[chartData.length - 1].desktop + chartData[chartData.length - 1].mobile;
    return (((lastMonthTotal - firstMonthTotal) / firstMonthTotal) * 100).toFixed(1);
  };

  return (
    <div className="container relative flex flex-col justify-between h-full max-w-6xl px-10 mx-auto xl:px-0 mt-12">
      <h2 className="font-bold text-xl mb-6 text-center mt-8">SISTEM RESERVASI BELOPA OUTDOOR</h2>

      <div className="w-full mb-8">
        <div className="flex flex-col w-full sm:flex-row justify-center items-center space-x-72">
          <div className="text-sm bg-purple-700 rounded-xl text-white font-bold p-6">TOTAL PRODUCT</div>
          <div className="text-sm bg-green-800 rounded-xl text-white font-bold p-6">TOTAL USERS</div>
        </div>
        <h2 className="text-xl font-bold text-center mt-12">Chart Sistem Reservasi</h2>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>View Chart Sistem </CardTitle>
          <CardDescription>Desktop vs Mobile Visitors (Senin - Minggu 2024)</CardDescription>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tickFormatter={(value) => value.slice(0, 3)} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="mobile" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
              <Area type="monotone" dataKey="desktop" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>

        <CardFooter>
          <div className="flex justify-between w-full items-center gap-4 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 font-medium leading-none">
                Growth Rate: {calculateGrowthRate()}% <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-2 text-gray-500">Comprehensive Traffic Analysis</div>
            </div>
            <div className="text-sm text-gray-500">Total Visitors: {calculateTotalVisitors()}</div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
