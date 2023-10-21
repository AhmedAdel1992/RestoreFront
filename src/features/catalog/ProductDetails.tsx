import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import NotFound from "../../app/errors/NotFound";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { currencyFormat } from "../../app/util/util";
import { useStoreContext } from "../../app/context/StoreContext";
import { LoadingButton } from "@mui/lab";

export default function ProductDetails() {
  const { basket, setBasket, removeItem } = useStoreContext();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const item = basket?.items.find((i) => i.productId === product?.id);

  useEffect(() => {
    if (item) setQuantity(item.quantity);
    id &&
      agent.Catalog.details(parseInt(id))
        .then((product) => setProduct(product))
        .catch((error) => console.log(error))
        .finally(() => setLoading(false));
    //lw msh 3amel el agent file da h3ml axios 3ady be elly t7t da
    // .get(`http://localhost:5000/api/products/${id}`)
    // .then((response) => setProduct(response.data))
    // .catch((error) => console.log(error))
    // .finally(() => setLoading(false));
  }, [id, item]);

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (parseInt(event.currentTarget.value) >= 0) {
      setQuantity(parseInt(event.currentTarget.value));
    }
  }

  function handleUpdateCart() {
    if (!product) return;
    setSubmitting(true);
    if (!item || quantity > item.quantity) {
      const updatedQuantity = item ? quantity - item.quantity : quantity;
      agent.Basket.addItem(product.id, updatedQuantity)
        .then((basket) => setBasket(basket))
        .catch((error) => console.log(error))
        .finally(() => setSubmitting(false));
    } else {
      const updatedQuantity = item.quantity - quantity;
      agent.Basket.removeItem(product.id, updatedQuantity)
        .then(() => removeItem(product.id, updatedQuantity))
        .catch((error) => console.log(error))
        .finally(() => setSubmitting(false));
    }
  }

  if (loading) return <LoadingComponent message="Loading Product ..." />;

  if (!product) return <NotFound />;

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{ width: "100%" }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h3">{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h4" color="secondary">
          {currencyFormat(product.price)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Qunatity In Stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              onChange={handleInputChange}
              variant="outlined"
              type="number"
              label="Quantity in Cart"
              fullWidth
              value={quantity}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              disabled={
                item?.quantity === quantity || (!item && quantity === 0)
              }
              loading={submitting}
              onClick={handleUpdateCart}
              sx={{ height: "55px" }}
              color="primary"
              size="large"
              variant="contained"
              fullWidth
            >
              {item ? "Update Quantity" : "Add to Cart"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

// return (
//     <Grid container spacing={6}>
//       <Grid item xs={6}>
//         <img
//           src={product.pictureUrl}
//           alt={product.name}
//           style={{ width: "100%" }}
//         />
//       </Grid>
//       <Grid item xs={6}>
//         <Typography variant="h3">{product.name}</Typography>
//         <Divider sx={{ mb: 2 }} />
//         <Typography variant="h4" color="secondary">
//           ${(product.price / 100).toFixed(2)}
//         </Typography>
//         <Tablee
//           values={[
//             { label: "Name", value: product.name },
//             { label: "Description", value: product.description },
//             { label: "Type", value: product.type },
//             { label: "Brand", value: product.brand },
//             { label: "Quantity In Stock", value: product.quantityInStock },
//           ]}
//         />
//       </Grid>
//     </Grid>
//   );
// }

// const Tablee = ({ values }) => (
//   <TableContainer>
//     <Table>
//       <TableBody>
//         {/* <TableRow>
//           <TableCell>Name</TableCell>
//           <TableCell>{product.name}</TableCell>
//         </TableRow>
//         <TableRow>
//           <TableCell>Description</TableCell>
//           <TableCell>{product.description}</TableCell>
//         </TableRow>
//         <TableRow>
//           <TableCell>Type</TableCell>
//           <TableCell>{product.type}</TableCell>
//         </TableRow>
//         <TableRow>
//           <TableCell>Brand</TableCell>
//           <TableCell>{product.brand}</TableCell>
//         </TableRow>
//         <TableRow>
//           <TableCell>Qunatity In Stock</TableCell>
//           <TableCell>{product.quantityInStock}</TableCell>
//         </TableRow> */}
//         {values.map(({ label, value }, index) => (
//           <TableSegment key={index} label={label} value={value} /> // TableSegment({label:"",value:""})
//         ))}
//       </TableBody>
//     </Table>
//   </TableContainer>
// );

// const TableSegment = ({ label, value }) => (
//   <TableRow>
//     <TableCell>{label}</TableCell>
//     <TableCell>{value}</TableCell>
//   </TableRow>
// );
