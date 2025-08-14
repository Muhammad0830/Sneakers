"use client";

import FilterPopOver from "@/components/filterPopOver";
import Button from "@/components/ui/Button";
import {
  MoreFiltersType,
  Filters,
  appliedFiltersType,
  Product,
} from "@/types/types";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";
import ProductCard from "@/components/ProductCard";

const moreFilters: MoreFiltersType[] = [
  { name: "Popular", isActive: false },
  { name: "Sale", isActive: false },
  { name: "Top", isActive: false },
  { name: "New", isActive: false },
];

const filters: MoreFiltersType[] = [
  {
    name: "Size",
    isActive: false,
  },
  {
    name: "Price",
    isActive: false,
  },
  {
    name: "Color",
    isActive: false,
  },
  {
    name: "Gender",
    isActive: false,
  },
];

const products: Product[] = [
  {
    id: 1,
    title: "Product 1",
    size: "XS, S, M, L, XL",
    price: "19.99",
    color: "white, black, red, lightblue, lightgreen",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 2,
    title: "Product 2",
    size: "S, M, L",
    price: "29.99",
    color: "black, red, lightblue",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 3,
    title: "Product 3",
    size: "M, L, XL",
    price: "39.99",
    color: "red, pink",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 4,
    title: "Product 4",
    size: "L, XL",
    price: "49.99",
    color: "lightblue, white, red",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 5,
    title: "Product 5",
    size: "L, XL",
    price: "59.99",
    color: "lightgreen, black, white",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 6,
    title: "Product 6",
    size: "XS, S, M, L",
    price: "19.99",
    color: "white, black, yellow",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 7,
    title: "Product 7",
    size: "S, M, L",
    price: "29.99",
    color: "black, lightgreen",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 8,
    title: "Product 8",
    size: "M, L",
    price: "39.99",
    color: "red, black",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 9,
    title: "Product 9",
    size: "XS, S, M, L",
    price: "19.99",
    color: "white, pink",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 10,
    title: "Product 10",
    size: "S, M, L, XL",
    price: "29.99",
    color: "black, red, pink, white, lightblue",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 11,
    title: "Product 11",
    size: "M, L, XL",
    price: "39.99",
    color: "Red, lightgreen, pink",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 12,
    title: "Product 12",
    size: "S, M, L, XL",
    price: "49.99",
    color: "Lightblue, white, black",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 13,
    title: "Product 13",
    size: "S, M, L, XL",
    price: "59.99",
    color: "LightGreen, black, red",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 14,
    title: "Product 14",
    size: "XS, S, M, L",
    price: "19.99",
    color: "White, black, pink",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 15,
    title: "Product 15",
    size: "S, M, L, XL",
    price: "29.99",
    color: "Black, lightblue, white",
    rate: 4.5,
    reviews: 10,
  },
  {
    id: 16,
    title: "Product 16",
    size: "M, L, XL",
    price: "39.99",
    color: "Red, lightblue, white, black",
    rate: 4.5,
    reviews: 10,
  },
];

const defaultValues: {
  Gender: string[];
  Size: string[];
  Price: string[];
  Color: string[];
} = {
  Gender: ["Men", "Women", "Kids"],
  Size: ["XS", "S", "M", "L", "XL"],
  Price: ["", ""],
  Color: ["White", "Black", "Red", "Lightblue", "Lightgreen", "Pink"],
};

