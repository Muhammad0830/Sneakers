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
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          onClick={() =>
            setSelectedValues(
              selectedValues.includes(option)
                ? selectedValues.filter((v) => v !== option)
                : [...selectedValues, option]
            )
          }
          className={`px-2 py-1 border rounded ${
            selectedValues.includes(option) ? "bg-blue-500 text-white" : ""
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
