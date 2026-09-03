'use client';

import React from 'react';
import { AuthProvider } from '@/lib/auth';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161B22',
            color: '#F0F6FC',
            border: '1px solid #30363D',
          },
        }}
      />
      {children}
    </AuthProvider>
  );
}
