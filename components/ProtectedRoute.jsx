'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   // Check if user is authenticated by checking for token in localStorage
  //   const token = localStorage.getItem('token');
  //   
  //   if (!token) {
  //     // No token found, redirect to login
  //     router.push('/login');
  //   } else {
  //     // Token exists, user is authenticated
  //     setIsAuthenticated(true);
  //   }
  //   
  //   setIsLoading(false);
  // }, [router]);

  if (isLoading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect, so don't render anything
  }

  return children;
}
