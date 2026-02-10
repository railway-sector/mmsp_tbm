import { useState, use } from "react";
import Select from "react-select";
import "../index.css";
import "../App.css";
import { dropdownDataObject, initialDropdownObject } from "../Query";
import { MyContext } from "../contexts/MyContext";

export default function DropdownData() {
  const { updateContractpackages, updateSegmentlines } = use(MyContext);

  // For dropdown filter
  const [contractPackage, setConstractPackage] = useState<null | any>(
    initialDropdownObject,
  );
  const [tunnelLine, setTunnelLine] = useState<null | any>(null);
  const [tunnelLineList, setTunnelLineList] = useState<null | undefined | any>(
    initialDropdownObject.field2,
  );

  // useEffect(() => {
  //   setConstractPackage(initialDropdownObject);
  //   setTunnelLineList(initialDropdownObject.field2);
  // }, []);

  // handle change event of the Municipality dropdown
  const handleContractPackageChange = (obj: any) => {
    setConstractPackage(obj);
    setTunnelLineList(obj.field2);
    setTunnelLine(null);
    updateContractpackages(obj.field1);
    updateSegmentlines(undefined);
  };

  // handle change event of the segmentLine dropdownff
  const handleSegmentLineChange = (obj: any) => {
    setTunnelLine(obj);
    updateSegmentlines(obj.name);
  };

  return (
    <>
      <DropdownListDisplay
        handleContractPackageChange={handleContractPackageChange}
        handleSegmentLineChange={handleSegmentLineChange}
        contractPackage={contractPackage}
        segmentLine={tunnelLine}
        segmentLineList={tunnelLineList}
      ></DropdownListDisplay>
    </>
  );
}

export function DropdownListDisplay({
  handleContractPackageChange,
  handleSegmentLineChange,
  contractPackage,
  segmentLine,
  segmentLineList,
}: any) {
  // Style CSS
  const customstyles = {
    option: (styles: any, { isFocused, isSelected }: any) => {
      // const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isFocused
          ? "#999999"
          : isSelected
            ? "#2b2b2b"
            : "#2b2b2b",
        color: "#ffffff",
      };
    },

    control: (defaultStyles: any) => ({
      ...defaultStyles,
      backgroundColor: "#2b2b2b",
      borderColor: "#949494",
      color: "#ffffff",
      touchUi: false,
    }),
    singleValue: (defaultStyles: any) => ({ ...defaultStyles, color: "#fff" }),
  };

  return (
    <div className="dropdownFilterLayout">
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
        }}
      >
        Contract Package
      </div>

      <Select
        placeholder="Select Contract Package"
        value={contractPackage}
        options={dropdownDataObject}
        onChange={handleContractPackageChange}
        getOptionLabel={(x: any) => x.field1}
        styles={customstyles}
      />
      <br />
      <div
        style={{
          color: "white",
          fontSize: "0.85rem",
          margin: "auto",
          paddingRight: "0.5rem",
          marginLeft: "15px",
        }}
      >
        Segment Line
      </div>
      <Select
        placeholder="Select Segment Line"
        value={segmentLine}
        options={segmentLineList}
        onChange={handleSegmentLineChange}
        getOptionLabel={(x: any) => x.name}
        styles={customstyles}
      />
    </div>
  );
}
