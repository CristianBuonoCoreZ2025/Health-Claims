import { ShieldCheck } from "lucide-react";

// Layout simple centrado para las paginas de autenticacion (sin sidebar).
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 flex items-center gap-2">
        <ShieldCheck className="size-7 text-primary" />
        <span className="text-xl font-semibold tracking-tight">Health Claims</span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
