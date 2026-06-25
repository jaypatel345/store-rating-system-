import { useState, useEffect } from 'react';
import { ratingsAPI, usersAPI } from '../services/api';
import type { StoreOwnerDashboard as StoreOwnerDashboardType } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

export const StoreOwnerDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<StoreOwnerDashboardType[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await ratingsAPI.getOwnerDashboard();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await usersAPI.updatePassword(passwordData);
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: '', newPassword: '' });
      alert('Password updated successfully');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
          <Button onClick={() => setShowPasswordModal(true)}>Update Password</Button>
        </div>

        {dashboardData.length === 0 ? (
          <Card>
            <p className="text-center text-gray-600">No stores found for your account.</p>
          </Card>
        ) : (
          dashboardData.map((store) => (
            <Card key={store.storeId} className="mb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">{store.storeName}</h2>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Average Rating</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {store.averageRating.toFixed(2)} / 5
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Total Ratings</p>
                    <p className="text-2xl font-bold text-green-600">{store.totalRatings}</p>
                  </div>
                </div>
              </div>

              <h3 className="mb-3 text-lg font-semibold text-gray-900">User Ratings</h3>
              {store.ratings.length === 0 ? (
                <p className="text-gray-600">No ratings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                          User Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                          Rating
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.ratings.map((rating, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {rating.user.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {rating.user.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            <span className="inline-flex rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                              {rating.rating} / 5
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {new Date(rating.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          ))
        )}

        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-full max-w-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Update Password</h2>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  required
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  required
                />
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Update
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowPasswordModal(false)}
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
