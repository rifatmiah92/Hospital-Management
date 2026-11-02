import './globals.css';
import type { Metadata } from 'next';
import EmergencyBar from '@/components/layout/EmergencyBar';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'CarePlus Medical | Smart Hospital Management System',
  description: 'CarePlus Medical is a full-fledged Smart Hospital Management System in Bangladesh offering online appointment booking, doctor schedules, digital test reports, and telemedicine.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-teal-500 selection:text-white">
        <EmergencyBar />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
