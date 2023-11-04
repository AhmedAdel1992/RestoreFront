import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { User } from "../../app/models/user";
import { FieldValues } from "react-hook-form";
import agent from "../../app/api/agent";
import { router } from "../../app/router/Routes";
import { toast } from "react-toastify";
import { setBasket } from "../basket/basketSlice";

interface AccountState {
  user: User | null;
}

const initialState: AccountState = {
  user: null,
};

export const signInUser = createAsyncThunk<User, FieldValues>(
  "account/signInUser",
  async (data, thunkAPI) => {
    try {
      const userDto = await agent.Account.login(data);
      const { basket, ...user } = userDto;
      //fo2 hna 3mlna destructure lel userDto ely gy mn el API gowah basket w email w token w 5lena el basket lw7dha fe varibale basket
      //w ba2y el 7agat elly hya el email wel token fe variable tany elly howa el user
      if (basket) thunkAPI.dispatch(setBasket(basket));
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
);

export const fetchCurrentUser = createAsyncThunk<User>(
  "account/fetchCurrentUser",
  async (_, thunkAPI) => {
    thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem("user")!)));
    //fo2 hna bn3ml set lel state bta3et el user bel user elly fel local storage 3shan n5ly el token tkon mwgoda fel state 3shan fel
    //agent.ts lama ast5dm el interceptor fe eny a7ot el token fel authorization header tkon el token mwgoda fel state asln
    try {
      const userDto = await agent.Account.currentUser();
      const { basket, ...user } = userDto;
      if (basket) thunkAPI.dispatch(setBasket(basket));
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data });
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem("user")) return false;
    },
    //el condition elly fo2 da 3shan lw mfesh user fel local storage el async method elly fo2 mtet3mlsh asln f el app y3ny my7awelsh eno
    //y3ml fetch lel user 8er lw fe asln user fel local storage
  },
);

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    signOut: (state) => {
      state.user = null;
      localStorage.removeItem("user");
      router.navigate("/");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.rejected, (state) => {
      state.user = null;
      localStorage.removeItem("user");
      toast.error("Session Expired - Please Log In Again");
      router.navigate("/");
    });
    builder.addMatcher(
      isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled),
      (state, action) => {
        state.user = action.payload;
      },
    );
    builder.addMatcher(isAnyOf(signInUser.rejected), (_state, action) => {
      throw action.payload;
    });
  },
});

export const { signOut, setUser } = accountSlice.actions;
