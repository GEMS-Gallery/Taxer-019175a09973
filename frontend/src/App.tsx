import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Container, Typography, Box, TextField, Button, Grid } from '@mui/material';
import DataTable from 'react-data-table-component';
import { useForm, Controller } from 'react-hook-form';

type TaxPayer = {
  tid: string;
  firstName: string;
  lastName: string;
  address: string;
};

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [searchTid, setSearchTid] = useState('');
  const [searchResult, setSearchResult] = useState<TaxPayer | null>(null);
  const { control, handleSubmit, reset } = useForm<TaxPayer>();

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    const result = await backend.getTaxPayers();
    setTaxPayers(result);
  };

  const onSubmit = async (data: TaxPayer) => {
    await backend.addTaxPayer(data.tid, data.firstName, data.lastName, data.address);
    reset();
    fetchTaxPayers();
  };

  const handleSearch = async () => {
    if (searchTid) {
      const result = await backend.searchTaxPayer(searchTid);
      setSearchResult(result[0] || null);
    }
  };

  const columns = [
    { name: 'TID', selector: (row: TaxPayer) => row.tid, sortable: true },
    { name: 'First Name', selector: (row: TaxPayer) => row.firstName, sortable: true },
    { name: 'Last Name', selector: (row: TaxPayer) => row.lastName, sortable: true },
    { name: 'Address', selector: (row: TaxPayer) => row.address, sortable: true },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        TaxPayer Management System
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Add New TaxPayer
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="tid"
                control={control}
                defaultValue=""
                rules={{ required: 'TID is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="TID"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{ required: 'First Name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="First Name"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{ required: 'Last Name is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Last Name"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                defaultValue=""
                rules={{ required: 'Address is required' }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label="Address"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
              <Button type="submit" variant="contained" color="primary">
                Add TaxPayer
              </Button>
            </form>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Search TaxPayer
            </Typography>
            <TextField
              label="Search by TID"
              value={searchTid}
              onChange={(e) => setSearchTid(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleSearch} variant="contained" color="secondary">
              Search
            </Button>
            {searchResult && (
              <Box mt={2}>
                <Typography variant="subtitle1">Search Result:</Typography>
                <Typography>
                  TID: {searchResult.tid}, Name: {searchResult.firstName} {searchResult.lastName}, Address: {searchResult.address}
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      <Box mt={3}>
        <Typography variant="h6" gutterBottom>
          TaxPayer Records
        </Typography>
        <DataTable
          columns={columns}
          data={taxPayers}
          pagination
          responsive
          highlightOnHover
        />
      </Box>
    </Container>
  );
};

export default App;
