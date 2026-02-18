// src/context/HeaderContext.js
import React, { createContext, useState } from 'react';

export const HeaderContext = createContext();

// eslint-disable-next-line react/prop-types
export const HeaderProvider = ({ children }) => {
  let data=localStorage.getItem('Values')
  
  const [selectedValue, setSelectedValue] = useState(data?data:"rajnigandha");

  return (
    <HeaderContext.Provider value={{ selectedValue, setSelectedValue }}>
      {children}
    </HeaderContext.Provider>
  );
};
