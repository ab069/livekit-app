"use client"
// app/page.tsx
import Conference from "@/app/Conference/page"; // Your Conference component
import styles from "../styles/Home.module.css"; // Optional styles

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen">
      <Conference />
    </main>
  );
}
