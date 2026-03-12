"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";

type Props = { username: string };

export function ShareButton({ username }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `${window.location.origin}/share/${username}`;
    const isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    if (isMobile && navigator.share) {
      await navigator.share({ title: "나 사용법", url });
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="w-full bg-white flex flex-col"
      style={{ boxShadow: "0 -1px 0 #E5E4E180" }}
    >
      <div className="w-full" style={{ height: 1, background: "#E5E4E1" }} />
      <div style={{ padding: "16px 20px 34px" }}>
        <button
          onClick={handleShare}
          className="flex w-full items-center justify-center gap-2 text-white font-semibold transition-opacity active:opacity-80"
          style={{
            height: 52,
            background: "#3D8A5A",
            borderRadius: 26,
            fontSize: 16,
          }}
        >
          <Share2 size={18} />
          {copied ? "링크 복사됨!" : "공유하기"}
        </button>
      </div>
    </div>
  );
}
