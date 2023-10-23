import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import { Product } from "../../app/models/product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";

//el entity adapter dy function btrg3 el data fe shakl object gowah array mn Ids w object mn entities w btb2a el array of Ids dy mrbota
//bel entities 3n tre2 el Id prop elly mwgoda fe object el entities lw fe y3ny prop esmha Id gowa object el entities lakn lw mfesh Id f
//lazm nrbothom manually w byb2a leha methods 5asa beha zy msln selectAll aw selectOne aw ayn kan b2a bn3mlha export t7t 5ales hna aho
//3shan nst5dmha fe ay mkan b2a
const productsAdapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
  "product/fetchProductsAsync",
  async (_, thunkAPI) => {
    try {
      return await agent.Catalog.list();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
);

export const fetchProductAsync = createAsyncThunk<Product, number>(
  "product/fetchProductAsync",
  async (productId, thunkAPI) => {
    try {
      return await agent.Catalog.details(productId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
);

export const catalogSlice = createSlice({
  name: "catalog",
  initialState: productsAdapter.getInitialState({
    productsLoaded: false,
    status: "idle",
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = "pendingFetchProducts";
    });
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      productsAdapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    });
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchProduct";
    });
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productsAdapter.upsertOne(state, action.payload);
      state.status = "idle";
    });
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      state.status = "idle";
      console.log(action.payload);
    });
  },
});

//el method elly t7t dy htdena kol el selectors elly m7tagenha b2a swa2 select all aw selectById aw 8ero
export const productSelectors = productsAdapter.getSelectors(
  (state: RootState) => state.catalog,
);
