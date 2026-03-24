import { useEffect, useMemo, useState } from 'react';
import { Download, BarChart3, TrendingUp, Users, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCompanyReport, getPlatformReport } from '../lib/api';
import { UserRole } from '../types';

export function Reports() {
  const { currentUser, token } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [platformReport, setPlatformReport] = useState<{
    totalUsers: number;
    totalEmployees: number;
    totalCourses: number;
    totalCompanies: number;
    companiesNearSeatLimit: Array<{
      companyId: string;
      companyName: string;
      seatLimit: number;
      seatsUsed: number;
      usagePercent: number;
    }>;
  } | null>(null);
  const [companyReport, setCompanyReport] = useState<{
    summary: {
      totalEmployees: number;
      completedEnrollments: number;
      averageProgress: number;
    };
    employeeProgress: Array<{
      employeeName: string;
      email: string;
      courseTitle: string;
      progressPercent: number;
      status: string;
    }>;
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!currentUser || !token) return;

      try {
        if (currentUser.role === UserRole.Superadmin) {
          const report = await getPlatformReport(token);
          setPlatformReport(report);
        } else if (currentUser.role === UserRole.Manager && currentUser.companyId) {
          const report = await getCompanyReport(currentUser.companyId, token);
          setCompanyReport(report);
        }
      } catch {
        setPlatformReport(null);
        setCompanyReport(null);
      }
    };

    load();
  }, [currentUser, token]);

  const totalEnrollments = useMemo(() => {
    if (currentUser?.role === UserRole.Superadmin) {
      return platformReport?.totalEmployees ?? 0;
    }
    return companyReport?.summary.totalEmployees ?? 0;
  }, [currentUser?.role, platformReport, companyReport]);

  const completedEnrollments = useMemo(() => {
    if (currentUser?.role === UserRole.Superadmin) {
      return platformReport?.totalCourses ?? 0;
    }
    return companyReport?.summary.completedEnrollments ?? 0;
  }, [currentUser?.role, platformReport, companyReport]);

  const avgProgress = useMemo(() => {
    if (currentUser?.role === UserRole.Superadmin) {
      return platformReport?.companiesNearSeatLimit.length
        ? Math.round(
            platformReport.companiesNearSeatLimit.reduce((sum, item) => sum + item.usagePercent, 0) /
              platformReport.companiesNearSeatLimit.length
          )
        : 0;
    }

    return Math.round(companyReport?.summary.averageProgress ?? 0);
  }, [currentUser?.role, companyReport, platformReport]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-2">
          {currentUser?.role === UserRole.Superadmin
            ? 'Platform-wide training metrics and insights'
            : "Track your team's training progress and performance"}
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedPeriod === 'week'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedPeriod === 'month'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setSelectedPeriod('year')}
            className={`px-4 py-2 rounded-lg font-medium ${
              selectedPeriod === 'year'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Year
          </button>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard icon={BarChart3} label="Total Enrollments" value={totalEnrollments} colorClass="bg-blue-100 text-blue-600" />
        <MetricCard icon={TrendingUp} label="Completed" value={completedEnrollments} colorClass="bg-green-100 text-green-600" />
        <MetricCard
          icon={Users}
          label={currentUser?.role === UserRole.Superadmin ? 'Total Users' : 'Employees'}
          value={currentUser?.role === UserRole.Superadmin ? platformReport?.totalUsers ?? 0 : companyReport?.summary.totalEmployees ?? 0}
          colorClass="bg-orange-100 text-orange-600"
        />
        <MetricCard icon={Award} label="Avg. Progress" value={`${avgProgress}%`} colorClass="bg-purple-100 text-purple-600" />
      </div>

      {currentUser?.role === UserRole.Superadmin ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-bold text-lg text-gray-900">Companies Near Seat Limit</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seat Limit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(platformReport?.companiesNearSeatLimit ?? []).map((row) => (
                  <tr key={row.companyId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{row.companyName}</td>
                    <td className="px-6 py-4 text-gray-900">{row.seatsUsed}</td>
                    <td className="px-6 py-4 text-gray-900">{row.seatLimit}</td>
                    <td className="px-6 py-4 text-gray-900">{Math.round(row.usagePercent)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="font-bold text-lg text-gray-900">Employee Progress</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(companyReport?.employeeProgress ?? []).map((row, idx) => (
                  <tr key={`${row.email}-${idx}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900">
                      <p className="font-medium">{row.employeeName}</p>
                      <p className="text-sm text-gray-500">{row.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{row.courseTitle}</td>
                    <td className="px-6 py-4 text-gray-900">{row.status}</td>
                    <td className="px-6 py-4 text-gray-900">{row.progressPercent}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  colorClass: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClass.split(' ')[0]}`}>
          <Icon className={`w-6 h-6 ${colorClass.split(' ')[1]}`} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{label}</p>
    </div>
  );
}
