"use client";

import Button from "@/components/ui/Button";
import {
  MoreFiltersType,
  Filters,
  appliedFiltersType,
  Product,
} from "@/types/types";
import {
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import useApiQuery from "@/hooks/useApiQuery";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MobileFilterSort from "@/components/MobileFilterComponent";
import localData from "@/data_frontend/data.json";
import { useCustomToast } from "@/context/CustomToastContext";
import { useTranslations } from "next-intl";
import ShopPageFilterPopOver from "@/components/ShopPageFilterPopOver";
import {
  SkeletonProducts,
  SkeletonPagination,
} from "@/components/SkeletonShopPage";

function hasChanges(
  defaultValues: {
    Gender: string[];
    Size: string[];
    Price: string[];
    Color: string[];
  },
  selectedValuesMap: {
    [key: string]: string[];
  },
  currentName: "Gender" | "Size" | "Price" | "Color"
) {
  if (
    arraysHaveSameValues(
      defaultValues[currentName],
      selectedValuesMap[currentName]
    )
  )
    return false;

  return true;
}

function arraysHaveSameValues(
  a: string[] | appliedFiltersType[] | undefined,
  b: string[] | appliedFiltersType[] | undefined
) {
  if (a?.length !== b?.length) return false;
  if (a && b) {
    return [...a].sort().every((val, i) => val === [...b].sort()[i]);
  }
}

function buildQueryString(
  filters: appliedFiltersType[], //Record<string, string[]>,
  page: number,
  limit: number,
  sort?: { name: string; isActive: boolean; isAsc: boolean }
) {
  const newParams = new URLSearchParams();

  newParams.set("page", String(page));
  newParams.set("limit", String(limit));

  filters.forEach((filter: appliedFiltersType) => {
    if (filter.name === "Price") {
      newParams.set("minPrice", String(filter.selectedValues[0]));
      newParams.set("maxPrice", String(filter.selectedValues[1]));
    } else {
      filter.selectedValues.forEach((v) => {
        newParams.append(filter.name.toLowerCase(), String(v));
      });
    }
  });

  if (sort?.isActive) {
    newParams.set("sortBy", sort.name.toLowerCase());
    newParams.set("order", sort.isAsc ? "asc" : "desc");
  }

  return newParams.toString();
}

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
  const { showToast, showLoadingToast, hideLoadingToast } = useCustomToast();
  const hasShownDummyInfo = useRef(false);

  useEffect(() => {
    setPage(1);
  }, [appliedFilters, selectedFilter]);

  const queryString = buildQueryString(
    appliedFilters,
    page,
    limit,
    selectedFilter || undefined
  );

  const { data, isLoading, refetch } = useApiQuery<ProductsDataProps>(
    `/?${queryString}`,
    ["Sneakers", page, limit, queryString]
  );

  const t = useTranslations("Shop");

  useEffect(() => {
    if (isLoading) {
      showLoadingToast(t("Loading the data"));
    } else {
      setTimeout(() => hideLoadingToast(), 1000);
    }
  }, [isLoading]); // eslint-disable-line

  // dummt data working toast
  useEffect(() => {
    if (!isLoading && !data && !hasShownDummyInfo.current) {
      showToast("info", t("Info"), t("Dummy data working"));
      hasShownDummyInfo.current = true; // prevent duplicates
    }
  }, [showToast, t, data, isLoading]);

  const localDataProducts: Product[] = localData.products;
  const localtotal = localDataProducts.length;
  const localTotalPages = Math.ceil(localtotal / limit);

  const {
    data: products,
    totalPages,
    total,
  } = data || {
    data: localDataProducts,
    totalPages: localTotalPages,
    total: localtotal,
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

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
    <div className="lg:px-[60px] md:px-[40px] sm:px-[30px] px-[20px] mt-4 flex flex-col">
      <div className="mb-2">pathname: Home/shop</div>

      {/* filtering */}
      <div className="z-40 flex-row sm:flex hidden items-center lg:gap-12.5 md:gap-6 justify-between self-center relative mb-16 lg:w-auto w-full">
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
                <div className="relative z-40" key={index}>
                  <ShopPageFilterPopOver
                    selectedPopUp={selectedPopUp}
                    filter={filter}
                    index={index}
                    selectedValuesMap={selectedValuesMap}
                    setSelectedValuesMap={setSelectedValuesMap}
                    setSelectedPopUp={setSelectedPopUp}
                    existing={existing}
                    currentName={currentName}
                    currentValues={currentValues}
                    toggleFilter={toggleFilter}
                    defaultValues={defaultValues}
                    appliedFilters={appliedFilters}
                    showToast={showToast}
                    hasChanges={hasChanges}
                    arraysHaveSameValues={arraysHaveSameValues}
                  />
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
          className={`absolute lg:flex hidden bottom-[0%] z-30 transition-all ${
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
                      setSelectedFilter({
                        ...moreFilter,
                        isAsc: true,
                        isActive: true,
                      });
                    } else if (
                      moreFilter.name == selectedFilter?.name &&
                      selectedFilter.isAsc
                    ) {
                      setSelectedFilter({
                        ...moreFilter,
                        isAsc: false,
                        isActive: true,
                      });
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
          className={`absolute border border-transparent bottom-[0%] z-0 ${
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

      {/* mobile filtering */}
      <div className="flex sm:hidden flex-row w-full justify-between gap-2 items-center">
        <div className="flex-1 relative border border-primary rounded-sm h-8 overflow-hidden">
          <input
            className="h-full w-full px-2 rounded-sm text-sm"
            type="text"
            placeholder="Type here to search"
          />
        </div>
        <div className="flex gap-2 justify-between">
          <Button className="max-h-8 py-0.5 flex justify-center items-center rounded-sm">
            <Search size={20} color="white" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="max-h-8 py-0.5 flex justify-center items-center rounded-sm">
                <Filter size={20} color="white" />
              </Button>
            </DialogTrigger>

            <DialogContent className="w-[90vw] max-h-[90vh] overflow-y-scroll p-3 rounded-md bg-[#fff] dark:bg-[#222]">
              <DialogTitle>Filters and Sortings</DialogTitle>
              <MobileFilterSort
                specificFilters={specificFilters}
                appliedFilters={appliedFilters}
                toggleFilter={toggleFilter}
                defaultValues={defaultValues}
                setSelectedValuesMap={setSelectedValuesMap}
                setAppliedFilters={setAppliedFilters}
                moreFilters={moreFilters}
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                selectedValuesMap={selectedValuesMap}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="border border-transparent sm:hidden mt-2 w-full flex flex-row flex-wrap justify-between">
        <div className="flex">
          <div className="border-[1px] border-primary py-1 px-2 rounded-md mb-1 flex items-center gap-1">
            <span className="pointer-events-none text-sm">Filter by: </span>
            {specificFilters.some((f) => f.isActive) ? (
              <span className="flex items-center gap-1 flex-row ">
                {activeFiltersInOrder.filter(Boolean).map((filter, index) => (
                  <span
                    key={index}
                    className="text-sm text-gray-800 pointer-events-none"
                  >
                    <span className="text-primary bg-varWhite px-0.5 py-0.5 rounded-sm text-sm">
                      {filter!.name}
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
        </div>
        <div className="flex">
          <div className="border-[1px] border-primary py-1 px-2 rounded-md flex items-center gap-1">
            <span className="pointer-events-none text-sm">Sort By: </span>
            {selectedFilter ? (
              <div className="flex items-center gap-2">
                <span className="text-primary text-sm h-6 bg-varWhite px-0.5 py-0.5 rounded-sm pointer-events-none">
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
              <span className="text-primary h-6 text-sm bg-varWhite px-0.5 py-0.5 rounded-sm pointer-events-none">
                None
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="sm:flex hidden justify-between items-center w-full md:translate-y-4 translate-y-2">
        <div className="text-md text-white font-semibold bg-primary dark:bg-transparent border-1 border-transparent dark:border-primary rounded-sm px-1">
          Visible products: From {(page - 1) * limit + 1} to{" "}
          {page === totalPages ? total : page * limit}
        </div>
        <div className="text-md text-white font-semibold bg-primary dark:bg-transparent border-1 border-transparent dark:border-primary rounded-sm px-1">
          Total: {total} products available!
        </div>
      </div>

      {/* product cards */}
      <div className="w-full lg:mt-16 md:mt-10 mt-6 mb-4">
        {isLoading ? (
          <SkeletonProducts />
        ) : products.length <= 0 ? (
          <div className="w-full">
            No products found, please try changing the filter or the search
            query.
          </div>
        ) : (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 lg:gap-8 md:gap-6 gap-3">
            {products?.map((product: Product) => {
              return <ProductCard product={product} key={product.id} />;
            })}
          </div>
        )}
      </div>

      {/* pagination buttons */}
      <div className="flex sm:flex-row flex-col-reverse justify-between gap-5 mb-8 items-center">
        <Button
          isLinkButton
          variants="borderedWithShadow"
          className="flex border border-primary items-center justify-between gap-2 "
        >
          <ShoppingCart size={20} color="var(--primary)" />
          <span className="sm:text-md text-sm">Go to the Cart</span>
          <ChevronRight size={20} color="var(--primary)" />
        </Button>

        {isLoading ? (
          <SkeletonPagination />
        ) : (
          <div className="flex items-center gap-2">
            <Button
              isHoverable={page > 1}
              isCursorPointer={page > 1}
              onClick={() => {
                setPage(page > 1 ? page - 1 : page);
                refetch();
              }}
              className={`h-10 flex items-center justify-center ${
                page > 1 ? "" : "bg-primary/50"
              } sm:text-md text-sm`}
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
                className={`border border-primary w-10 h-10 flex justify-center items-center sm:text-md text-sm`}
              >
                1
              </Button>
            )}
            <Button
              variants="border"
              disabled
              isCursorPointer={false}
              className="border border-primary w-10 h-10 flex justify-center items-center sm:text-md text-sm"
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
                className={`border border-primary w-10 h-10 flex justify-center items-center sm:text-md text-sm`}
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
              className={`h-10 flex items-center justify-center ${
                page < totalPages ? "" : "bg-primary/50"
              } sm:text-md text-sm`}
            >
              Next
            </Button>
          </div>
        )}
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
