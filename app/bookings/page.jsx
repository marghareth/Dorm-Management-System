'use client';

import ProtectedRoute from '@/components/ProtectedRoute';

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <h1>My Bookings</h1>
        <p>Your bookings will appear here.</p>
      </div>
    </ProtectedRoute>
  );
}
