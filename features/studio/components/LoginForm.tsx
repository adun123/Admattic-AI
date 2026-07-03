import { useState } from "react";
import { Clapperboard, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

export function LoginForm({
  onLogin
}: {
  onLogin: (session: { user: { email?: string | null; id?: string } } | null) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      if (isSignup) {
        const { error, data } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo(
          data.session
            ? "Akun berhasil dibuat. Kamu langsung masuk."
            : "Cek email kamu untuk konfirmasi akun."
        );
        if (data.session) onLogin(data.session);
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onLogin(data.session);
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Gagal memproses.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100"
      style={{
        backgroundImage: "url('/images/login-background.png')",
        backgroundPosition: "center",
        backgroundSize: "cover"
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,7,18,0.2)_0%,rgba(3,7,18,0.58)_48%,rgba(3,7,18,0.94)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_42%,rgba(22,199,216,0.16),transparent_34%)]" />

      <section className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_480px]">
        <div className="flex min-h-[38vh] items-end p-6 sm:p-10 lg:min-h-screen lg:p-12">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/20 px-3 py-2 text-xs font-semibold text-cyan-100 backdrop-blur">
              <Clapperboard size={15} />
              AI Video Storytelling Studio
            </div>
            <h1 className="max-w-lg text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Build campaign films from one story.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
              Masuk untuk lanjut menyusun scene, generate video, dan render final timeline.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-8 sm:px-8 lg:bg-slate-950/[0.38] lg:backdrop-blur-md">
          <form
            onSubmit={submit}
            className="w-full max-w-sm rounded-lg border border-white/[0.12] bg-slate-950/[0.72] p-6 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center overflow-hidden rounded-md border border-white/10 bg-white">
                <img
                  alt="Admattic"
                  className="h-full w-full object-contain p-1"
                  src="/images/lgo-admattic.jpg"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Admattic AI Studio</p>
                <p className="text-xs text-slate-400">Agency Anniversary POC</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white">
                {isSignup ? "Buat akun" : "Selamat datang"}
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                {isSignup ? "Daftar untuk mulai membuat workspace." : "Masuk ke workspace produksi videomu."}
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-300">Email</span>
                <input
                  type="email"
                  required
                  placeholder="nama@agency.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-studio-cyan focus:bg-white/[0.08]"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-300">Password</span>
                <input
                  type="password"
                  required
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-studio-cyan focus:bg-white/[0.08]"
                />
              </label>
            </div>

            {error ? (
              <div className="mt-4 rounded-md border border-red-400/25 bg-red-950/40 px-3 py-2 text-xs text-red-200">
                {error}
              </div>
            ) : null}
            {info ? (
              <div className="mt-4 rounded-md border border-emerald-400/25 bg-emerald-950/30 px-3 py-2 text-xs text-emerald-200">
                {info}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-md border border-studio-cyan bg-studio-cyan text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {isSignup ? "Daftar" : "Masuk"}
            </button>
            <button
              type="button"
              onClick={() => setIsSignup((current) => !current)}
              className="mt-4 block w-full text-center text-xs font-medium text-slate-400 transition hover:text-studio-cyan"
            >
              {isSignup ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

