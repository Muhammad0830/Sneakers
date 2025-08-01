import React from "react";

export function FilterPopOver({
  Filter,
  index,
  selectedValues,
  setSelectedValues,
}: {
  Filter: string;
  index: number;
  selectedValues: string[];
  setSelectedValues: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const handleCheckboxChange = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  if (Filter === "Gender") {
    return (
      <div className="flex flex-col gap-2">
        {["men", "women", "kids"].map((value) => (
          <label
            key={value}
            htmlFor={value}
            className="flex items-center gap-2 cursor-pointer py-0.5 px-1.5 rounded-sm border border-blue-800 relative"
          >
            <input
              type="checkbox"
              id={value}
              checked={selectedValues.includes(value)}
              onChange={() => handleCheckboxChange(value)}
              className="sr-only peer"
            />
            <div
              className={`w-4 h-4 rounded-full border-1 border-blue-700 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors duration-300`}
            ></div>
            <label
              htmlFor={value}
              className="cursor-pointer select-none text-nowrap"
            >
              For {value.charAt(0).toUpperCase() + value.slice(1)}
            </label>
            <div
              className={`absolute top-0 bottom-0 left-0 right-0 -z-10 translate-x-[100%] peer-checked:translate-x-[0%] transition-transform duration-300`}
              style={{
                background:
                  "linear-gradient(to right, transparent 30%, #c7ebf0)",
              }}
            ></div>
          </label>
        ))}
      </div>
    );
  } else if (Filter === "Size") {
    return (
      <div key={index}>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span className="text-nowrap">For men</span>
        </div>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span className="text-nowrap">For Women</span>
        </div>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span className="text-nowrap">For Kids</span>
        </div>
      </div>
    );
  } else if (Filter === "Price") {
    return (
      <div key={index}>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span className="text-nowrap">For men</span>
        </div>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span className="text-nowrap">For Women</span>
        </div>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span className="text-nowrap">For Kids</span>
        </div>
      </div>
    );
  } else if (Filter === "Color") {
    return (
      <div key={index}>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span className="text-nowrap">For men</span>
        </div>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span className="text-nowrap">For Women</span>
        </div>
        <div className="flex gap-2">
          <input type="checkbox" />
          <span className="text-nowrap">For Kids</span>
        </div>
      </div>
    );
  }
}
