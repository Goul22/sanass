import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Employee } from '../../stores/employeeStore';

interface EmployeeAnalyticsProps {
  employees: Employee[];
}

const COLORS = {
  primary: '#e11d48',
  secondary: '#0284c7',
  accent: '#16a34a',
  yellow: '#ca8a04',
  purple: '#9333ea',
  orange: '#ea580c',
};

const EmployeeAnalytics: React.FC<EmployeeAnalyticsProps> = ({ employees }) => {
  // Prepare data for coordination distribution
  const coordinationData = employees.reduce((acc: any[], employee) => {
    const coordName = employee.coordination === 'national' ? 'Coordination Nationale' : 'Coordination Provinciale';
    const existingCoord = acc.find(d => d.name === coordName);
    if (existingCoord) {
      existingCoord.value++;
    } else {
      acc.push({ name: coordName, value: 1 });
    }
    return acc;
  }, []);

  // Prepare data for province distribution
  const provinceData = employees.reduce((acc: any[], employee) => {
    const existingProvince = acc.find(p => p.province === employee.province);
    if (existingProvince) {
      existingProvince.count++;
    } else {
      acc.push({ province: employee.province, count: 1 });
    }
    return acc;
  }, []);

  // Prepare data for age distribution
  const ageData = employees.reduce((acc: any[], employee) => {
    const age = new Date().getFullYear() - new Date(employee.birthDate).getFullYear();
    const ageRange = Math.floor(age / 5) * 5;
    const existingRange = acc.find(a => a.range === `${ageRange}-${ageRange + 4}`);
    if (existingRange) {
      existingRange.count++;
    } else {
      acc.push({ range: `${ageRange}-${ageRange + 4}`, count: 1 });
    }
    return acc.sort((a, b) => parseInt(a.range) - parseInt(b.range));
  }, []);

  // Prepare data for years of service
  const serviceData = employees.reduce((acc: any[], employee) => {
    const years = new Date().getFullYear() - new Date(employee.hireDate).getFullYear();
    const existingYear = acc.find(y => y.years === years);
    if (existingYear) {
      existingYear.count++;
    } else {
      acc.push({ years, count: 1 });
    }
    return acc.sort((a, b) => a.years - b.years);
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coordination Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Distribution par Coordination</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={coordinationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {coordinationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index % Object.values(COLORS).length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Province Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Distribution par Province</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={provinceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="province" angle={-45} textAnchor="end" interval={0} height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS.primary} name="Agents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Distribution par Âge</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ageData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={COLORS.secondary} name="Agents" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Years of Service */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Années de Service</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={serviceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="years" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={COLORS.accent} name="Agents" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeAnalytics;