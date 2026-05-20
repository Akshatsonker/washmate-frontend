'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoaded } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Only redirect once auth state is loaded from localStorage
    if (!isLoaded) return;
    
    if (isAuthenticated) {
      router.replace('/dashboard');
    } else if (typeof window !== 'undefined') {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
      if (isStandalone) {
        router.replace('/signin');
      }
    }
  }, [isAuthenticated, isLoaded, router]);

  if (!mounted || !isLoaded || isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8 text-center">
        
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo.jpeg" 
            alt="WashMate Logo" 
            width={200} 
            height={60} 
            className="w-auto h-20 object-contain" 
            priority 
          />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to WashMate</h1>
        <p className="text-gray-600 mb-8">Scan to sign in or download our app for the best experience.</p>

        <div className="flex flex-col items-center justify-center mb-8">
          <div className="p-3 bg-white rounded-xl border-2 border-indigo-100 shadow-sm inline-block">
            <Image 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://washmate-frontend-9f59.vercel.app/signin`}
              alt="Scan to Sign In"
              width={200}
              height={200}
              className="rounded-lg"
              unoptimized
            />
          </div>
          <p className="text-sm text-indigo-600 font-medium mt-4">Point your phone camera here</p>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-3">Already on mobile or prefer browser?</p>
          <Link href="/signin">
            <button className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors">
              Continue to Sign In
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}