import { ChevronLeft, ChevronRight, Check } from "lucide-react";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  canProceed: boolean;
  saving: boolean;
};

export function StepNavigator({ onPrev, onNext, isFirst, isLast, canProceed, saving }: Props) {
  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={onPrev}
        disabled={isFirst || saving}
        className="flex flex-1 items-center justify-center gap-1.5 font-semibold text-[#6D6C6A] transition-opacity"
        style={{
          height: 52,
          background: "#EDECEA",
          borderRadius: 26,
          fontSize: 15,
          opacity: isFirst || saving ? 0.4 : 1,
        }}
      >
        <ChevronLeft size={16} />
        이전
      </button>

      <button
        onClick={onNext}
        disabled={!canProceed || saving}
        className="flex flex-1 items-center justify-center gap-1.5 font-semibold text-white transition-opacity disabled:opacity-50"
        style={{
          height: 52,
          background: "#3D8A5A",
          borderRadius: 26,
          fontSize: isLast ? 16 : 15,
        }}
      >
        {saving ? (
          <Spinner />
        ) : isLast ? (
          <>
            <Check size={18} />
            저장하기
          </>
        ) : (
          <>
            다음
            <ChevronRight size={16} />
          </>
        )}
      </button>
    </div>
  );
}

function Spinner() {
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
        stroke="white"
        strokeOpacity="0.35"
        strokeWidth="2.5"
      />
      <path
        d="M18 10a8 8 0 0 0-8-8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
