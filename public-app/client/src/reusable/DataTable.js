import * as React from 'react';
// import { DataGrid } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid'
import Paper from '@mui/material/Paper';

const DataTable = ({ rows, columns, paginationModel, pageSizeOptions = [5, 10] }) => {
  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={pageSizeOptions}
        // checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
};

export default DataTable;
