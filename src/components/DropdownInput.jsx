import React, {useState} from "react";
import InputField from "./InputField";

export default function DropdownInput({ choices, data, setData, label, placeholder, additionalStyles}) {
  const [showDropdown,setShowDropdown] = useState(false)
  return (
    <div className={`relative ${additionalStyles}`}>
      <InputField
        data={data}
        setData={setData}
        label={label}
        placeholder={placeholder}
        type={"dropdown"}
        dropdownFunc={() => setShowDropdown((prev) => !prev)}
      />
      <div
        className={`absolute shadow-md bg-white flex-col w-full rounded-lg h-20 overflow-y-scroll top-20 text-sm font-semibold ${
          showDropdown ? "flex" : "hidden"
        }`}
      >
        {choices.map((choice) => (
          <div
            className="px-5 py-2 flex gap-3 cursor-pointer"
            onClick={() => {setData(choice)}}
            key={choice}
          >
            <p>{choice}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
