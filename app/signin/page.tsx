'use client';

import { storage } from '@/lib/utils/storage';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/hooks/useAuth';
import { initializeMockData } from '@/lib/utils/mockData';
import { clearSession } from '@/lib/hooks/useAuth';

export default function SignInPage() {
  const router = useRouter();
  const { isAuthenticated, isLoaded, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Initialize mock data if not present
    initializeMockData();

    // Check if running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsStandalone(true);
    }
  }, []); // ← empty deps, runs only once

  useEffect(() => {
    // ✅ Separate effect — redirect if already logged in
    if (isLoaded && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoaded, router]);

  if (!isLoaded || isAuthenticated) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password, mobileNumber, address, roomNumber);
      if (success) {
        router.replace('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
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
          <CardTitle className="text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to manage your laundry orders
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Mobile Number</label>
              <Input
                type="tel"
                placeholder="Your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                type="text"
                placeholder="Your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Room Number</label>
              <Input
                type="text"
                placeholder="Your room number"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading} suppressHydrationWarning>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Hint for users */}
          <p className="text-sm text-center mt-4">
            Don’t have an account?{' '}
            <a href="/register" className="text-blue-600 underline">
              Register here
            </a>
          </p>

          {!isStandalone && (
            <div className="mt-4 pt-4 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600 mb-4">Want a better experience?</p>

              <a href="/download" className="inline-flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md font-medium text-sm hover:bg-indigo-100 transition-colors">
                📱 Download WashMate App
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
