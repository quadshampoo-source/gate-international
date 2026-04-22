import '../globals.css';
import './admin.css';
import './admin-atom.css';
import { AdminStyleInit } from './_components/style-toggle';

export const metadata = { title: 'Admin — Gate International' };

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="admin-shell">
        <AdminStyleInit />
        {children}
      </body>
    </html>
  );
}
