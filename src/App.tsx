import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { routes } from './routes';
import MainLayout from '@/components/layouts/MainLayout';
import { AuthProvider } from '@/contexts/AuthContext';

const App: React.FC = () => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Router>
        <AuthProvider>
          <IntersectObserver />
          <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-background">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-sm text-muted-foreground">Loading…</p>
              </div>
            </div>
          }>
            <MainLayout>
              <Routes>
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} element={route.element} />
                ))}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </MainLayout>
          </Suspense>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
