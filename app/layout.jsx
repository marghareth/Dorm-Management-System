import './globals.css';

export const metadata = {
  title: 'Xanelle Dorms — Your Home Away From Home',
  description: 'Comfortable, affordable dorm living in a well-managed space.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}