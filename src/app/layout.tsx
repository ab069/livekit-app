"use client"
import '../../styles/globals.css';
import '@livekit/components-styles';
import '@livekit/components-styles/prefabs';
// app/layout.tsx

import { Provider } from "react-redux";
import { store } from "../redux/store"; // Your Redux store

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <html lang="en">
        <body>{children}</body>
      </html>
    </Provider>
  );
}
