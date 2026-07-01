"use client";

import { useEffect, useState } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import { Loader2 } from "lucide-react";
import { LoginForm } from "@/features/studio/components/LoginForm";
import { StudioWorkspace } from "@/features/studio/components/StudioWorkspace";
import { supabase } from "@/lib/supabase/client";

type AuthSession = { user: { email?: string | null; id?: string } };

export default function Home() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setAuthLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session)
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="grid h-screen place-items-center bg-slate-950 text-slate-100">
        <Loader2 size={28} className="animate-spin text-studio-cyan" />
      </div>
    );
  }

  if (!session) {
    return <LoginForm onLogin={setSession} />;
  }

  return (
    <ReactFlowProvider>
      <StudioWorkspace
        userEmail={session.user.email ?? null}
        onLogout={() => {
          void supabase.auth.signOut().then(() => setSession(null));
        }}
      />
    </ReactFlowProvider>
  );
}
