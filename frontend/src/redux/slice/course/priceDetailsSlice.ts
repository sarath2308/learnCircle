import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface IPriceDetailsState
{
    price: number;
    discount:number;
    type: "Free" | "Paid",
}

 const initialState: IPriceDetailsState = {
    price:0,
    discount:0,
    type: "Free"
}

const priceDetailsSlice = createSlice({
  name: "priceDetails",
  initialState,
  reducers: {
    setPriceDetails: (state, action: PayloadAction<Partial<IPriceDetailsState>>) => {
      Object.assign(state, action.payload); 
    },

    resetPriceDetails: () => initialState
  },
});

export const { setPriceDetails, resetPriceDetails } = priceDetailsSlice.actions;
export default priceDetailsSlice.reducer;