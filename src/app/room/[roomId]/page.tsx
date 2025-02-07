"use client";
import * as React from "react";
import { useSelector } from "react-redux"; // Use Redux to fetch state
import { PageClientImpl } from "./PageClientImpl";

export default function Page() {
  // Retrieve values from Redux store
  const roomName = useSelector((state: any) => state.conference.roomName);
  
  const hq = useSelector((state: any) => state.conference.hq);

  // You can optionally handle missing values (for instance, if they're not set)
  const finalRoomName = roomName || "";
  
  const finalHq = hq || false; // Default to 'false' if HQ is not selected

  console.log("Using Redux state:", finalRoomName, finalHq);

  return (
    <PageClientImpl 
      
    />
  );
}
