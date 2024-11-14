import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Reports = () => {
  const [infectedSurvivors, setInfectedSurvivors] = useState(null);  // Initialize with null
  const [nonInfectedSurvivors, setNonInfectedSurvivors] = useState(null); // Initialize with null
  const [averageResources, setAverageResources] = useState(null); // Initialize with null

  useEffect(() => {
    // Use axios to fetch data for infected survivors
    axios.get(`${process.env.REACT_APP_API_SERVER_URL}/reports/infected-survivors`)
      .then(response => setInfectedSurvivors(response.data.infectedSurvivors))
      .catch(error => console.error('Error fetching infected survivors:', error));

    // Fetch data for non-infected survivors
    axios.get(`${process.env.REACT_APP_API_SERVER_URL}/reports/non-infected-survivors`)
      .then(response => setNonInfectedSurvivors(response.data.nonInfectedSurvivors))
      .catch(error => console.error('Error fetching non-infected survivors:', error));

    // Fetch average resources
    axios.get(`${process.env.REACT_APP_API_SERVER_URL}/reports/average-resources`)
      .then(response => setAverageResources(response.data.averageResources))
      .catch(error => console.error('Error fetching average resources:', error));
  }, []);

  // Check if the data is available, if not show loading state
  if (infectedSurvivors === null || nonInfectedSurvivors === null || averageResources === null) {
    return <div>Loading...</div>;
  }

  // Prepare the data for PieChart
  const pieData = [
    { name: 'Infected Survivors', value: infectedSurvivors || 0 }, // Safe fallback to 0
    { name: 'Non-Infected Survivors', value: nonInfectedSurvivors || 0 } // Safe fallback to 0
  ];

  // Prepare the data for BarChart
  const barData = [
    { name: 'Average Resources per Survivor', Resources: averageResources || 0 } // Safe fallback to 0
  ];

  const COLORS = ['#FF6384', '#36A2EB'];

  return (
    <div className='container mt-5 justify-content-center'>
      <h1>Reports</h1>
      <div className='column'>
        <h2>Survivor Infection Status</h2>
        <div>
          <h5>Infected Survivors: {infectedSurvivors}%</h5>
          <h5>Non-Infected Survivors: {nonInfectedSurvivors}%</h5>
        </div>
      </div>

      <div className='column'>
        <PieChart width={300} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      <div className='column'>
        <h2>Average Resources per Survivor: {averageResources}</h2>
        <br />
        <BarChart width={400} height={300} data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Resources" fill="#4BC0C0" />
        </BarChart>
      </div>
    </div>
  );
};

export default Reports;
