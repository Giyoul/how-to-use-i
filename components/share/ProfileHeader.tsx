type Props = {
  displayName: string;
  tagline: string | null;
};

export function ProfileHeader({ displayName, tagline }: Props) {
  const initial = displayName.charAt(0);

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
    </div>
  );
}
