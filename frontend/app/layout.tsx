import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Whiteboard Tutor',
  description: 'Interactive whiteboard driven by Azure OpenAI narration and drawing commands.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
