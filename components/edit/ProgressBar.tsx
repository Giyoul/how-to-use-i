type Props = {
  current: number; // 1-based (1~9)
  total: number;
};

export function ProgressBar({ current, total }: Props) {
  const percent = (current / total) * 100;

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex items-center justify-between">
        <span className="text-[#6D6C6A] text-xs font-semibold">질문</span>
        <span className="text-[#3D8A5A] text-xs font-bold">
          {current} / {total}
        </span>
      </div>
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height: 6, background: "#E5E4E1" }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, background: "#3D8A5A" }}
        />
      </div>
    </div>
  );
}
