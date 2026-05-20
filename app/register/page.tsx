'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const router = useRouter();
  const { isAuthenticated, register } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '', mobileNumber: '', address: '', roomNumber: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already logged in, redirect away
  useEffect(() => {
    if (isAuthenticated) router.push('/dashboard');
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(form.email, form.password, form.name, form.mobileNumber, form.address, form.roomNumber);

    if (result?.success) {
      // ✅ Auto-login after register — goes straight to dashboard
      router.replace('/dashboard');
    } else {
      // ✅ Shows real error like "User already exists"
      setError(result?.message || 'Registration failed. Try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex justify-center mb-4">
            <Image src="/logo.jpeg" alt="WashMate Logo" width={250} height={80} className="w-auto h-24 object-contain" priority />
          </div>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Sign up to start managing your laundry
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <Input
                type="tel"
                placeholder="Your mobile number"
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                type="text"
                placeholder="Your address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Room Number</label>
              <Input
                type="text"
                placeholder="Your room number"
                value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading} suppressHydrationWarning>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <a href="/signin" className="text-blue-600 underline hover:text-blue-700">
              Sign in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}