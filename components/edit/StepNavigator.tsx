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
        disabled={isFirst}
        className="flex flex-1 items-center justify-center gap-1.5 font-semibold text-[#6D6C6A] transition-opacity"
        style={{
          height: 52,
          background: "#EDECEA",
          borderRadius: 26,
          fontSize: 15,
          opacity: isFirst ? 0.4 : 1,
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
        {isLast ? (
          <>
            <Check size={18} />
            {saving ? "저장 중..." : "저장하기"}
          </>
        ) : (
          <>
            {saving ? "..." : "다음"}
            {!saving && <ChevronRight size={16} />}
          </>
        )}
      </button>
    </div>
  );
}
