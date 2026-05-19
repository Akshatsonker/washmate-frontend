'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { TopNav } from '@/components/shared/TopNav';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/useAuth';
import { mockVendors } from '@/lib/utils/mockData';

export default function VendorSettingsPage() {
  const { user } = useAuth();
  const vendor = mockVendors.find(v => v.id === user?.id);
  
  const [storeName, setStoreName] = useState(vendor?.name || '');
  const [location, setLocation] = useState(vendor?.location || '');
  const [phone, setPhone] = useState(vendor?.phone || '');
  const [openTime, setOpenTime] = useState(vendor?.operatingHours.open || '08:00');
  const [closeTime, setCloseTime] = useState(vendor?.operatingHours.close || '20:00');
  const [selectedServices, setSelectedServices] = useState<string[]>(vendor?.services || []);
  const [saving, setSaving] = useState(false);

  const allServices = [
    'appron_press', 'appron_without_press',
    'shirt_press', 'shirt_without_press',
    'pant_press', 'pant_without_press',
    'kurti_press', 'kurti_without_press',
    'tshirt_press', 'tshirt_without_press',
    'lower_shorts', 'bedsheet',
    'curtains_press', 'curtains_without_press',
    'shoes', 'bag'
  ];

  const handleToggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate saving
    setTimeout(() => {
      setSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav title="Settings" />
        
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Settings</h1>
              <p className="text-gray-600 mt-2">
                Manage your store information and preferences
              </p>
            </div>

            {/* Store Information */}
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Store Name</label>
                  <Input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="Enter store name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <Textarea
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter full address or location"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card>
              <CardHeader>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Opening Time</label>
                    <Input
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Closing Time</label>
                    <Input
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-900">
                    Hours: {openTime} - {closeTime}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services Offered</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select which services your store offers:
                </p>

                <div className="space-y-3">
                  {allServices.map((service) => (
                    <label
                      key={service}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => handleToggleService(service)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium text-gray-900">
                        {service.charAt(0).toUpperCase() + service.slice(1).replace(/_/g, ' ')}
                      </span>
                    </label>
                  ))}
                </div>

                {selectedServices.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedServices.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service.charAt(0).toUpperCase() + service.slice(1).replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Performance Stats */}
            {vendor && (
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Rating</p>
                    <p className="text-3xl font-bold text-orange-600 mt-2">
                      ⭐ {vendor.rating}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Based on customer reviews</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">
                      {vendor.totalOrders}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Completed orders</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Acceptance Rate</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      {(vendor.acceptanceRate * 100).toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Orders accepted</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="flex gap-4">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
                size="lg"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" className="flex-1" size="lg">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
