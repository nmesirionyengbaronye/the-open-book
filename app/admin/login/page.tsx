'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: (form.elements.namedItem("username") as HTMLInputElement).value,
        password: (form.elements.namedItem("password") as HTMLInputElement).value,
      }),
    });

    if (data.ok) {
      router.push("/admin");
    } else {
      const res = await data.json();
      setError(res.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen grid place-items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-8 w-full max-w-sm"
      >
         <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-bright grid place-items-center">
             <Lock className="w-5 h-5 text-background" />
           </div>
           <h1 className="font-display text-2xl">Admin Login</h1>
         </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            className="w-full bg-background/60 border border-gold/20 rounded-lg px-3 py-2 text-sm"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            className="w-full bg-background/60 border border-gold/20 rounded-lg px-3 py-2 text-sm"
            required
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gold text-background font-semibold inline-flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Login
          </button>
        </form>
      </motion.div>
    </main>
  );
}