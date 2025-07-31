"use client";

import Button from "@/components/ui/Button";
import { MoreFiltersType } from "@/types/types";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

const filters: MoreFiltersType[] = [
  { name: "Size", isActive: false },
  { name: "Price", isActive: false },
  { name: "Color", isActive: false },
  { name: "Gender", isActive: false },
];

const moreFilters: MoreFiltersType[] = [
  { name: "Popular", isActive: false },
  { name: "Sale", isActive: false },
  { name: "Top", isActive: false },
  { name: "New", isActive: false },
];

export default function ShopClient() {
  const [selectedFilter, setSelectedFilter] = useState<MoreFiltersType | null>(
    null
  );
  const [moreFilterOpen, setMoreFilterOpen] = useState(false);
  const [specificFilters, setSpecificFilters] =
    useState<MoreFiltersType[]>(filters);
  const [activeOrder, setActiveOrder] = useState<string[]>([]);

  const toggleFilter = (name: string) => {
    if (name === "All") {
      setSpecificFilters(filters);
      setActiveOrder([]);
      return;
    }

    const isActive = specificFilters.find((f) => f.name === name)?.isActive;

    setSpecificFilters((prev) =>
      prev.map((filter) =>
        filter.name === name
          ? { ...filter, isActive: !filter.isActive }
          : filter
      )
    );

    setActiveOrder((prev) => {
      if (!isActive) {
        return [...prev, name]; // add to end if activating
      } else {
        return prev.filter((n) => n !== name); // remove if deactivating
      }
    });
  };

  const activeFiltersInOrder = activeOrder.map((name) =>
    specificFilters.find((f) => f.name === name)
  );

  return (
    <div className="px-[60px] mt-4 flex flex-col">
      <div className="mb-2">pathname: Home/shop</div>
      <div className="flex flex-row items-center gap-10 justify-center self-center relative ">
        <Button
          onClick={() => {
            toggleFilter("All");
          }}
          className={`text-xl border-[2px] ${
            specificFilters.some((f) => f.isActive) ? "" : "active"
          }`}
          variants="borderedWithShadow"
        >
          All
        </Button>
        {specificFilters
          ? specificFilters.map((filter: MoreFiltersType, index: number) => {
              return (
                <Button
                  onClick={() => {
                    toggleFilter(filter.name);
                  }}
                  className={`text-xl border-[2px] ${
                    filter.isActive ? "active" : ""
                  }`}
                  variants="borderedWithShadow"
                  key={index}
                >
                  {filter.name}
                </Button>
              );
            })
          : null}
        <div className="relative">
          <Button
            onClick={() => setMoreFilterOpen((prev) => !prev)}
            className="text-xl border-[2px] flex items-center gap-4 px-8"
          >
            <span>More Filters </span>
            <ChevronDown
              size={28}
              color="white"
              className={`rotate-0 transition-transform duration-500 ease-in-out`}
              style={{
                animationDelay: `${moreFilterOpen ? "0" : "2000ms"}`,
                animationName: `${moreFilterOpen ? "" : "bounceAnim2"}`,
                animationIterationCount: "infinite",
                animationDuration: `${moreFilterOpen ? "" : "4.2s"}`,
              }}
            />
          </Button>
        </div>

        <div
          className={`absolute bottom-[0%] transition-all ${
            moreFilterOpen
              ? "right-[0] translate-y-[calc(100%+1rem)] translate-x-[3.5rem] duration-700"
              : "right-[0%] translate-y-[calc(100%)] -translate-x-[50%] duration-1000"
          } top-[0%] flex justify-center items-center gap-2`}
        >
          {moreFilters.map(
            (
              moreFilter: MoreFiltersType,
              index: number,
              array: MoreFiltersType[]
            ) => {
              return (
                <Button
                  key={index}
                  disabled={moreFilterOpen ? false : true}
                  variants="borderedWithShadow"
                  custom
                  wrapperClassName={`${
                    moreFilterOpen
                      ? "open wrapperFilter"
                      : "notOpen wrapperFilter"
                  }`}
                  className={`radiusAnimation ${
                    moreFilterOpen ? "open" : "notOpen"
                  } py-2 overflow-hidden flex justify-center items-center border-[2px] transition-all duration-500 ${
                    moreFilter.name === selectedFilter?.name
                      ? "active"
                      : "inactive"
                  }`}
                  style={{
                    animationDelay: `${2000 + index * 75}ms`,
                    animationName: `${moreFilterOpen ? "" : "bounceAnim"}`,
                  }}
                  onClick={() => {
                    if (moreFilter.name !== selectedFilter?.name) {
                      setSelectedFilter(moreFilter);
                    } else {
                      setSelectedFilter(null);
                    }
                  }}
                >
                  <span
                    className={`overflow-hidden text-center inline-block duration-500 font-bold ${
                      moreFilterOpen
                        ? "w-16 h-6 opacity-100"
                        : "w-0 h-0 opacity-0"
                    }`}
                    style={{
                      transitionProperty: "width, height, opacity",
                      transitionDelay: `${
                        (array.length - 1) * 75 - index * 75
                      }ms`,
                    }}
                  >
                    {moreFilter.name}
                  </span>
                </Button>
              );
            }
          )}
        </div>

        <div
          className={`absolute border border-transparent bottom-[0%] ${
            moreFilterOpen ? "-left-[3.5rem]" : "-left-0"
          } translate-y-[calc(100%+1rem+2px)] flex gap-4 items-center`}
          style={{
            transitionProperty: "left",
            transitionDuration: "0.7s",
          }}
        >
          <div className="border-[1px] border-primary py-2 px-2 rounded-md flex items-center gap-1">
            <span className="pointer-events-none">Sort By: </span>
            {selectedFilter ? (
              <div className="flex items-center gap-2">
                <span className="text-primary h-6 text-sm bg-white px-1 py-0.5 rounded-sm pointer-events-none">
                  {selectedFilter?.name}
                </span>
                <button
                  onClick={() => setSelectedFilter(null)}
                  className="bg-red-500 rounded-full w-5 h-5 cursor-pointer flex justify-center items-center rotatet-0 hover:rotate-90 ease-in-out transition-transform duration-200"
                >
                  <X size={16} color="white" />
                </button>
              </div>
            ) : (
              <span className="text-primary h-6 text-sm bg-white px-1 py-0.5 rounded-sm pointer-events-none">
                None
              </span>
            )}
          </div>
          <div className="border-[1px] border-primary py-2 px-2 rounded-md flex items-center gap-1">
            <span className="pointer-events-none">Filter by: </span>
            {specificFilters.some((f) => f.isActive) ? (
              <span className="flex items-center gap-2 flex-row ">
                {activeFiltersInOrder.filter(Boolean).map((filter, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-800 pointer-events-none"
                  >
                    <span className="text-primary bg-white px-1 py-0.5 rounded-sm">
                      {filter!.name}
                    </span>
                    {index < activeFiltersInOrder.length - 1 && " / "}
                  </span>
                ))}
                <button
                  onClick={() => toggleFilter("All")}
                  className="bg-red-500 rounded-full w-5 h-5 cursor-pointer flex justify-center items-center rotatet-0 hover:rotate-90 ease-in-out transition-transform duration-200"
                >
                  <X size={16} color="white" />
                </button>
              </span>
            ) : (
              <span className="text-primary text-sm bg-white px-1 py-0.5 rounded-sm pointer-events-none">
                All
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
