import Header from '@/components/header';
import { Outlet } from 'react-router';

function AppLayout() {
  return (
    <div>
      <main className="min-h-screen w-full px-3 pt-2">
        <Header />
        <Outlet />
      </main>
      <div className="p-10 text-3xl font-extrabold text-center bg-gray-800 mt-10">
        Made with 💖 by me
      </div>
    </div>
  );
}

export default AppLayout;
