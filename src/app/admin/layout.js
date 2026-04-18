import '../globals.css';
import './admin.css';

export const metadata = { title: 'Admin — Gate International' };

export default function AdminRootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className="admin-shell">{children}</body>
    </html>
  );
}
