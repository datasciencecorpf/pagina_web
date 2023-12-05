import React, { useState } from "react";

function Dropdown({ options, onSelect }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelect = (event) => {
    const optionValue = event.target.value;
    setSelectedOption(optionValue);
    const optionKey = Object.keys(options).find(
      (key) => options[key] === optionValue
    );
    onSelect(optionKey);
  };

  return (
    <select value={selectedOption} onChange={handleSelect}>
    {Object.values(options).map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
);
}

export default  Dropdown;
