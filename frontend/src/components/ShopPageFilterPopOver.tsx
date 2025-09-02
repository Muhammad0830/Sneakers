import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import FilterPopOver from "./filterPopOver";
import { appliedFiltersType, MoreFiltersType } from "@/types/types";

interface Props {
  selectedPopUp: MoreFiltersType | null;
  filter: MoreFiltersType;
  index: number;
  selectedValuesMap: {
    [key: string]: string[];
  };
  setSelectedValuesMap: Dispatch<SetStateAction<{ [key: string]: string[] }>>;
  setSelectedPopUp: Dispatch<SetStateAction<MoreFiltersType | null>>;
  existing: appliedFiltersType | undefined;
  currentName: string;
  currentValues: string[];
  toggleFilter: (
    name: string,
    type: "apply" | "remove" | "update" | "none"
  ) => void;
  defaultValues: {
    Gender: string[];
    Size: string[];
    Price: string[];
    Color: string[];
  };
  appliedFilters: appliedFiltersType[];
  showToast: {
    (
      type: "warning" | "success" | "error" | "info",
      title: string,
      message: string
    ): void;
    (type: "loading", message: string): void;
  };
  hasChanges: (
    defaultValues: {
      Gender: string[];
      Size: string[];
      Price: string[];
      Color: string[];
    },
    selectedValuesMap: { [key: string]: string[] },
    currentName: "Gender" | "Size" | "Price" | "Color"
  ) => boolean;
  arraysHaveSameValues: (
    a: string[] | appliedFiltersType[] | undefined,
    b: string[] | appliedFiltersType[] | undefined
  ) => boolean | undefined;
}

const ShopPageFilterPopOver = ({
  selectedPopUp,
  filter,
  index,
  selectedValuesMap,
  setSelectedValuesMap,
  setSelectedPopUp,
  existing,
  currentName,
  currentValues,
  toggleFilter,
  defaultValues,
  appliedFilters,
  showToast,
  hasChanges,
  arraysHaveSameValues,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedPopUp(null);
      }
    }

    if (selectedPopUp) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedPopUp]);

  return (
    <div
      className={`popup absolute border border-primary bg-white dark:bg-black p-2 rounded-md z-10 left-[50%] translate-x-[-50%] flex justify-center ${
        selectedPopUp?.name === filter.name ? "active" : "inactive"
      }`}
      ref={containerRef}
    >
      <div className="flex flex-col gap-2 relative overflow-hidden">
        <FilterPopOver
          Filter={filter.name}
          index={index}
          selectedValues={selectedValuesMap[filter.name] || []}
          setSelectedValues={(newValues: string[]) => {
            setSelectedValuesMap((prev) => ({
              ...prev,
              [filter.name]: newValues,
            }));
          }}
        />
        <div className="flex items-center gap-2 justify-between">
          <button
            onClick={() => {
              setSelectedPopUp(null);
            }}
            className="z-10 bg-primary rounded-sm border-blue-700 px-3 py-0.5 cursor-pointer text-white"
          >
            Close
          </button>
          <button
            className={`overflow-hidden relative rounded-sm flex justify-center border-blue-700 px-1.5 py-0.5 transition-colors duration-300 cursor-pointer text-white ${
              !existing ||
              !(
                JSON.stringify(currentValues) ===
                JSON.stringify(existing.selectedValues)
              )
                ? "bg-blue-500"
                : "bg-red-500"
            }`}
            onClick={() => {
              if (
                (currentName === "Size" ||
                  currentName === "Color" ||
                  currentName === "Price" ||
                  currentName === "Gender") &&
                hasChanges(defaultValues, selectedValuesMap, currentName) ===
                  false &&
                filter.isActive
              ) {
                toggleFilter(currentName, "remove");
              } else if (
                (currentName === "Size" ||
                  currentName === "Color" ||
                  currentName === "Price" ||
                  currentName === "Gender") &&
                hasChanges(defaultValues, selectedValuesMap, currentName) ===
                  false
              ) {
                showToast(
                  "warning",
                  "Warning",
                  "Please make at least one change"
                );
              } else if (selectedPopUp?.name) {
                if (currentValues.length === 0) {
                  showToast(
                    "warning",
                    "Warning",
                    "Please select at least one value"
                  );
                  return;
                }

                if (!existing) {
                  toggleFilter(currentName, "apply");
                } else if (
                  JSON.stringify(currentValues) ===
                  JSON.stringify(existing.selectedValues)
                ) {
                  toggleFilter(currentName, "remove");
                } else {
                  toggleFilter(currentName, "update");
                }
              }
            }}
          >
            <span
              className={`absolute transition-transform duration-300 ${
                filter.isActive &&
                appliedFilters.some((f) => f.name === selectedPopUp?.name)
                  ? "translate-x-[300%]"
                  : "translate-x-0"
              }`}
            >
              Apply
            </span>
            <span
              className={`absolute transition-transform duration-300 ${
                filter.isActive &&
                arraysHaveSameValues(
                  selectedValuesMap[filter.name],
                  appliedFilters.find((f) => f.name === selectedPopUp?.name)
                    ?.selectedValues
                )
                  ? "translate-x-0"
                  : filter.isActive &&
                    selectedValuesMap[filter.name] !==
                      appliedFilters.find((f) => f.name === selectedPopUp?.name)
                        ?.selectedValues
                  ? "translate-x-[300%]"
                  : "-translate-x-[300%]"
              }`}
            >
              Cancel
            </span>
            <span
              className={`relative transition-transform duration-300 ${
                filter.isActive &&
                !arraysHaveSameValues(
                  selectedValuesMap[filter.name],
                  appliedFilters.find((f) => f.name === selectedPopUp?.name)
                    ?.selectedValues
                )
                  ? "translate-x-0"
                  : "-translate-x-[300%]"
              }`}
            >
              Update
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopPageFilterPopOver;
