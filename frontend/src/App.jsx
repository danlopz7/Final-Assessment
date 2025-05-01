import React from 'react';
import OrdersPage2 from './pages/OrdersPage2';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white text-center py-4 text-2xl font-semibold">
        Order Management System
      </header>
      <main className="p-6">
        <OrdersPage2 />
      </main>
    </div>
  );
}

export default App;