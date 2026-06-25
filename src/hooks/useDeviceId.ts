'use client';

import { useState, useEffect } from 'react';

export function useDeviceId(): string {
  const [deviceId, setDeviceId] = useState('');

  useEffect(() => {
    const existing = localStorage.getItem('hv_device_id');
    if (existing) {
      setDeviceId(existing);
    } else {
      const id = crypto.randomUUID();
      localStorage.setItem('hv_device_id', id);
      setDeviceId(id);
    }
  }, []);

  return deviceId;
}
