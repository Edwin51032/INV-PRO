'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Boxes } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center gap-4">
        <Boxes className="h-12 w-12 animate-spin text-primary" />
        <h1 className="text-xl font-semibold">Redirigiendo...</h1>
      </div>
    </div>
  );
}
