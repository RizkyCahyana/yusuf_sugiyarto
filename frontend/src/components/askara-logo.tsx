export function AskaraLogo({
  className = "",
  markOnly = false,
}: {
  className?: string;
  markOnly?: boolean;
}) {
  return (
    <span
      role="img"
      aria-label="Askara"
      className={`askara-logo ${markOnly ? "askara-logo-mark" : "askara-logo-full"} ${className}`}
    />
  );
}
