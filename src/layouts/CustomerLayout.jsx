import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import { Footer, BottomNav } from '../components/common/Footer';

export default function CustomerLayout() {
  return (
    <>
      <Header />
      <main style={{ flex: 1, paddingBottom: 8 }}>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
