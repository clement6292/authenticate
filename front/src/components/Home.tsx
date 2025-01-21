import {
    Container,
    CssBaseline,
    Box,
    Typography,
    Button,
    Grid,
  } from "@mui/material";
  import { Link } from "react-router-dom";
  
  const Home = () => {
    return (
      <>
        <Container maxWidth="lg">
          <CssBaseline />
          <Box
            sx={{
              mt: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h2" gutterBottom>
              Welcome to the Home Page!
            </Typography>
            <Typography variant="h5" align="center" sx={{ mb: 4 }}>
              This is your dashboard. Please log in or register to continue.
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6}>
                <Button
                  component={Link}
                  to="/login"
                  fullWidth
                  variant="contained"
                  sx={{ mb: 2 }}
                >
                  Go to Login
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  component={Link}
                  to="/register"
                  fullWidth
                  variant="outlined"
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </>
    );
  };
  
  export default Home;