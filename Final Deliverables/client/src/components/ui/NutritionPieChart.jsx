import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const NutritionPieChart = ({ data, title = "Macronutrient Breakdown" }) => {
  const COLORS = {
    protein: '#60B5FF',
    carbs: '#FF9149',
    fat: '#AFDDFF',
    fiber: '#FFECDB',
  };

  const chartData = [
    { name: 'Protein', value: data.protein, color: COLORS.protein },
    { name: 'Carbohydrates', value: data.carbs, color: COLORS.carbs },
    { name: 'Fat', value: data.fat, color: COLORS.fat },
    { name: 'Fiber', value: data.fiber, color: COLORS.fiber },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">{data.value}g</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80">
      <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionPieChart;