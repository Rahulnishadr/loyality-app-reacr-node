import React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function MultipleSelect({ options, selectedProducts, setSelectedProducts }) {

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    const selected = typeof value === "string" ? value.split(",") : value;

    if (selected.includes("Select All")) {
      // Handle Select All
      setSelectedProducts(options);
    } else if (selected.includes("Deselect All")) {
      // Handle Deselect All
      setSelectedProducts([]);
    } else {
      const selectedDetails = options.filter((product) => selected.includes(product?.title));
      setSelectedProducts(selectedDetails);
    }
  };

  const isAllSelected = selectedProducts.length === options.length;
  const isNoneSelected = selectedProducts.length === 0;

  return (
    <div>
      <FormControl
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "gray", // Normal border color
            },
            "&:hover fieldset": {
              borderColor: "gray", // Hover border color
            },
            "&.Mui-focused fieldset": {
              borderColor: "gray", // Focused border color
            },
          },
        }}
      >
        <InputLabel id="demo-multiple-checkbox-label">Product Name</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={selectedProducts.map((product) => product?.title)}
          onChange={handleChange}
          input={<OutlinedInput label="Product Name" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          <MenuItem value="Select All">
            <Checkbox checked={isAllSelected} />
            <ListItemText primary="Select All" />
          </MenuItem>
          <MenuItem value="Deselect All">
            <Checkbox checked={isNoneSelected} />
            <ListItemText primary="Deselect All" />
          </MenuItem>
            
          {options?.map((product) => (
            <MenuItem key={product?.id} value={product?.title}>
              <Checkbox checked={selectedProducts?.some((p) => p.title === product?.title)} />
              <ListItemText primary={product?.title} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
