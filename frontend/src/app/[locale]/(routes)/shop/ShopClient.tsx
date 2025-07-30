"use client";

import Button from "@/components/ui/Button";
import { FilterType } from "@/types/types";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function ShopClient() {
  const filters: FilterType[] = [
    { name: "All" },
    { name: "Popular" },
    { name: "On Sale" },
    { name: "Top Rated" },
    { name: "Color" },
    { name: "New Arrivals" },
  ];
  const moreFilters: FilterType[] = [
    { name: "Gender" },
    { name: "Size" },
    { name: "Price" },
  ];

  const [selectedFilter, setSelectedFilter] = useState<FilterType | null>(
    filters[0]
  );
  const [moreFilterOpen, setMoreFilterOpen] = useState(false);
  const [selectedMoreFilter, setSelectedMoreFilter] =
    useState<FilterType | null>(null);

  return (
    <div className="px-[60px] mt-4 flex flex-col">
      <div className="mb-2">pathname: Home/shop</div>
      <div className="flex flex-row items-center gap-4 justify-center self-center">
        {filters
          ? filters.map((filter: FilterType, index: number) => {
              return (
                <Button
                  onClick={() => {
                    if (filter.name !== selectedFilter?.name) {
                      setSelectedFilter(filter);
                    } else {
                      setSelectedFilter(filters[0]);
                    }
                  }}
                  className={`text-xl border-[2px] ${
                    filter.name === selectedFilter?.name ? "active" : ""
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

          <div
            className={`absolute bottom-[0%] w-[19rem] top-[0%] right-[50%] translate-x-[50%] translate-y-[calc(100%+1rem)] flex justify-center items-center gap-2`}
          >
            {moreFilters.map(
              (moreFilter: FilterType, index: number, array: FilterType[]) => {
                return (
                  <Button
                    key={index}
                    disabled={moreFilterOpen ? false : true}
                    variants="borderedWithShadow"
                    custom
                    wrapperClassName={`${moreFilterOpen ? "open wrapperFilter" : "notOpen wrapperFilter"}`}
                    className={`radiusAnimation ${
                      moreFilterOpen ? "open" : "notOpen"
                    } py-2 overflow-hidden flex justify-center items-center border-[2px] transition-all duration-500 ${
                      moreFilter.name === selectedMoreFilter?.name
                        ? "active"
                        : "inactive"
                    }`}
                    style={{
                      animationDelay: `${2000 + index * 75}ms`,
                      animationName: `${moreFilterOpen ? "" : "bounceAnim"}`,
                    }}
                    onClick={() => setSelectedMoreFilter(moreFilter)}
                  >
                    <span
                      className={`overflow-hidden text-center inline-block duration-500 font-bold ${
                        moreFilterOpen
                          ? "w-16 h-6 opacity-100"
                          : "w-0 h-0 opacity-0"
                      }`}
                      style={{
                        transitionProperty: "width, height, opacity",
                        transitionDelay: `${(array.length - 1) * 75 - index * 75}ms`,
                      }}
                    >
                      {moreFilter.name}
                    </span>
                  </Button>
                );
              }
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
