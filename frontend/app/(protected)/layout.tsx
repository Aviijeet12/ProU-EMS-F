"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function verify() {
      try {
        const token = localStorage.getItem("proums_token");

        // Not logged in → redirect to login
        if (!token) {
          router.replace("/login");
          return;
        }

        // Validate token with backend
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/validate`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        // Invalid token → redirect
        if (!data.success) {
          router.replace("/login");
          return;
        }

        // Token valid → allow render
        setChecking(false);
      } catch (err) {
        router.replace("/login");
      }
    }

    verify();
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  // No providers here — they already wrap the entire app globally
  return <>{children}</>;
}
