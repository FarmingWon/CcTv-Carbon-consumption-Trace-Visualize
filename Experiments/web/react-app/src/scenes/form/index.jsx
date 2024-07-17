import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const Form = ({ onLogin }) => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const navigate = useNavigate();
  const [csvData, setCsvData] = React.useState(null);
  const [fetchError, setFetchError] = React.useState(false);
  const [csvError, setCsvError] = React.useState(false);

  const handleFormSubmit = (values) => {
    if (!csvData) {
      setCsvError(true);
      return;
    }
    onLogin();
    navigate('/');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const csvText = e.target.result;
      try {
        const parsedData = parseCSV(csvText);
        setCsvData(parsedData);
        setFetchError(false);
        setCsvError(false);
      } catch (error) {
        console.error('Error parsing CSV file:', error);
        setFetchError(true);
      }
    };

    reader.onerror = () => {
      console.error('Error reading CSV file');
      setFetchError(true);
    };

    if (file) {
      reader.readAsText(file);
    }
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map((line) => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });
    return data;
  };

  const loginSchema = yup.object().shape({
    id: yup.string().required('Required'),
    password: yup.string().required('Required')
  });

  const initialValues = {
    id: '',
    password: ''
  };

  return (
    <Box m="70px">
      <Header title="Login" subtitle="Sign in to your account" />
      <Formik
        initialValues={initialValues}
        validationSchema={loginSchema}
        onSubmit={handleFormSubmit}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' }
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="ID"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.id}
                name="id"
                error={!!touched.id && !!errors.id}
                helperText={touched.id && errors.id}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="password"
                label="Password"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
                name="password"
                error={!!touched.password && !!errors.password}
                helperText={touched.password && errors.password}
                sx={{ gridColumn: 'span 4' }}
              />
            </Box>
            {csvError && (
              <Box mt={2} color="error.main">
                CSV 파일을 업로드해주세요.
              </Box>
            )}
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Sign In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id="csv-input"
      />
      <label htmlFor="csv-input">
        <Button
          color="secondary"
          variant="contained"
          component="span"
          style={{ marginTop: '30px' }}
        >
          Input CSV
        </Button>
      </label>
      {fetchError && (
        <Box mt={3}>
          <h2>Failed to parse CSV data.</h2>
          <p>Please check the file format and try again.</p>
        </Box>
      )}
      {csvData && !fetchError && (
        <Box mt={3}>
          <h2>CSV Data:</h2>
          <pre>{JSON.stringify(csvData, null, 2)}</pre>
        </Box>
      )}
    </Box>
  );
};

export default Form;
