'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useOrders } from '@/lib/hooks/useOrders';
import { mockVendors } from '@/lib/utils/mockData';

const serviceTypes = [
  { value: 'appron_press', label: 'Appron (Press)', price: 20 },
  { value: 'appron_without_press', label: 'Appron (Without Press)', price: 15 },
  { value: 'shirt_press', label: 'Shirt (Press)', price: 15 },
  { value: 'shirt_without_press', label: 'Shirt (Without Press)', price: 10 },
  { value: 'pant_press', label: 'Pant (Press)', price: 15 },
  { value: 'pant_without_press', label: 'Pant (Without Press)', price: 10 },
  { value: 'kurti_press', label: 'Kurti (Press)', price: 15 },
  { value: 'kurti_without_press', label: 'Kurti (Without Press)', price: 10 },
  { value: 'tshirt_press', label: 'Tshirt (Press)', price: 12 },
  { value: 'tshirt_without_press', label: 'Tshirt (Without Press)', price: 10 },
  { value: 'lower_shorts', label: 'Lower/Shorts', price: 10 },
  { value: 'bedsheet', label: 'Bedsheet', price: 15 },
  { value: 'curtains_press', label: 'Curtains (Press)', price: 30 },
  { value: 'curtains_without_press', label: 'Curtains (Without Press)', price: 15 },
  { value: 'shoes', label: 'Shoes', price: 50 },
  { value: 'bag', label: 'Bag', price: 50 },
];

export function OrderForm({ userId, userName, userMobile, userAddress, userRoom, onOrderCreated }) {
  const { createOrder } = useOrders();
  const [serviceType, setServiceType] = useState('appron_press');
  const [quantity, setQuantity] = useState(1);
  const [selectedVendorId, setSelectedVendorId] = useState('vendor-1');
  const [pickupDate, setPickupDate] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedService = serviceTypes.find(s => s.value === serviceType);
  const price = (selectedService?.price || 0) * quantity;
  const selectedVendor = mockVendors.find(v => v.id === selectedVendorId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pickupDate) {
      alert('Please fill all required fields');
      return;
    }

    setLoading(true);
    const deliveryDate = new Date(pickupDate);
    deliveryDate.setDate(deliveryDate.getDate() + 2); // 2 days for delivery

    const order = createOrder({
      studentId: userId,
      studentName: userName,
      mobileNumber: userMobile,
      address: userAddress,
      roomNumber: userRoom,
      vendorId: selectedVendorId,
      vendorName: selectedVendor?.name || '',
      serviceType,
      quantity,
      status: 'placed',
      pickupDate: new Date(pickupDate),
      deliveryDate,
      price,
    });

    setLoading(false);
    if (order) {
      alert('Order created successfully!');
      setServiceType('appron_press');
      setQuantity(1);
      setSelectedVendorId('');
      setPickupDate('');
      onOrderCreated?.();
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create New Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Service Type *</label>
            <Select value={serviceType} onValueChange={(v) => setServiceType(v)}>
              <SelectTrigger className="w-full [&>span]:truncate">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((service) => (
                  <SelectItem key={service.value} value={service.value}>
                    {service.label} - ₹{service.price}/item
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Quantity (kg/items) *
            </label>
            <Input
              type="number"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              placeholder="Enter quantity"
            />
          </div>

          {/* Select Vendor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Select Vendor *</label>
            <Select value={selectedVendorId} onValueChange={setSelectedVendorId}>
              <SelectTrigger className="w-full [&>span]:truncate">
                <SelectValue placeholder="Choose a vendor" />
              </SelectTrigger>
              <SelectContent>
                {mockVendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name} (⭐ {vendor.rating} • {vendor.location})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pickup Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pickup Date *</label>
            <Input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Vendor Info */}
          {selectedVendor && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900">Selected Vendor</p>
              <p className="text-sm text-blue-700 mt-1">{selectedVendor.name}</p>
              <p className="text-xs text-blue-600 mt-1">
                Hours: {selectedVendor.operatingHours.open} - {selectedVendor.operatingHours.close}
              </p>
              <p className="text-xs text-blue-600">
                Acceptance Rate: {(selectedVendor.acceptanceRate * 100).toFixed(0)}%
              </p>
            </div>
          )}

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service Fee:</span>
              <span className="font-medium">₹{(selectedService?.price || 0).toFixed(2)} × {quantity}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Amount:</span>
              <span className="text-xl font-bold text-blue-600">₹{price.toFixed(2)}</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating Order...' : 'Create Order'}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setServiceType('appron_press');
                setQuantity(1);
                setSelectedVendorId('');
                setPickupDate('');
              }}
            >
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
