"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Conference = () => {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [region, setRegion] = useState("");
  const [hq, setHq] = useState("");

  const handleStartCall = () => {
    // Use user input or generate a random room ID
    const finalRoomName = roomName.trim() !== "" ? roomName : uuidv4().slice(0, 8);

    // Build query params
    const queryParams = new URLSearchParams();
    if (region) queryParams.append("region", region);
    if (hq) queryParams.append("hq", hq);

    // Navigate to the room page with parameters
    router.push(`/room/${finalRoomName}?${queryParams.toString()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <h2 className="text-2xl font-bold">Start a Conference Call</h2>

      <input
        type="text"
        placeholder="Enter Room Name (optional)"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        className="border px-4 py-2 rounded-md w-64"
      />

      <select 
        value={region} 
        onChange={(e) => setRegion(e.target.value)} 
        className="border px-4 py-2 rounded-md w-64"
      >
        <option value="">Select Region</option>
        <option value="us">US</option>
        <option value="eu">EU</option>
      </select>

      <select 
        value={hq} 
        onChange={(e) => setHq(e.target.value)} 
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
