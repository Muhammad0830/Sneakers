// ColorFilter.tsx
export const ColorFilter = ({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (values: string[]) => void;
}) => {
  const colors = [
    { color: "White", hex: "#ffffff" },
    { color: "Black", hex: "#000000" },
    { color: "Red", hex: "#ff0000" },
    { color: "Lightblue", hex: "#0000ff" },
    { color: "Lightgreen", hex: "#00ff00" },
    { color: "Pink", hex: "#ffc0cb" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 min-w-[14rem]">
      {colors.map((color) => (
        <label
          key={color.color}
          htmlFor={color.color}
          className="flex items-center text-sm gap-2 cursor-pointer py-0.5 px-1.5 overflow-hidden rounded-sm border border-blue-800 relative"
        >
          <input
            type="checkbox"
            id={color.color}
            checked={selected.includes(color.color)}
            onChange={() =>
              setSelected(
                selected.includes(color.color)
                  ? selected.filter((v) => v !== color.color)
                  : [...selected, color.color]
              )
            }
            className="sr-only peer"
          />
          <div
            className={`w-4 h-4 rounded-full border-1 border-blue-700 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors duration-300`}
          ></div>
          <label
            htmlFor={color.color}
            className="cursor-pointer select-none text-nowrap"
          >
            {color.color}
          </label>
          <div
            className={`absolute top-0 bottom-0 left-0 right-0 -z-10 translate-x-[100%] peer-checked:translate-x-[0%] transition-transform duration-300`}
            style={{
              background: `linear-gradient(to right, transparent 50%, ${color.hex})`,
            }}
          ></div>
        </label>
      ))}
    </div>
  );
};
