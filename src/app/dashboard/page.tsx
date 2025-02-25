"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  name: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me");
        
        if (!response.ok) {
          throw new Error("Not authenticated");
        }

        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        // Redirect to login if not authenticated
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-4xl space-y-8 rounded-lg bg-white p-10 shadow-md">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Welcome back, {user?.name}!
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
          <div className="mt-4 rounded-md bg-gray-50 p-4">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/login");
            }}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
} 