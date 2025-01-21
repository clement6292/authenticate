import React from "react";
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    Button,
    Grid,
} from "@mui/material";
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const token = localStorage.getItem('token'); // Récupérer le token

        if (!token) {
            console.error("Token is null or not found");
            return; // Arrêtez la fonction si le token est absent
        }
        try {
            const response = await axios.post("http://127.0.0.1:8000/logout", {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // Vérifiez que le token n'est pas null
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                // Supprimez le token localement ou toute autre donnée d'authentification
                localStorage.removeItem('token');
                navigate('/login'); // Redirigez vers la page de connexion
            } else {
                console.error("Erreur lors de la déconnexion", response.statusText);
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à la méthode de déconnexion", error);
        }
    };

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
                        Bienvenue sur votre tableau de bord !
                    </Typography>
                    <Typography variant="h5" align="center" sx={{ mb: 4 }}>
                        Vous êtes connecté. Profitez de votre expérience.
                    </Typography>

                    <Grid container spacing={5} sx={{ mt: 5 }}>
                    
                            <Button
                                onClick={handleLogout}
                                fullWidth
                                variant="outlined"
                            >
                                Déconnexion
                            </Button>
                
                    </Grid>
                </Box>
            </Container>
        </>
    );
};

export default Dashboard;