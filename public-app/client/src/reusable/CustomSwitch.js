import * as React from 'react';
import Switch from '@mui/material/Switch';

function CustomSwitch({ checked, disabled, onChange, label }) {
  return (
    <div>
      <Switch
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        
        inputProps={{ 'aria-label': label || 'Switch' }}
      />
    </div>
  );
}

export default CustomSwitch;
