import React from 'react';

import Navbar from '../components/Molecules/navigation/Navbar';
import Navigation from '../components/Molecules/navigation/Navigation';
import Sidebar from '../components/Molecules/sidebar/Sidebar';

type IDashboard = { children: React.ReactNode };

export default function Dashboard({ children }: IDashboard) {
  return (
    <>
      <Navbar />
      <div className="border-b-4 border-red-600 my-10" />
      <Navigation hasProfile={true} hasChangePassword={true} hasSetting={true} />
      <div className="flex bg-secondary">
        <div className="hidden md:block w-80 h-screen top-0 lg:sticky ">
          <Sidebar />
        </div>
        {/* navbar and body */}
        <div className="w-full md:col-span-9 xl:col-span-9 col-span-10 block">
          <div className="block relative w-full h-auto py-5 px-8">{children}</div>
        </div>
      </div>
    </>
  );
}
