import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";

export const GenderFilter = ({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (values: string[]) => void;
}) => {
  const { theme } = useTheme();
  const t = useTranslations("Shop");
  const options = ["Men", "Women", "Kids"];
  return (
    <div className="flex flex-col gap-2">
      {options.map((option) => (
        <label
          key={option}
          htmlFor={option}
          className="flex items-center gap-2 cursor-pointer sm:py-0.5 sm:px-1.5 px-2 py-1.5 overflow-hidden rounded-sm border border-blue-800 relative"
        >
          <input
            type="checkbox"
            id={option}
            checked={selected.includes(option)}
            onChange={() =>
              setSelected(
                selected.includes(option)
                  ? selected.filter((v) => v !== option)
                  : [...selected, option]
              )
            }
            className="sr-only peer"
          />
          <div
            className={`w-4 h-4 rounded-full border-1 border-blue-700 flex items-center justify-center peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors duration-300`}
          ></div>
          <label
            htmlFor={option}
            className="cursor-pointer select-none text-nowrap sm:text-md text-sm capitalize"
          >
            {t("For")} {t(option)}
          </label>
          <div
            className={`absolute top-0 bottom-0 left-0 right-0 -z-10 translate-x-[100%] peer-checked:translate-x-[0%] transition-transform duration-300`}
            style={{
              background: `linear-gradient(to right, transparent 30%, ${
                theme === "light" ? "#c7ebf0" : "#4596ed"
              })`,
            }}
          ></div>
        </label>
      ))}
    </div>
  );
};
