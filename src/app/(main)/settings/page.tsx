'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajustes</CardTitle>
          <CardDescription>Gestiona las preferencias de la aplicación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-4">
               <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                     <Label>Tema de la aplicación</Label>
                     <p className="text-sm text-muted-foreground">
                        Elige entre el tema claro y oscuro.
                     </p>
                  </div>
                  <ThemeToggle />
               </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
