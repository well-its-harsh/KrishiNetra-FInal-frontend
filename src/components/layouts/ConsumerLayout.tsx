// src/components/layouts/ConsumerLayout.tsx
import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@/components/consumer/Header';
import { BottomNav } from '@/components/consumer/BottomNav';

interface ConsumerLayoutProps {
  children?: ReactNode;
}

export const ConsumerLayout = ({ children }: ConsumerLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">
        {children || <Outlet />}
      </main>
      <BottomNav />
    </div>
  );
};