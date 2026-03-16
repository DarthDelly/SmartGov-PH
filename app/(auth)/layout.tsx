export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-zinc-950 dark:via-zinc-950 dark:to-blue-950/20">
      {children}
    </div>
  );
}
