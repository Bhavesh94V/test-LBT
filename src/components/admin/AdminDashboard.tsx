'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Edit2, Trash2, Eye, Phone, Mail, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Dashboard Stats Component
const DashboardStats = () => {
  const stats = [
    { label: 'Total Properties', value: '45', change: '+12%', icon: '🏢' },
    { label: 'Active Groups', value: '38', change: '+8%', icon: '👥' },
    { label: 'Total Users', value: '2,345', change: '+23%', icon: '👤' },
    { label: 'Today Inquiries', value: '42', change: '+15%', icon: '📧' },
    { label: 'Pending Payments', value: '₹45.5L', change: '-5%', icon: '💰' },
    { label: 'Page Views', value: '12.5K', change: '+35%', icon: '📊' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <Card key={idx}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
            <div className={`text-xs mt-2 ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Analytics Charts Component
const AnalyticsCharts = () => {
  const visitorData = [
    { name: 'Mon', users: 400, views: 2400 },
    { name: 'Tue', users: 300, views: 1398 },
    { name: 'Wed', users: 200, views: 9800 },
    { name: 'Thu', users: 278, views: 3908 },
    { name: 'Fri', users: 189, views: 4800 },
    { name: 'Sat', users: 239, views: 3800 },
    { name: 'Sun', users: 349, views: 4300 },
  ];

  const revenueData = [
    { name: 'Week 1', revenue: 4000 },
    { name: 'Week 2', revenue: 3000 },
    { name: 'Week 3', revenue: 2000 },
    { name: 'Week 4', revenue: 2780 },
  ];

  const statusData = [
    { name: 'Open', value: 35 },
    { name: 'Filling', value: 45 },
    { name: 'Locked', value: 20 },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Visitor Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" />
              <Line type="monotone" dataKey="views" stroke="#10b981" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Group Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={{ position: 'insideRight' }} outerRadius={80} fill="#8884d8" dataKey="value">
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

// Properties Management Component
const PropertiesManagement = () => {
  const [properties] = useState([
    { id: 1, name: 'Sky Heights', location: 'Mumbai', status: 'Newly Launched', slots: 50, filled: 32, groups: 3 },
    { id: 2, name: 'Green Towers', location: 'Bangalore', status: 'Under Construction', slots: 40, filled: 28, groups: 2 },
    { id: 3, name: 'Ocean View', location: 'Pune', status: 'Ready to Move', slots: 30, filled: 30, groups: 1 },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Properties Management</CardTitle>
            <CardDescription>Manage all properties</CardDescription>
          </div>
          <Button><Plus className="w-4 h-4 mr-2" />Add Property</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Slots</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((prop) => (
              <TableRow key={prop.id}>
                <TableCell className="font-medium">{prop.name}</TableCell>
                <TableCell>{prop.location}</TableCell>
                <TableCell>
                  <Badge variant="outline">{prop.status}</Badge>
                </TableCell>
                <TableCell>{prop.filled}/{prop.slots}</TableCell>
                <TableCell>{prop.groups}</TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost"><Edit2 className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost" className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Inquiries Management Component
const InquiriesManagement = () => {
  const [inquiries] = useState([
    { id: 1, name: 'Rajesh Kumar', phone: '9876543210', property: 'Sky Heights', status: 'New', date: '2024-02-08' },
    { id: 2, name: 'Priya Singh', phone: '9123456789', property: 'Green Towers', status: 'Contacted', date: '2024-02-07' },
    { id: 3, name: 'Amit Patel', phone: '9988776655', property: 'Ocean View', status: 'Qualified', date: '2024-02-06' },
  ]);

  const statusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'Qualified':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Inquiries</CardTitle>
        <CardDescription>Latest customer inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id}>
                <TableCell className="font-medium">{inquiry.name}</TableCell>
                <TableCell>{inquiry.phone}</TableCell>
                <TableCell>{inquiry.property}</TableCell>
                <TableCell>
                  <Badge className={statusColor(inquiry.status)}>{inquiry.status}</Badge>
                </TableCell>
                <TableCell>{inquiry.date}</TableCell>
                <TableCell className="space-x-1">
                  <Button size="sm" variant="ghost"><Phone className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost"><Mail className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Payments Management Component
const PaymentsManagement = () => {
  const [payments] = useState([
    { id: 1, user: 'Rajesh Kumar', property: 'Sky Heights', amount: '₹5,00,000', status: 'Completed', method: 'Bank Transfer' },
    { id: 2, user: 'Priya Singh', property: 'Green Towers', amount: '₹7,50,000', status: 'Pending', method: 'UPI' },
    { id: 3, user: 'Amit Patel', property: 'Ocean View', amount: '₹6,25,000', status: 'Completed', method: 'Razorpay' },
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Payments Management</CardTitle>
            <CardDescription>Track all payments</CardDescription>
          </div>
          <Button><Plus className="w-4 h-4 mr-2" />Create Payment</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.user}</TableCell>
                <TableCell>{payment.property}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell>
                  <Badge variant={payment.status === 'Completed' ? 'default' : 'secondary'}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost"><Edit2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Users Management Component
const UsersManagement = () => {
  const [users] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', joined: '2024-01-15', status: 'Active' },
    { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '9123456789', joined: '2024-01-20', status: 'Active' },
    { id: 3, name: 'Amit Patel', email: 'amit@example.com', phone: '9988776655', joined: '2024-02-01', status: 'Inactive' },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
        <CardDescription>Manage platform users</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.joined}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2">
                  <Button size="sm" variant="ghost"><Eye className="w-4 h-4" /></Button>
                  <Button size="sm" variant="ghost"><Edit2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage properties, groups, users, and payments</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <DashboardStats />
            <AnalyticsCharts />
            <InquiriesManagement />
          </TabsContent>

          <TabsContent value="properties">
            <PropertiesManagement />
          </TabsContent>

          <TabsContent value="inquiries">
            <InquiriesManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsManagement />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Platform Settings (Coming Soon)</label>
                  <p className="text-sm text-gray-600">Email templates, SMS settings, payment methods, and more will be configured here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
