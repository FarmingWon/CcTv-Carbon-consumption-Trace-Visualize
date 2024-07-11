import React from 'react';
import { Box, Button, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as yup from 'yup';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import axios from 'axios';

const Form = ({ onLogin }) => {
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const navigate = useNavigate();
  const [csvData, setCsvData] = React.useState(null);
  const [fetchError, setFetchError] = React.useState(false); // 서버 연동 에러 상태 추가

  const handleFormSubmit = (values) => {
    // 로그인 성공 시 onLogin 콜백 호출
    onLogin();
    navigate('/');
  };

  const handleLoadCSV = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/csvdata');
      setCsvData(response.data.csvData);
      setFetchError(false); // 성공 시 에러 상태 초기화
    } catch (error) {
      console.error('Error fetching CSV data:', error);
      setFetchError(true); // 실패 시 에러 상태 설정
    }
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
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Sign In
              </Button>
            </Box>
          </form>
        )}
      </Formik>
      <Button
        type="button"
        color="secondary"
        variant="contained"
        onClick={handleLoadCSV}
        style={{ marginTop: '30px' }}
      >
        Load CSV
      </Button>
      {fetchError && ( // fetchError 상태에 따라 실패 메시지 표시
        <Box mt={3}>
          <h2>Failed to fetch CSV data from server.</h2>
          <p>Please check your network connection and try again.</p>
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
