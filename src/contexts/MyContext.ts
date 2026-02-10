import { createContext } from "react";

type MyDropdownContextType = {
  contractpackages: any;
  segmentlines: any;
  updateContractpackages: any;
  updateSegmentlines: any;
};

const initialState = {
  contractpackages: undefined,
  segmentlines: undefined,
  updateContractpackages: undefined,
  updateSegmentlines: undefined,
};

export const MyContext = createContext<MyDropdownContextType>({
  ...initialState,
});
