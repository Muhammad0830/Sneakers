import { GenderFilter } from "@/components/GenderFilter";
import { ColorFilter } from "@/components/ColorFilter";
import { PriceFilter } from "@/components/PriceFilter";

const FILTER_COMPONENTS: {
  [key: string]: React.FC<{
    selected: string[];
    setSelected: (values: string[]) => void;
  }>;
} = {
  Gender: GenderFilter,
  Color: ColorFilter,
  Price: PriceFilter,
  // Size can be default or custom later
};

export default FILTER_COMPONENTS;
