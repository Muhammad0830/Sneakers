"use client";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { appliedFiltersType, Filters, MoreFiltersType } from "@/types/types";
import FilterPopOver from "./filterPopOver";
import { RotateCcw } from "lucide-react";
import SimpleButton from "./ui/SimpleButton";

type SelectedValuesMap = { [key: string]: string[] };

interface Props {
  specificFilters: MoreFiltersType[];
  appliedFilters: appliedFiltersType[];
  toggleFilter: (
    name: string,
    type: "apply" | "remove" | "update" | "none"
  ) => void;
  defaultValues: SelectedValuesMap;
  selectedValuesMap: SelectedValuesMap;
  setSelectedValuesMap: React.Dispatch<React.SetStateAction<SelectedValuesMap>>;
  setAppliedFilters: (newFilters: appliedFiltersType[]) => void;
  moreFilters: MoreFiltersType[];
  selectedFilter: Filters | null;
  setSelectedFilter: (newFilter: Filters | null) => void;
}

export default function MobileFilterSort({
  specificFilters,
  appliedFilters,
  toggleFilter,
  defaultValues,
  selectedValuesMap,
  setSelectedValuesMap,
  setAppliedFilters,
  moreFilters,
  selectedFilter,
  setSelectedFilter,
}: Props) {
  const [activeTab, setActiveTab] = useState<"filter" | "sort">("filter");

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Tabs */}
      <div className="flex w-full border-gray-700">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "filter"
              ? "bg-primary text-white"
              : "bg-gray-400 dark:bg-gray-800"
          }`}
          onClick={() => setActiveTab("filter")}
        >
          Filters
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === "sort"
              ? "bg-primary text-white"
              : "bg-gray-400 dark:bg-gray-800"
          }`}
          onClick={() => setActiveTab("sort")}
        >
          Sort
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "filter" ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 jube">
              <div>Reset all filters?</div>
              <SimpleButton
                onClick={() => {
                  toggleFilter("All", "none");
                  setSelectedValuesMap(defaultValues);
                  setAppliedFilters([]);
                }}
                className={`bg-primary px-1.5 py-1.5 border ${
                  specificFilters.some((f: MoreFiltersType) => f.isActive)
                    ? ""
                    : "active"
                }`}
              >
                <RotateCcw size={20} color="white" />
              </SimpleButton>
            </div>

            {/* Individual Filters */}
            {specificFilters?.map((filter: MoreFiltersType, index: number) => {
              const currentName = filter?.name || "";
              const currentValues = selectedValuesMap[currentName] || [];

              const existing = appliedFilters.find(
                (f) => f.name === currentName
              );
              return (
                <div
                  key={index}
                  className="border p-2 rounded-md flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{filter.name}</span>
                    {filter.isActive && (
                      <button
                        onClick={() => {
                          toggleFilter(filter.name, "remove");
                        }}
                        className="text-red-500 text-xs"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Example: plug in your <FilterPopOver /> here */}
                  <div className="bg-gray-200 p-2 rounded-md text-xs text-gray-800 overflow-hidden">
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
                    <div className="flex items-center gap-2 justify-end overflow-hidden mt-2 ">
                      <button
                        className={`overflow-hidden relative rounded-sm flex justify-center border-blue-700 px-3 py-1.5 transition-colors duration-300 cursor-pointer text-white ${
                          !existing ||
                          !(
                            JSON.stringify(currentValues) ===
                            JSON.stringify(existing.selectedValues)
                          )
                            ? "bg-blue-500"
                            : "bg-red-500"
                        }`}
                        onClick={() => {
                          if (currentValues.length === 0) {
                            alert("Please select at least one value");
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
                        }}
                      >
                        <span
                          className={`absolute transition-transform duration-300 ${
                            filter.isActive &&
                            appliedFilters.some((f) => f.name === filter?.name)
                              ? "translate-x-[300%]"
                              : "translate-x-0"
                          }`}
                        >
                          Apply
                        </span>
                        <span
                          className={`absolute transition-transform duration-300 ${
                            filter.isActive &&
                            selectedValuesMap[filter.name] ===
                              appliedFilters.find(
                                (f) => f.name === filter?.name
                              )?.selectedValues
                              ? "translate-x-0"
                              : filter.isActive &&
                                selectedValuesMap[filter.name] !==
                                  appliedFilters.find(
                                    (f) => f.name === filter?.name
                                  )?.selectedValues
                              ? "translate-x-[300%]"
                              : "-translate-x-[300%]"
                          }`}
                        >
                          Cancel
                        </span>
                        <span
                          className={`relative transition-transform duration-300 ${
                            filter.isActive &&
                            selectedValuesMap[filter.name] !==
                              appliedFilters.find(
                                (f) => f.name === filter?.name
                              )?.selectedValues
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
            })}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {moreFilters.map((moreFilter: MoreFiltersType, index: number) => (
              <Button
                key={index}
                onClick={() => {
                  if (moreFilter.name !== selectedFilter?.name) {
                    setSelectedFilter({
                      ...moreFilter,
                      isAsc: false,
                      isActive: true,
                    });
                  } else if (
                    moreFilter.name == selectedFilter?.name &&
                    !selectedFilter.isAsc
                  ) {
                    setSelectedFilter({
                      ...moreFilter,
                      isAsc: true,
                      isActive: true,
                    });
                  } else {
                    setSelectedFilter(null);
                  }
                }}
                className={`flex relative overflow-hidden justify-between items-center py-2 px-3 border rounded-md transition-colors duration-300 ${
                  moreFilter.name === selectedFilter?.name
                    ? "active bg-primary"
                    : "bg-transparent"
                }`}
              >
                <span
                  className={`${
                    selectedFilter?.name === moreFilter.name
                      ? "translate-x-[0.5rem]"
                      : "translate-x-0"
                  } transition-transform duration-200 ${
                    moreFilter.name === selectedFilter?.name
                      ? "text-white"
                      : "text-black"
                  } dark:text-white`}
                >
                  {moreFilter.name}
                </span>
                <span
                  className={`absolute top-0 ${
                    moreFilter.name === selectedFilter?.name &&
                    selectedFilter?.isAsc
                      ? "translate-y-0"
                      : "translate-y-[100%]"
                  } bottom-0 right-4 flex items-center transition-transform duration-300 text-white`}
                >
                  ↑
                </span>
                <span
                  className={`absolute top-0 ${
                    moreFilter.name === selectedFilter?.name &&
                    !selectedFilter?.isAsc
                      ? "-translate-y-0"
                      : "-translate-y-[100%]"
                  } bottom-0 right-4 flex items-center transition-transform duration-300 text-white`}
                >
                  ↓
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
