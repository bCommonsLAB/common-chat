'use client';

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-4">
      {children}
    </div>
  );
} 