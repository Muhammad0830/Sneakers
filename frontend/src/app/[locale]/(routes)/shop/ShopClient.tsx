"use client";

import FilterPopOver from "@/components/filterPopOver";
import Button from "@/components/ui/Button";
import {
  MoreFiltersType,
  Filters,
  appliedFiltersType,
  Product,
} from "@/types/types";
import { ChevronDown, ChevronRight, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import useApiQuery from "@/hooks/useApiQuery";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

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

interface ProductsDataProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Product[];
}

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
  const [sortingDialogOpen, setSortingDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading, error, refetch } = useApiQuery<ProductsDataProps>(
    `/?page=${page}&limit=${limit}`,
    ["Sneakers", page, limit]
  );

  const {
    data: products,
    totalPages,
    total,
  } = data ?? { data: [], totalPages: 0, total: 0 };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (isLoading) return <div>Loading...</div>;

  if (error) {
    console.error("error", error);
  }

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

  return (
    <div className="px-[60px] mt-4 flex flex-col">
      <div className="mb-2">pathname: Home/shop</div>

      {/* filtering */}
      <div className="flex z-40 flex-row items-center lg:gap-12.5 md:gap-6 justify-between self-center relative mb-16 lg:w-auto w-full">
        <Button
          onClick={() => {
            toggleFilter("All", "none");
            setSelectedValuesMap(defaultValues);
            setAppliedFilters([]);
          }}
          className={`text-xl lg:min-w-[6rem] min-w-[4rem] border-[2px] ${
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
                    className={`text-xl border-[2px] lg:min-w-[6rem] min-w-[4rem] z-20 ${
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
            className="text-xl border-[2px] flex items-center gap-4 lg:px-8"
          >
            <span>Sorts</span>
            <ChevronDown
              size={28}
              color="white"
              className={`rotate-0 lg:block hidden transition-transform duration-500 ease-in-out`}
              style={{
                animationDelay: `${moreFilterOpen ? "0" : "2000ms"}`,
                animationName: `${moreFilterOpen ? "" : "bounceAnim2"}`,
                animationIterationCount: "infinite",
                animationDuration: `${moreFilterOpen ? "" : "4.2s"}`,
              }}
            />
          </Button>
          <button
            onClick={() => setSortingDialogOpen(true)}
            className="absolute inset-0 transparent z-20 lg:hidden "
          ></button>
        </div>

        <div
          className={`absolute lg:flex hidden bottom-[0%] transition-all ${
            moreFilterOpen
              ? "right-[0] translate-y-[calc(100%+1rem)] translate-x-[1.5rem] duration-700"
              : "right-[0] translate-y-[calc(100%)] -translate-x-[25%] duration-1000"
          } top-[0%] justify-center items-center gap-2`}
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
            moreFilterOpen ? "-left-[1.5rem]" : "-left-0"
          } translate-y-[calc(100%+1rem+2px)] flex gap-2 items-center lg:justify-start justify-between w-full`}
          style={{
            transitionProperty: "left",
            transitionDuration: "0.7s",
          }}
        >
          <div className="border-[1px] border-primary py-2 px-2 rounded-md flex items-center gap-1">
            <span className="pointer-events-none">Filter by: </span>
            {specificFilters.some((f) => f.isActive) ? (
              <span className="flex items-center gap-1 flex-row ">
                {activeFiltersInOrder.filter(Boolean).map((filter, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-800 pointer-events-none"
                  >
                    <span className="text-primary bg-varWhite px-1 py-0.5 rounded-sm">
                      {filter!.name}
                    </span>
                    <span className="text-gray-500">
                      {index < activeFiltersInOrder.length - 1 && " / "}
                    </span>
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
              <span className="text-primary text-sm bg-varWhite px-1 py-0.5 rounded-sm pointer-events-none">
                All
              </span>
            )}
          </div>
          <div className="border-[1px] border-primary py-2 px-2 rounded-md flex items-center gap-1">
            <span className="pointer-events-none">Sort By: </span>
            {selectedFilter ? (
              <div className="flex items-center gap-2">
                <span className="text-primary h-6 text-sm bg-varWhite px-1 py-0.5 rounded-sm pointer-events-none">
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
              <span className="text-primary h-6 text-sm bg-varWhite px-1 py-0.5 rounded-sm pointer-events-none">
                None
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center w-full translate-y-4">
        <div className="text-md text-white font-semibold bg-primary dark:bg-transparent border-1 border-transparent dark:border-primary rounded-sm px-1">
          Visible products: From {(page - 1) * limit + 1} to{" "}
          {page === totalPages ? total : page * limit}
        </div>
        <div className="text-md text-white font-semibold bg-primary dark:bg-transparent border-1 border-transparent dark:border-primary rounded-sm px-1">
          Total: {total} products available!
        </div>
      </div>

      {/* product cards */}
      <div className="grid grid-cols-4 gap-8 mt-16 mb-4">
        {products?.map((product: Product) => {
          return <ProductCard product={product} key={product.id} />;
        })}
      </div>

      {/* pagination buttons */}
      <div className="flex justify-between gap-5 mb-8 items-center">
        <Button
          isLinkButton
          variants="borderedWithShadow"
          className="flex border border-primary items-center justify-between gap-2 "
        >
          <ShoppingCart size={20} color="var(--primary)" />
          <span>Go to the Cart</span>
          <ChevronRight size={20} color="var(--primary)" />
        </Button>

        <div className="flex items-center gap-2">
          <Button
            isHoverable={page > 1}
            isCursorPointer={page > 1}
            onClick={() => {
              setPage(page > 1 ? page - 1 : page);
              refetch();
            }}
            className={`h-10 ${page > 1 ? "" : "bg-primary/50"}`}
          >
            Previous
          </Button>
          {page === 1 ? null : (
            <Button
              variants="borderedWithShadow"
              onClick={() => {
                setPage(1);
                refetch();
              }}
              className={`border border-primary w-10 h-10 flex justify-center items-center`}
            >
              1
            </Button>
          )}
          <Button
            variants="border"
            disabled
            isCursorPointer={false}
            className="border border-primary w-10 h-10 flex justify-center items-center"
          >
            {page}
          </Button>
          {page === totalPages ? null : (
            <Button
              onClick={() => {
                setPage(totalPages || 1);
                refetch();
              }}
              variants="borderedWithShadow"
              className={`border border-primary w-10 h-10 flex justify-center items-center`}
            >
              {totalPages}
            </Button>
          )}
          <Button
            isHoverable={page < totalPages}
            variants="outlined"
            isCursorPointer={page < totalPages}
            onClick={() => {
              setPage(page < totalPages ? page + 1 : page);
              refetch();
            }}
            className={`h-10 ${page < totalPages ? "" : "bg-primary/50"}`}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Sorting Dialog for mobile and desktop */}
      <Dialog open={sortingDialogOpen} onOpenChange={setSortingDialogOpen}>
        <DialogContent className="bg-white dark:bg-black sm:min-w-[350px] min-w-[250px] w-[50vw] px-4 py-3 rounded-md">
          <DialogTitle className="text-xl">Sorts</DialogTitle>
          <div className="grid grid-cols-2 gap-2">
            {moreFilters.map((moreFilter: MoreFiltersType, index: number) => {
              return (
                <Button
                  key={index}
                  custom
                  wrapperClassName="open wrapperFilter"
                  className={`radiusAnimation open py-2 overflow-hidden flex justify-center items-center border-[2px] transition-all duration-500 ${
                    moreFilter.name === selectedFilter?.name
                      ? "bg-primary"
                      : "bg-transparent"
                  }`}
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
                    className={`overflow-hidden text-center sm:text-sm text-xs flex justify-center items-center gap-1 duration-500 font-bold w-19 h-6 opacity-100`}
                  >
                    <div className="relative flex text-black dark:text-white">
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
                            : "translate-y-[140%]"
                        } bottom-0 -right-2 flex items-center transition-transform duration-300`}
                      >
                        ↑
                      </span>
                      <span
                        className={`absolute top-0 ${
                          moreFilter.name === selectedFilter?.name &&
                          !selectedFilter?.isAsc
                            ? "-translate-y-0"
                            : "-translate-y-[140%]"
                        } bottom-0 -right-2 flex items-center transition-transform duration-300`}
                      >
                        ↓
                      </span>
                    </div>
                  </span>
                </Button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
