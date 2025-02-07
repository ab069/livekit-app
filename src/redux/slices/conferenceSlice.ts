import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the initial state structure using TypeScript interfaces
interface ConferenceState {
  roomName: string;
  hq: string;
}

const initialState: ConferenceState = {
  roomName: "",
  hq: "",
};

// Create slice with typed actions and state
export const conferenceSlice = createSlice({
  name: "conference",
  initialState,
  reducers: {
    setRoomName: (state, action: PayloadAction<string>) => {
      state.roomName = action.payload;
    },
   
    setHq: (state, action: PayloadAction<string>) => {
      state.hq = action.payload;
    },
  },
});

// Export actions for use in components
export const { setRoomName, setHq } = conferenceSlice.actions;

export default conferenceSlice.reducer;
