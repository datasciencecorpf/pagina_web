import React, { useState, useEffect } from 'react';
import './css/ReadGranjas.css';

const ReadGranjas = ({ onGranjaSelect, jsonData }) => {
  const [selectedGranja, setSelectedGranja] = useState('');
  const [uniqueGranjas, setUniqueGranjas] = useState([]);

  useEffect(() => {
    const granjas = Array.from(new Set(jsonData.map((item) => item.Granja)));
    setUniqueGranjas(granjas);
  }, [jsonData]);

  const handleGranjaChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedGranja(selectedValue);
    onGranjaSelect(selectedValue);
  };

  return (
    <div>
      <label htmlFor="granja">Granja: </label>
      <select className="granja" value={selectedGranja} onChange={handleGranjaChange}>
        <option value="">Seleccione una granja</option>
        {uniqueGranjas.map((granja, index) => (
          <option key={index} value={granja}>
            {granja}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ReadGranjas;
