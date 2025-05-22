import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the API response data
interface DataType {
 Status?: string
}

type ApiState = {
  data: DataType | null;
  loading: boolean;
};

const initialState: ApiState = {
  data: null,
  loading: false,
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    processingData: (state) => {
      state.loading = true;
    },
    processedData: (state, action: PayloadAction<DataType>) => {
      state.data = action.payload;
      state.loading = false;
    },
    processedDataFailure: (state) => {
      state.loading = false;
      state.data = null;
    },
  },
});

export const { processedData, processedDataFailure, processingData } =
  apiSlice.actions;
export default apiSlice.reducer;
