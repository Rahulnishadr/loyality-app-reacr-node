import React, { createContext, useState } from 'react';

export const HeaderContext = createContext({
  selectedValue: '',
  setSelectedValue: () => {},
});

export function HeaderContextProvider({ children }) {
  const [selectedValue, setSelectedValue] = useState('');
  return (
    <HeaderContext.Provider value={{ selectedValue, setSelectedValue }}>
      {children}
    </HeaderContext.Provider>
  );
}
