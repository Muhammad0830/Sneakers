import React, { Dispatch, SetStateAction } from "react";
import FilterPopOver from "./filterPopOver";
import { appliedFiltersType, MoreFiltersType } from "@/types/types";
import Button from "./ui/CustomButton";
import { useTranslations } from "next-intl";

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
  isDummyDataWorking: boolean;
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
  isDummyDataWorking,
}: Props) => {
  const toastT = useTranslations("Toast");
  const t = useTranslations("Shop");
  return (
    <>
      <Button
        onClick={() => {
          if (selectedPopUp?.name === filter.name) {
            setSelectedPopUp(null);
          } else {
            setSelectedPopUp(filter);
          }
        }}
        isCursorPointer={selectedPopUp?.name === filter.name ? false : true}
        className={`text-xl border-[2px] lg:min-w-[6rem] min-w-[4rem] z-20 ${
          selectedPopUp?.name === filter.name ? "popUpActive" : ""
        } ${filter.isActive ? "active" : ""}`}
        variants="borderedWithShadow"
      >
        {t(`${filter.name}`)}
      </Button>

      <div
        className={`popup absolute border border-primary bg-white dark:bg-black p-2 rounded-md z-10 left-[50%] translate-x-[-50%] flex justify-center ${
          selectedPopUp?.name === filter.name ? "active" : "inactive"
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
              {t("Close")}
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
                    toastT("Warning"),
                    toastT("Please make at least one change")
                  );
                } else if (selectedPopUp?.name) {
                  if (currentValues.length === 0) {
                    showToast(
                      "warning",
                      toastT("Warning"),
                      toastT("Please make at least one change")
                    );
                    return;
                  }

                  if (!existing) {
                    toggleFilter(currentName, "apply");
                    if (isDummyDataWorking)
                      showToast(
                        "error",
                        toastT("Internal server error"),
                        toastT("Some functions may not work properly")
                      );
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
                {t("Apply")}
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
                        appliedFilters.find(
                          (f) => f.name === selectedPopUp?.name
                        )?.selectedValues
                    ? "translate-x-[300%]"
                    : "-translate-x-[300%]"
                }`}
              >
                {t("Cancel")}
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
                {t("Update")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopPageFilterPopOver;
