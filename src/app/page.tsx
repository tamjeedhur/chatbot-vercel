import MainPage from "@/components/pages/MainPage";
import React from "react";

export default function Home() {
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <MainPage />
    </div>
  );
}
