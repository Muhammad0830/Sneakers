import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export const PriceFilter = ({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (values: string[]) => void;
}) => {
  const t = useTranslations("Shop");
  const [from, setFrom] = useState(selected[0] || "");
  const [to, setTo] = useState(selected[1] || "");

  useEffect(() => {
    setSelected([from, to]);
  }, [from, to]);

  useEffect(() => {
    setFrom(selected[0] || "");
    setTo(selected[1] || "");
  }, [selected]);

  return (
    <div className="gap-2 w-full relative flex sm:flex-col flex-row items-center">
      <div className="border border-blue-800 overflow-hidden sm:mx-1 sm:w-[8rem] w-1/2 rounded my-1">
        <input
          value={from}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setFrom(value);
            }
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={`${t("from")} $`}
          className="no-spinner w-full h-full rounded sm:py-1 px-2 py-1.5 sm:text-md text-sm"
        />
      </div>
      <div className="border border-blue-800 overflow-hidden sm:mx-1 sm:w-[8rem] w-1/2 rounded my-1">
        <input
          value={to}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value)) {
              setTo(value);
            }
          }}
          placeholder={`${t("to")} $`}
          className="no-spinner w-full h-full rounded sm:py-1 px-2 py-1.5 sm:text-md text-sm"
          inputMode="numeric"
          pattern="[0-9]*"
          type="text"
        />
      </div>
    </div>
  );
};
