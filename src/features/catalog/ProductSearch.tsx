import { TextField, debounce } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setProductParams } from "./catalogSlice";
import { useState } from "react";

export default function ProductSearch() {
  const { productParams } = useAppSelector((state) => state.catalog);
  const [searchTerm, setSeatchTerm] = useState(productParams.searchTerm);
  const dispatch = useAppDispatch();

  const debouncedSearch = debounce((event: any) => {
    dispatch(setProductParams({ searchTerm: event.target.value }));
  }, 1000);

  return (
    <TextField
      label="Search Products"
      variant="outlined"
      fullWidth
      value={searchTerm || ""}
      onChange={(event: any) => {
        setSeatchTerm(event.target.value);
        debouncedSearch(event);
      }}
    />
  );
}

//fo2 hna 3mlna method esmha debouncedSearch bta5od event w bt3ml setProductParams 3shan t8yr el search term bs btet25r 1000 miliseconds
//kol da 3shan lama el user yktb el browser ystna 1 second 2bl ma y3ml call lel API f msh m3 kol 7rf yktbo y3ml call lel API .. f 3mlna
//el awal local state lel searchTerm w 5lenaha ta5od el default value bta3etha mn productParams.searchTerm w b3d kda 3mlna fel onChange
//7agten awel 7aga n3ml set lel searchTerm bel event.target.value elly el user byktbo y3ny 3shan kol ma yktb el 7rof tzhr 3ady lakn msh
//hy3ml call lel API m3 kol 7rf l2n b3d kda est5dmna el debouncedSearch method w denaha el event
