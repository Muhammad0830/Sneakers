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

  useEffect(() => {
    setFrom(selected[0] || "");
    setTo(selected[1] || "");
  }, [selected]);

  console.log("selected", selected);

  return (
    <div className="gap-2 relative items-center">
      <input
        value={from}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            setFrom(value);
          }
        }}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder="From $"
        className="no-spinner border mx-1 w-[8rem] rounded px-2 py-1 m-1"
      />
      <input
        value={to}
        onChange={(e) => {
          const value = e.target.value;
          if (/^\d*$/.test(value)) {
            setTo(value);
          }
        }}
        placeholder="To $"
        className="no-spinner border mx-1 w-[8rem]  rounded px-2 py-1 m-1"
        inputMode="numeric"
        pattern="[0-9]*"
        type="text"
      />
    </div>
  );
};
