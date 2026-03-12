type Props = {
  number: number; // 1-based
  size?: "sm" | "lg";
};

export function QuestionBadge({ number, size = "lg" }: Props) {
  const isOdd = number % 2 !== 0;
  const bg = isOdd ? "#C8F0D8" : "#FDE8DA";
  const color = isOdd ? "#3D8A5A" : "#D89575";
  const dim = size === "lg" ? 34 : 22;
  const fontSize = size === "lg" ? 13 : 10;

  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0 font-semibold"
      style={{ width: dim, height: dim, background: bg, color, fontSize }}
    >
      {String(number).padStart(2, "0")}
    </div>
  );
}
