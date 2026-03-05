import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-16 lg:ml-64 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
