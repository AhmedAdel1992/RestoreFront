import { Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound(){
    return (
        <Container component={Paper} sx={{height: 400}}>
            <Typography variant="h3" gutterBottom>Ooops We Couldn't Find What You Were Looking For !!</Typography>
            <Divider />
            <Button fullWidth component={Link} to={"/catalog"}>Go Back To Shop</Button>
        </Container>
    )
}