import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  data: number;
  title: string;
}

const initialState: CounterState = {
  data: 42,
  title: "Dooola Counter with Redux Toolkit",
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state, action) => {
      state.data += action.payload;
    },
    decrement: (state, action) => {
      state.data -= action.payload;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;

//fo2 hna el createSlice dy method bta5od name el slice elly e7na n5taro w bta5od initial state tbd2 beha w ta5od ay 3dd mn el reducers b2a
//w hya elly bt3ml el action types wel action creators elly e7na 3mlnahom bnfsna fe counterReducer.ts
//hya msh bt3ml mutation lel state wala 7aga br8m enna hn7es enha bt3ml kda mn el code lakn fe built in library bt5ly da my7slsh
