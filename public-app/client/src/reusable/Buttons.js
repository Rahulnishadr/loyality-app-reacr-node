import React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function Buttons({ type = 'button', color = 'primary', label = 'Button', variant = 'contained',onClick }) {
    return (
        <Stack direction="row" spacing={2}>
            <Button variant={variant} color={color} type={type} onClick={onClick}>
                {label}
                
            </Button>
        </Stack>
    );
}

export default Buttons;
