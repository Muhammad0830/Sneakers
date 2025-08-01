import { useEffect, useState } from "react";

export const PriceFilter = ({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (values: string[]) => void;
}) => {
  const [from, setFrom] = useState(selected[0] || "");
  const [to, setTo] = useState(selected[1] || "");

  useEffect(() => {
    setSelected([from, to]);
  }, [from, to]);

  return (
    <div className="flex gap-2 items-center">
      <input
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        placeholder="From"
        className="border rounded px-2 py-1 w-20"
        type="number"
      />
      <span>-</span>
      <input
        value={to}
        onChange={(e) => setTo(e.target.value)}
        placeholder="To"
        className="border rounded px-2 py-1 w-20"
        type="number"
      />
    </div>
  );
};
