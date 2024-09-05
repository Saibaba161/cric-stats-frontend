'use client'

import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function CricketStatsComparison() {
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [format, setFormat] = useState('Test');
  const [metric, setMetric] = useState('runs');
  const [chartType, setChartType] = useState('bar');
  const [comparisonData, setComparisonData] = useState(null);

  const metrics = ['runs', 'average', 'strike_rate', 'hundreds', 'fifties', 'wickets', 'bowling_average', 'economy_rate'];
  const chartTypes = ['bar', 'line', 'pie', 'radar'];

  const fetchComparisonData = async () => {
    if (player1 && player2) {
      try {
        const response = await axios.get(`http://localhost:4000/api/players/compare`, {
          params: { player1, player2, format }
        });
        setComparisonData(response.data);
        console.log(response)
      } catch (error) {
        console.error('Error comparing players:', error);
      }
    }
  };

  const renderChart = () => {
    if (!comparisonData) return null;

    const data = comparisonData.map(player => ({
      name: player.name,
      [metric]: player[metric],
    }));

    switch(chartType) {
      case 'bar':
        return (
          <BarChart width={500} height={500} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey={metric} fill='#8884d8' />
          </BarChart>
        )
      case 'line':
        return (
          <LineChart width={500} height={500} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey={metric} stroke="#8884d8" />
          </LineChart>
        )
      case 'pie':
        return (
          <PieChart width={500} height={500}>
            <Pie data={data} dataKey={metric} />
            <Tooltip />
          </PieChart>
        )
      case 'radar':
        return (
          <RadarChart cx={300} cy={150} outerRadius={150} width={500} height={500} data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="name"/>
            <PolarRadiusAxis />
            <Radar name={metric} dataKey={metric} stroke='#8884d8' fill='#8884d8' fillOpacity={0.6} />
            <Legend />
          </RadarChart>
        )
      default:
        return null
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Player Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Player 1 Name"
            value={player1}
            onChange={(e) => setPlayer1(e.target.value)}
          />
          <Input
            placeholder="Player 2 Name"
            value={player2}
            onChange={(e) => setPlayer2(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Test">Test</SelectItem>
              <SelectItem value="ODI">ODI</SelectItem>
              <SelectItem value="T20I">T20I</SelectItem>
            </SelectContent>
          </Select>
          <Select value={metric} onValueChange={setMetric}>
            <SelectTrigger>
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metrics.map(m => (
                <SelectItem key={m} value={m}>{m.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger>
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              {chartTypes.map(c => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={fetchComparisonData} className="mb-4">Compare</Button>
        {renderChart()}
      </CardContent>
    </Card>
  );
}

export default CricketStatsComparison;