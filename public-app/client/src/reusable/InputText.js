// import React from 'react'
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';

// function InputText({ placeholder, name, id, label, helperText ,size='small' }) {
//   return (
//     <Box sx={{ display: 'flex', alignItems: 'center', '& > :not(style)': { m: 1 } }}>
//       <TextField
//         helperText={helperText || "Please enter the value"}   
//         id={id}
//         name={name}
//         label={label || "Input"}   
//         placeholder={placeholder}
//         size={size} 
//       />
//     </Box>
//   )
// }

// export default InputText;

import React from 'react';
import { TextField } from '@mui/material';

const InputText = ({ label, placeholder, name, value, onChange, error, helperText, ...props }) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      name={name}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      variant="outlined"
      {...props}
    />
  );
};

export default InputText;

