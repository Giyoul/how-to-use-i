type Props = {
  displayName: string;
  tagline: string | null;
  createdAt: string;
};

export function ProfileHeader({ displayName, tagline, createdAt }: Props) {
  const initial = displayName.charAt(0);
  const year = new Date(createdAt).getFullYear();
  const month = new Date(createdAt).getMonth() + 1;

  return (
    <div
      className="w-full flex flex-col gap-2.5"
      style={{
        background: "#3D8A5A",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 4px 20px #3D8A5A30",
      }}
    >
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 52, height: 52, background: "#FFFFFF28" }}
      >
        <span className="text-white font-bold" style={{ fontSize: 22 }}>
          {initial}
        </span>
      </div>

      <span className="text-white font-bold" style={{ fontSize: 22 }}>
        {displayName}
      </span>

      {tagline && (
        <span style={{ color: "#FFFFFFCC", fontSize: 13 }}>{tagline}</span>
      )}

      <span style={{ color: "#FFFFFFCC", fontSize: 14, lineHeight: 1.5 }}>
        저를 더 잘 이해할 수 있도록
        <br />
        8가지 질문에 솔직하게 답했어요
      </span>

      <span style={{ color: "#FFFFFF80", fontSize: 12 }}>
        {year}년 {month}월 작성
      </span>
    </div>
  );
}
