import React, { useState } from 'react';
import { Search, Filter, Download, Plus, Eye, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

// Payments Page
export const PaymentsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-slate-900">Payment Management</h1>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
        <Plus className="w-5 h-5" /> New Payment
      </button>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex gap-4 mb-6">
        <input type="text" placeholder="Search payments..." className="flex-1 px-4 py-2 border border-slate-300 rounded-lg" />
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>
      <table className="w-full">
        <thead className="border-b border-slate-200">
          <tr>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Transaction ID</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Amount</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-slate-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3,4,5].map(i => (
            <tr key={i} className="border-b border-slate-200 hover:bg-slate-50">
              <td className="py-3 px-4">TXN-{String(i).padStart(5, '0')}</td>
              <td className="py-3 px-4 font-semibold">$2,450.00</td>
              <td className="py-3 px-4"><span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Completed</span></td>
              <td className="py-3 px-4">2024-01-{String(i).padStart(2, '0')}</td>
              <td className="py-3 px-4 flex gap-2"><Eye className="w-4 h-4 cursor-pointer" /> <Edit className="w-4 h-4 cursor-pointer" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Property Verification Page
export const PropertyVerificationPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-slate-900">Property Verification</h1>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
        <Plus className="w-5 h-5" /> Verify Property
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Pending Verification</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">12</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Verified Properties</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">1,240</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Rejected</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Pending Properties</h2>
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-semibold">Property #{i}</p>
              <p className="text-sm text-slate-600">Submitted 2 days ago</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200">Approve</button>
              <button className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// User Verification Page
export const UserVerificationPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-slate-900">User Verification</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Pending Tenants</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Pending Landlords</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Pending Managers</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">5</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Verified Users</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">45.2K</p>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Verification Queue</h2>
      <div className="space-y-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-semibold">User #{i} - {['Tenant', 'Landlord', 'Manager', 'Tenant'][i-1]}</p>
              <p className="text-sm text-slate-600">Submitted documents</p>
            </div>
            <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200">Review</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Support Tickets Page
export const SupportTicketsPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-slate-900">Support Tickets</h1>
      <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
        <Plus className="w-5 h-5" /> New Ticket
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Open Tickets</p>
        <p className="text-3xl font-bold text-red-600 mt-2">5</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">In Progress</p>
        <p className="text-3xl font-bold text-yellow-600 mt-2">12</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Resolved</p>
        <p className="text-3xl font-bold text-green-600 mt-2">234</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Avg Response Time</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">2.5h</p>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Recent Tickets</h2>
      <div className="space-y-3">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-semibold">Ticket #{String(i).padStart(4, '0')}</p>
              <p className="text-sm text-slate-600">Payment issue - High Priority</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${i === 1 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
              {i === 1 ? 'Urgent' : 'In Progress'}
            </span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Transportation Page
export const TransportationPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-slate-900">Transportation Management</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Active Drivers</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">156</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Active Bookings</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">42</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Fleet Vehicles</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">89</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Daily Revenue</p>
        <p className="text-3xl font-bold text-green-600 mt-2">$4,250</p>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Driver Management</h2>
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <p className="font-semibold">Driver #{i}</p>
              <p className="text-sm text-slate-600">Rating: 4.8/5 • Trips: 245</p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Communication Page
export const CommunicationPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-slate-900">System Communication</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Unread Messages</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">24</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Active Announcements</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">8</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-slate-600 text-sm">Pending Notifications</p>
        <p className="text-3xl font-bold text-slate-900 mt-2">156</p>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
      <div className="space-y-3">
        {[1,2,3].map(i => (
          <div key={i} className="p-4 border border-slate-200 rounded-lg">
            <p className="font-semibold">Message from User #{i}</p>
            <p className="text-sm text-slate-600 mt-1">This is a sample message content...</p>
            <p className="text-xs text-slate-500 mt-2">2 hours ago</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);
