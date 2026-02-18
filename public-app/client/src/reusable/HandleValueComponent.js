import React from 'react';

const HandleValueComponent = ({ value }) => {
  const handleValue = (value) => {
    if (value === undefined) {
      return 'Value is undefined';
    } else if (value === null) {
      return 'Value is null';
    } else if (typeof value === 'object') {
      // Check if the object is empty
      if (Object.keys(value).length === 0) {
        return 'Object is empty';
      }
      return `Object contains: ${JSON.stringify(value)}`;
    } else {
      return `Value is: ${value}`;
    }
  };

  return <div>{handleValue(value)}</div>;
};

export default HandleValueComponent;
