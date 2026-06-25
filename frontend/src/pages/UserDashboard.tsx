import { useState, useEffect } from 'react';
import { storesAPI, ratingsAPI, usersAPI } from '../services/api';
import type { Store } from '../types';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

export const UserDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [rating, setRating] = useState(0);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  useEffect(() => {
    loadStores();
  }, [searchName, searchAddress]);

  const loadStores = async () => {
    try {
      const response = await storesAPI.getAll({
        name: searchName,
        address: searchAddress,
      });
      setStores(response.data);
    } catch (error) {
      console.error('Failed to load stores', error);
    }
  };

  const handleRateStore = async (storeId: string) => {
    try {
      if (selectedStore?.userRating) {
        const userRatings = await ratingsAPI.getByUser();
        const existingRating = userRatings.data.find((r: any) => r.storeId === storeId);
        if (existingRating) {
          await ratingsAPI.update(existingRating.id, { rating, storeId });
        }
      } else {
        await ratingsAPI.create({ rating, storeId });
      }
      setSelectedStore(null);
      setRating(0);
      loadStores();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit rating');
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
          <h1 className="text-3xl font-bold text-gray-900">Store Directory</h1>
          <Button onClick={() => setShowPasswordModal(true)}>Update Password</Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Search by store name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <Input
            placeholder="Search by address"
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <Card key={store.id}>
              <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
              <p className="mt-1 text-sm text-gray-600">{store.address}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overall Rating</p>
                  <p className="text-xl font-bold text-blue-600">
                    {store.overallRating?.toFixed(2) || '0.00'} / 5
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Your Rating</p>
                  <p className="text-xl font-bold text-green-600">
                    {store.userRating ? `${store.userRating} / 5` : 'Not rated'}
                  </p>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                onClick={() => {
                  setSelectedStore(store);
                  setRating(store.userRating || 0);
                }}
              >
                {store.userRating ? 'Modify Rating' : 'Submit Rating'}
              </Button>
            </Card>
          ))}
        </div>

        {selectedStore && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Card className="w-full max-w-md">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Rate {selectedStore.name}
              </h2>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Rating (1-5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      className={`h-12 w-12 rounded-lg border-2 font-bold transition-colors ${
                        rating === value
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-gray-300 bg-white text-gray-900 hover:border-blue-600'
                      }`}
                      onClick={() => setRating(value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleRateStore(selectedStore.id)}
                  disabled={rating === 0}
                  className="flex-1"
                >
                  Submit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedStore(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
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
