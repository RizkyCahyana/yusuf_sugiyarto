import type { CSSProperties } from "react";
import { Lightbulb } from "lucide-react";

const symbols = [
  "digital",
  "kolaborasi",
  "kaderisasi",
  "meritokrasi",
  "profesionalisme",
];

export function ProgramIcon({ slug }: { slug: string }) {
  const symbol = symbols.find((name) => slug.includes(name));
  if (!symbol) return <Lightbulb aria-hidden="true" />;
  return (
    <span
      aria-hidden="true"
      className="program-pdf-icon"
      style={
        {
          "--pillar-image": `url(/images/profile/pilar-${symbol}.png)`,
        } as CSSProperties
      }
    />
  );
}
