import { CreditCard, Users, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { mockCompanies, mockUsers } from '../data/mockData';

export function Subscription() {
  const { currentUser } = useAuth();
  const company = mockCompanies.find((c) => c.id === currentUser?.companyId);
  const companyUsers = mockUsers.filter((u) => u.companyId === currentUser?.companyId);

  if (!company) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No subscription information available</p>
      </div>
    );
  }

  const seatUtilization = (companyUsers.length / company.seatLimit) * 100;
  const daysRemaining = Math.ceil(
    (new Date(company.activeUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const planFeatures = {
    Starter: [
      'Up to 10 users',
      'Access to basic courses',
      'Email support',
      'Monthly reports',
    ],
    Professional: [
      'Up to 25 users',
      'Access to all courses',
      'Priority email support',
      'Weekly reports',
      'Custom branding',
    ],
    Enterprise: [
      'Up to 50+ users',
      'Access to all courses',
      'Dedicated account manager',
      'Real-time analytics',
      'Custom branding',
      'API access',
    ],
  };

  const features = planFeatures[company.planName as keyof typeof planFeatures] || [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-900">Subscription</h1>
        <p className="text-gray-600 mt-2">Manage your company's subscription and billing</p>
      </div>

      {/* Current Plan Overview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-blue-100 mb-2">Current Plan</p>
            <h2 className="font-bold text-4xl">{company.planName}</h2>
          </div>
          <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <CreditCard className="w-8 h-8" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-blue-100 text-sm mb-1">Status</p>
            <p className="font-bold text-xl">{company.subscriptionStatus}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Active Until</p>
            <p className="font-bold text-xl">
              {new Date(company.activeUntil).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Days Remaining</p>
            <p className="font-bold text-xl">{daysRemaining} days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Seat Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Seat Usage</p>
              <p className="font-bold text-2xl text-gray-900">
                {companyUsers.length} / {company.seatLimit}
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full ${
                seatUtilization > 90 ? 'bg-red-600' : seatUtilization > 70 ? 'bg-yellow-600' : 'bg-green-600'
              }`}
              style={{ width: `${seatUtilization}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">{Math.round(seatUtilization)}% utilized</p>
        </div>

        {/* Renewal Date */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Next Renewal</p>
              <p className="font-bold text-2xl text-gray-900">{daysRemaining}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            days until {new Date(company.activeUntil).toLocaleDateString()}
          </p>
        </div>

        {/* Plan Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Plan Type</p>
              <p className="font-bold text-2xl text-gray-900">{company.planName}</p>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View plan details →
          </button>
        </div>
      </div>

      {/* Plan Features */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="font-bold text-xl text-gray-900 mb-4">Plan Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-2">Need more seats or features?</h3>
            <p className="text-gray-600">
              Contact your account manager to upgrade your plan and unlock additional capabilities.
            </p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap">
            Contact Sales
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        <h2 className="font-bold text-xl text-gray-900 mb-4">Billing History</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">March 2026 - {company.planName} Plan</p>
              <p className="text-sm text-gray-600">Paid on March 1, 2026</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Download Invoice
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">February 2026 - {company.planName} Plan</p>
              <p className="text-sm text-gray-600">Paid on February 1, 2026</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Download Invoice
            </button>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">January 2026 - {company.planName} Plan</p>
              <p className="text-sm text-gray-600">Paid on January 1, 2026</p>
            </div>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Download Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
