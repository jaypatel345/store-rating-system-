import { useState, useEffect } from 'react';
import { usersAPI, storesAPI } from '../services/api';
import type { DashboardStats, User as UserType, Store } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'stores'>('stats');
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER',
  });
  const [newStore, setNewStore] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: '',
  });

  useEffect(() => {
    loadStats();
    loadUsers();
    loadStores();
  }, [filters, sortBy, sortOrder]);

  const loadStats = async () => {
    try {
      const response = await usersAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await usersAPI.getAll({
        ...filters,
        sortBy,
        sortOrder,
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users', error);
    }
  };

  const loadStores = async () => {
    try {
      const response = await storesAPI.getAll({
        sortBy,
        sortOrder,
      });
      setStores(response.data);
    } catch (error) {
      console.error('Failed to load stores', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersAPI.create(newUser);
      setShowAddUser(false);
      setNewUser({ name: '', email: '', password: '', address: '', role: 'USER' });
      loadUsers();
      loadStats();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await storesAPI.create(newStore);
      setShowAddStore(false);
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      loadStores();
      loadStats();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create store');
    }
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortOrder('ASC');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">Admin Dashboard</h1>

        <div className="mb-6 flex gap-2">
          <Button
            variant={activeTab === 'stats' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </Button>
          <Button
            variant={activeTab === 'users' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('users')}
          >
            Users
          </Button>
          <Button
            variant={activeTab === 'stores' ? 'primary' : 'secondary'}
            onClick={() => setActiveTab('stores')}
          >
            Stores
          </Button>
        </div>

        {activeTab === 'stats' && stats && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900">Total Stores</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">{stats.totalStores}</p>
            </Card>
            <Card>
              <h3 className="text-lg font-semibold text-gray-900">Total Ratings</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">{stats.totalRatings}</p>
            </Card>
          </div>
        )}

        {activeTab === 'users' && (
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Users</h2>
              <Button onClick={() => setShowAddUser(true)}>Add User</Button>
            </div>

            <div className="mb-4 grid gap-4 md:grid-cols-4">
              <Input
                placeholder="Filter by name"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              />
              <Input
                placeholder="Filter by email"
                value={filters.email}
                onChange={(e) => setFilters({ ...filters, email: e.target.value })}
              />
              <Input
                placeholder="Filter by address"
                value={filters.address}
                onChange={(e) => setFilters({ ...filters, address: e.target.value })}
              />
              <select
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={filters.role}
                onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="STORE_OWNER">Store Owner</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th
                      className="cursor-pointer px-4 py-2 text-left text-sm font-semibold text-gray-900"
                      onClick={() => handleSort('name')}
                    >
                      Name {sortBy === 'name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-2 text-left text-sm font-semibold text-gray-900"
                      onClick={() => handleSort('email')}
                    >
                      Email {sortBy === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-2 text-left text-sm font-semibold text-gray-900"
                      onClick={() => handleSort('address')}
                    >
                      Address {sortBy === 'address' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-2 text-left text-sm font-semibold text-gray-900"
                      onClick={() => handleSort('role')}
                    >
                      Role {sortBy === 'role' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.address}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {activeTab === 'stores' && (
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Stores</h2>
              <Button onClick={() => setShowAddStore(true)}>Add Store</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th
                      className="cursor-pointer px-4 py-2 text-left text-sm font-semibold text-gray-900"
                      onClick={() => handleSort('name')}
                    >
                      Name {sortBy === 'name' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-2 text-left text-sm font-semibold text-gray-900"
                      onClick={() => handleSort('email')}
                    >
                      Email {sortBy === 'email' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th
                      className="cursor-pointer px-4 py-2 text-left text-sm font-semibold text-gray-900"
                      onClick={() => handleSort('address')}
                    >
                      Address {sortBy === 'address' && (sortOrder === 'ASC' ? '↑' : '↓')}
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store) => {
                    const avgRating =
                      store.ratings && store.ratings.length > 0
                        ? store.ratings.reduce((sum, r) => sum + r.rating, 0) / store.ratings.length
                        : 0;
                    return (
                      <tr key={store.id} className="border-b border-gray-100">
                        <td className="px-4 py-3 text-sm text-gray-900">{store.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{store.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{store.address}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {avgRating.toFixed(2)} / 5
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {showAddUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-full max-w-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Add New User</h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <Input
                  label="Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  required
                />
                <Input
                  label="Password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  required
                />
                <Input
                  label="Address"
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  required
                />
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STORE_OWNER">Store Owner</option>
                </select>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Add User
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddUser(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}

        {showAddStore && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-full max-w-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Add New Store</h2>
              <form onSubmit={handleAddStore} className="space-y-4">
                <Input
                  label="Store Name"
                  value={newStore.name}
                  onChange={(e) => setNewStore({ ...newStore, name: e.target.value })}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={newStore.email}
                  onChange={(e) => setNewStore({ ...newStore, email: e.target.value })}
                  required
                />
                <Input
                  label="Address"
                  value={newStore.address}
                  onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}
                  required
                />
                <select
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  value={newStore.ownerId}
                  onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}
                  required
                >
                  <option value="">Select Owner</option>
                  {users
                    .filter((u) => u.role === 'STORE_OWNER')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                </select>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Add Store
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowAddStore(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
