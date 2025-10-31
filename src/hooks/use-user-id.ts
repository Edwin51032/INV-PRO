'use client';

import { useState, useEffect } from 'react';

// Simple UUID generator that works in all contexts
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function useUserId() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // This code runs only on the client
    let id = localStorage.getItem('anonymousUserId');
    if (!id) {
      id = generateUUID();
      localStorage.setItem('anonymousUserId', id);
    }
    setUserId(id);
  }, []);

  return userId;
}
