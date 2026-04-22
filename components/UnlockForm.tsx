"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";

export function UnlockForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/access/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { message: string };

      if (!response.ok) {
        setStatus("error");
        setMessage(payload.message);
        return;
      }

      setStatus("idle");
      setMessage(payload.message);
      router.push("/practice");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("We could not reach the server. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-6">
      <div>
        <label htmlFor="purchase-email" className="text-sm text-slate-300">
          Purchase email address
        </label>
        <input
          id="purchase-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@work.com"
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 outline-none placeholder:text-slate-500 focus:border-emerald-400"
        />
      </div>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Verifying purchase..." : "Unlock my account"}
      </Button>
      {message ? (
        <p className={status === "error" ? "text-sm text-rose-300" : "text-sm text-emerald-300"}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
