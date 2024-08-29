import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CategoryModel {
    name: string;
    id: string;
    open: boolean;
    items: { id: string; name: string; description: string; price: string; availability: boolean }[];
}

const initialState: CategoryModel[] = [];

export const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {
        setCategoryList: (state, action: PayloadAction<CategoryModel[]>) => {
            return action.payload;
        },
    },
});

export const { setCategoryList } = menuSlice.actions;
export const menuReducer = menuSlice.reducer;
