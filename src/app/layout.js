import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Restaurant Ordering System',
  description: 'Order food directly from your table',
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
