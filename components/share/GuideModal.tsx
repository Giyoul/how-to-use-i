"use client";

import { X } from "lucide-react";

type Props = { onClose: () => void };

export function GuideModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      style={{ background: "rgba(26,25,24,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-lg flex flex-col gap-5 overflow-y-auto"
        style={{
          background: "#F5F4F1",
          borderRadius: "24px 24px 0 0",
          padding: "28px 24px 40px",
          maxHeight: "85dvh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-[#1A1918] font-bold" style={{ fontSize: 18 }}>
            나 사용법 공유 설명서
          </span>
          <button
            onClick={onClose}
            className="flex items-center justify-center rounded-full"
            style={{ width: 32, height: 32, background: "#EDECEA" }}
          >
            <X size={16} color="#6D6C6A" />
          </button>
        </div>

        {/* Section 1 */}
        <Section number={1} title="첫인상 나누기 (자기소개)">
          <p className="text-[#6D6C6A] leading-relaxed" style={{ fontSize: 14 }}>
            먼저 가볍게 인사를 나누며 자신을 소개해 주세요. 이름과 함께 여러분의 개성이 담긴 한 줄 소개를 들려주면 분위기가 훨씬 부드러워질 거예요! 😊
          </p>
        </Section>

        {/* Section 2 */}
        <Section number={2} title="돌아가며 깊이 알아가기">
          <p className="text-[#6D6C6A] leading-relaxed" style={{ fontSize: 14 }}>
            준비된 8가지 질문에 대해 한 명씩 번갈아 가며 답변합니다.
          </p>
          <div className="flex flex-col gap-3 mt-1">
            <Tip emoji="📢" label="TMI 대환영!">
              "이런 것까지 말해도 되나?" 싶을 정도로 솔직하고 자세하게 자신의 이야기를 들려주세요.
            </Tip>
            <Tip emoji="👂" label="경청의 미덕">
              한 사람이 이야기를 마칠 때까지 상대방은 따뜻한 눈빛으로 끝까지 들어줍니다. 중간에 말을 끊지 않는 것이 포인트예요!
            </Tip>
            <Tip emoji="💖" label="궁금함 더하기">
              상대방의 이야기가 끝나면, 방금 들은 내용 중 궁금한 점을 꼭 하나 이상 질문해 주세요. 질문은 상대에 대한 가장 큰 관심의 표현입니다.
            </Tip>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <span
          className="flex items-center justify-center rounded-full text-white font-bold"
          style={{ width: 24, height: 24, background: "#3D8A5A", fontSize: 13, flexShrink: 0 }}
        >
          {number}
        </span>
        <span className="text-[#1A1918] font-semibold" style={{ fontSize: 15 }}>
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}

function Tip({ emoji, label, children }: { emoji: string; label: string; children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col gap-1"
      style={{
        background: "#EDECEA",
        borderRadius: 12,
        padding: "12px 14px",
      }}
    >
      <span className="text-[#1A1918] font-semibold" style={{ fontSize: 13 }}>
        {emoji} {label}
      </span>
      <span className="text-[#6D6C6A] leading-relaxed" style={{ fontSize: 13 }}>
        {children}
      </span>
    </div>
  );
}
