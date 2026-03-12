"use client";

import { MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export function KakaoLoginButton() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handlePageShow(e: PageTransitionEvent) {
      if (e.persisted) setLoading(false);
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  async function handleLogin() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: "profile_nickname profile_image",
      },
    });
    // 리다이렉트 후 로딩 상태 유지 (카카오 페이지로 이동)
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="flex w-full items-center justify-center gap-2.5 rounded-[14px] font-bold text-[#1A1918] transition-opacity disabled:opacity-60"
      style={{ height: 54, background: "#FEE500", fontSize: 16 }}
    >
      {loading ? (
        <Spinner color="#1A1918" />
      ) : (
        <MessageCircle size={22} />
      )}
      {loading ? "연결 중..." : "카카오로 시작하기"}
    </button>
  );
}

function Spinner({ color }: { color: string }) {
  return (
    <svg
      className="animate-spin"
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
    >
      <circle
        cx="10" cy="10" r="8"
        stroke={color}
        strokeOpacity="0.25"
        strokeWidth="2.5"
      />
      <path
        d="M18 10a8 8 0 0 0-8-8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
