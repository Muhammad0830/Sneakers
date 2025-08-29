import { useTheme } from "next-themes";

interface TrendingProduct {
  id: number;
  name: string;
  size: string;
}

export default function Dots({
  products,
  positions,
}: {
  products: TrendingProduct[];
  positions: { x: number; y: number }[];
}) {
  const { theme } = useTheme();

  if (positions.length === 0) return null;

  return (
    <g>
      {products.map((_, index) => (
        <circle
          key={index}
          r={6}
          fill={theme === "light" ? "white" : "black"}
          stroke={theme === "light" ? "black" : "#ffffff50"}
          strokeWidth={1}
          cx={positions[index].x.toString()}
          cy={positions[index].y.toString()}
        />
      ))}
    </g>
  );
}
