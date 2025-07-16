import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FilterState {
  keyword: string;
  status: string;    // "All" | "Pending" | ...
  priority: string;  // "All" | "High" | ...
}

const initialState: FilterState = {
  keyword: "",
  status: "",
  priority: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Partial<FilterState>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer; 