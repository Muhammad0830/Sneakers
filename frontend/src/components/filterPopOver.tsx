import FILTER_COMPONENTS from "@/utils/Filter_components";

export default function FilterPopOver({
  Filter,
  selectedValues,
  setSelectedValues,
}: {
  Filter: string;
  selectedValues: string[];
  setSelectedValues: (values: string[]) => void;
  index: number;
}) {
  const CustomFilter = FILTER_COMPONENTS[Filter];

  if (CustomFilter) {
    return (
      <CustomFilter selected={selectedValues} setSelected={setSelectedValues} />
    );
  }

  // Default fallback UI (e.g., for Size)
  const options =
    {
      Size: ["XS", "S", "M", "L", "XL"],
    }[Filter] || [];

  return (
    <div className="grid grid-cols-3 sm:min-w-[12rem] gap-2">
      {options.map((option) => (
        <label
          key={option}
          htmlFor={option}
          className="flex items-center gap-2 cursor-pointer sm:py-0.5 sm:px-1.5 px-2 py-1 overflow-hidden rounded-sm border border-blue-800 relative"
        >
          <input
            type="checkbox"
            id={option}
            checked={selectedValues.includes(option)}
            onChange={() =>
              setSelectedValues(
                selectedValues.includes(option)
                  ? selectedValues.filter((v) => v !== option)
                  : [...selectedValues, option]
              )
            }
            className="sr-only peer"
          />
          <div
            className={`w-3 h-3 rounded-full border-1 border-blue-700 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors duration-300`}
          ></div>
          <label
            htmlFor={option}
            className="cursor-pointer select-none text-nowrap sm:text-md text-sm"
          >
            {option}
          </label>
          <div
            className={`absolute top-0 bottom-0 left-0 right-0 -z-10 translate-x-[100%] peer-checked:translate-x-[0%] transition-transform duration-300`}
            style={{
              background: "linear-gradient(to right, transparent 30%, #c7ebf0)",
            }}
          ></div>
        </label>
      ))}
    </div>
  );
}
