"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setRoomName, setHq } from "../../redux/slices/conferenceSlice";
import { RootState, AppDispatch } from "../../redux/store";
import { v4 as uuidv4 } from "uuid";

const Conference = () => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch(); // Typed dispatch
  const { roomName, hq } = useSelector((state: RootState) => state.conference); // Typed selector

  // If roomName is not set by the user, generate one
  const roomNameToUse = roomName.trim() !== "" ? roomName : uuidv4().slice(0, 8);

  const handleStartCall = () => {
    // Build query params
    dispatch(setRoomName(roomName||roomNameToUse));
    const queryParams = new URLSearchParams();
    if (hq) queryParams.append("hq", hq);

    // Navigate to the room page with parameters
    router.push(`/room/${roomNameToUse}?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-2xl font-bold">Start a Conference Call</h2>

      <input
        type="text"
        placeholder="Enter Room Name"
        value={roomName } // Use either the user's input or the auto-generated room name
        onChange={(e) => dispatch(setRoomName(e.target.value))} // Dispatch the action
        className="border px-4 py-2 rounded-md w-64"
      />

      <select
        value={hq || ""}
        onChange={(e) => dispatch(setHq(e.target.value))} // Dispatch the action
        className="border px-4 py-2 rounded-md w-64"
      >
        <option value="">Select HQ</option>
        <option value="high">High Quality</option>
        <option value="low">Low Quality</option>
      </select>

      <button
        onClick={handleStartCall}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Start Call
      </button>
    </div>
  );
};

export default Conference;
