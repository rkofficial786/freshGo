"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FaChartLine, FaSpinner } from "react-icons/fa";

// Dummy data
const dummySalesData = [
  { productName: "Product A", totalCount: 50, totalSalesAmount: 1000 },
  { productName: "Product B", totalCount: 30, totalSalesAmount: 750 },
  { productName: "Product C", totalCount: 20, totalSalesAmount: 500 },
  { productName: "Product D", totalCount: 40, totalSalesAmount: 1200 },
  { productName: "Product E", totalCount: 10, totalSalesAmount: 300 },
];

const SalesDataTable = () => {
  const [salesData, setSalesData] = useState<any>([]);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [total, setTotal] = useState(0);

  const fetchSalesData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate data processing based on period
      const filteredData = dummySalesData.map(item => ({
        ...item,
        totalCount: Math.round(item.totalCount * (period / 30)),
        totalSalesAmount: item.totalSalesAmount * (period / 30)
      }));
      
      const totalAmount = filteredData.reduce((sum, item) => sum + item.totalSalesAmount, 0);
      
      setSalesData(filteredData);
      setTotal(totalAmount);
    } catch (err) {
      setError("Failed to fetch sales data. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  const handlePeriodChange = (value) => {
    setPeriod(Number(value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSalesData();
  };

  return (
    <Card className="container mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-3xl font-bold flex items-center">
          <FaChartLine className="mr-2" /> Sales Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div className="flex items-center space-x-4">
            <Select onValueChange={handlePeriodChange} value={period.toString()}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last 365 days</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="w-[100px]"
              min="1"
            />
            <Button  type="submit">Fetch Data</Button>
          </div>
        </form>

        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6" role="alert">
          <p className="font-bold">Total Sales</p>
          <p>Amount in {period} days = Rs {total.toFixed(2)}</p>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-32">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        )}

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesData.map((item:any, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell>{item.totalCount}</TableCell>
                  <TableCell>Rs {item.totalSalesAmount.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesDataTable;