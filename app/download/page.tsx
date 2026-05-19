'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DownloadPage() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex justify-center mb-2">
            <Image 
              src="/logo.jpeg" 
              alt="WashMate Logo" 
              width={250} 
              height={80} 
              className="w-auto h-24 object-contain" 
              priority 
            />
          </div>
          <CardTitle className="text-center text-2xl">Install WashMate</CardTitle>
          <CardDescription className="text-center">
            Get the best experience by installing the WashMate app directly on your device. Fast, reliable, and always accessible!
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800 text-center w-full">
            <p className="mb-2 font-medium">Why install?</p>
            <ul className="text-left space-y-1 list-disc pl-5">
              <li>Access the app instantly from your home screen</li>
              <li>Faster loading speeds</li>
              <li>Better full-screen experience</li>
            </ul>
          </div>

          {isInstallable ? (
            <Button 
              onClick={handleInstallClick} 
              className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700"
            >
              ⬇️ Install App Now
            </Button>
          ) : (
            <div className="text-center space-y-2 w-full">
              <Button disabled className="w-full text-lg py-6 opacity-70">
                App Already Installed or Not Supported
              </Button>
              <p className="text-xs text-gray-500 mt-2 px-4">
                If you are on iOS, tap the Share button at the bottom of Safari and select <strong>"Add to Home Screen"</strong>.
              </p>
            </div>
          )}
          
          <a href="/" className="text-sm text-blue-600 hover:underline mt-4">
            Skip for now and go to Login
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