export default function ShopClient() {
  const [selectedFilter, setSelectedFilter] = useState<Filters | null>(null);
  const [moreFilterOpen, setMoreFilterOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<string[]>([]);
  const [selectedPopUp, setSelectedPopUp] = useState<MoreFiltersType | null>(
    null
  );
  const [selectedValuesMap, setSelectedValuesMap] = useState<{
    [key: string]: string[];
  }>(defaultValues);
  const [appliedFilters, setAppliedFilters] = useState<appliedFiltersType[]>(
    []
  );
  const [specificFilters, setSpecificFilters] =
    useState<MoreFiltersType[]>(filters);

  const toggleFilter = (
    name: string,
    type: "apply" | "remove" | "update" | "none"
  ) => {
    const values = selectedValuesMap[name] || [];

    if (name === "All") {
      setSpecificFilters(filters);
      setActiveOrder([]);
      return;
    }

    if (type === "apply") {
      setAppliedFilters((prev) => [...prev, { name, selectedValues: values }]);
    } else if (type === "remove") {
      setAppliedFilters((prev) => prev.filter((f) => f.name !== name));
      if (
        name === "Size" ||
        name === "Color" ||
        name === "Price" ||
        name === "Gender"
      ) {
        setSelectedValuesMap((prev) => ({
          ...prev,
          [name]: defaultValues[name],
        }));
      }
    } else if (type === "update") {
      setAppliedFilters((prev) =>
        prev.map((f) =>
          f.name === name ? { ...f, selectedValues: values } : f
        )
      );
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

    setActiveOrder((prev) =>
      !isActive ? [...prev, name] : prev.filter((n) => n !== name)
    );
  };

  const activeFiltersInOrder = activeOrder.map((name) =>
    specificFilters.find((f) => f.name === name)
  );

  console.log("appliedFilters", appliedFilters);
  console.log("selectedFilter", selectedFilter);
  console.log("selectedValuesMap", selectedValuesMap);

  return (
    <div className="px-[60px] mt-4 flex flex-col">
      <div className="mb-2">pathname: Home/shop</div>

      {/* filtering */}
      <div className="flex z-50 flex-row items-center gap-10 justify-center self-center relative mb-16">
        <Button
          onClick={() => {
            toggleFilter("All", "none");
            setSelectedValuesMap(defaultValues);
            setAppliedFilters([]);
          }}
          className={`text-xl min-w-[6rem] border-[2px] ${
            specificFilters.some((f) => f.isActive) ? "" : "active"
          }`}
          variants="borderedWithShadow"
        >
          All
        </Button>
        {specificFilters
          ? specificFilters.map((filter: MoreFiltersType, index: number) => {
              const currentName = selectedPopUp?.name || "";
              const currentValues = selectedValuesMap[currentName] || [];

              const existing = appliedFilters.find(
                (f) => f.name === currentName
              );

              return (
                <div className="relative" key={index}>
                  <Button
                    onClick={() => {
                      if (selectedPopUp?.name === filter.name) {
                        setSelectedPopUp(null);
                      } else {
                        setSelectedPopUp(filter);
                      }
                    }}
                    className={`text-xl border-[2px] min-w-[6rem] z-20 ${
                      filter.isActive ? "active" : ""
                    }`}
                    variants="borderedWithShadow"
                  >
                    {filter.name}
                  </Button>

                  <div
                    className={`popup absolute border border-primary bg-white p-2 rounded-md z-10 left-[50%] translate-x-[-50%] flex justify-center ${
                      selectedPopUp?.name === filter.name
                        ? "active"
                        : "inactive"
                    }`}
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
                          className={`overflow-hidden rounded-sm flex justify-center border-blue-700 px-1.5 py-0.5 transition-colors duration-300 cursor-pointer text-white ${
                            !existing ||
                            !(
                              JSON.stringify(currentValues) ===
                              JSON.stringify(existing.selectedValues)
                            )
                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                          onClick={() => {
                            if (selectedPopUp?.name) {
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
                            }
                          }}
                        >
                          <span
                            className={`absolute transition-transform duration-300 ${
                              filter.isActive &&
                              appliedFilters.some(
                                (f) => f.name === selectedPopUp?.name
                              )
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
                                  (f) => f.name === selectedPopUp?.name
                                )?.selectedValues
                                ? "translate-x-0"
                                : filter.isActive &&
                                  selectedValuesMap[filter.name] !==
                                    appliedFilters.find(
                                      (f) => f.name === selectedPopUp?.name
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
                                  (f) => f.name === selectedPopUp?.name
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
                </div>
              );
            })
          : null}
        <div className="relative">
          <Button
            onClick={() => {
              setMoreFilterOpen((prev) => !prev);
              setSelectedPopUp(null);
            }}
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
              ? "right-[0] translate-y-[calc(100%+1rem)] translate-x-[2.5rem] duration-700"
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
                      setSelectedFilter({ ...moreFilter, isAsc: true });
                    } else if (
                      moreFilter.name == selectedFilter?.name &&
                      selectedFilter.isAsc
                    ) {
                      setSelectedFilter({ ...moreFilter, isAsc: false });
                    } else {
                      setSelectedFilter(null);
                    }
                  }}
                >
                  <span
                    className={`overflow-hidden text-center flex justify-center items-center gap-1 duration-500 font-bold ${
                      moreFilterOpen
                        ? "w-19 h-6 opacity-100"
                        : "w-0 h-0 opacity-0"
                    }`}
                    style={{
                      transitionProperty: "width, height, opacity",
                      transitionDelay: `${
                        (array.length - 1) * 75 - index * 75
                      }ms`,
                    }}
                  >
                    <div className="relative flex">
                      <span
                        className={`${
                          selectedFilter?.name === moreFilter.name
                            ? "-translate-x-[0.5rem]"
                            : "translate-x-0"
                        } transition-transform duration-200`}
                      >
                        {moreFilter.name}
                      </span>

                      <span
                        className={`absolute top-0 ${
                          moreFilter.name === selectedFilter?.name &&
                          selectedFilter?.isAsc
                            ? "translate-y-0"
                            : "translate-y-[100%]"
                        } bottom-0 -right-2 flex items-center transition-transform duration-300`}
                      >
                        ↑
                      </span>
                      <span
                        className={`absolute top-0 ${
                          moreFilter.name === selectedFilter?.name &&
                          !selectedFilter?.isAsc
                            ? "-translate-y-0"
                            : "-translate-y-[100%]"
                        } bottom-0 -right-2 flex items-center transition-transform duration-300`}
                      >
                        ↓
                      </span>
                    </div>
                  </span>
                </Button>
              );
            }
          )}
        </div>

        <div
          className={`absolute border border-transparent bottom-[0%] ${
            moreFilterOpen ? "-left-[2.5rem]" : "-left-0"
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
                  onClick={() => {
                    setSelectedFilter(null);
                  }}
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
                  onClick={() => {
                    toggleFilter("All", "none");
                    setSelectedValuesMap(defaultValues);
                    setAppliedFilters([]);
                  }}
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

      {/* product cards */}
      <div className="grid grid-cols-4 gap-8 my-16">
        {products.map((product: Product) => {
          return <ProductCard product={product} key={product.id} />;
        })}
      </div>
    </div>
  );
}
