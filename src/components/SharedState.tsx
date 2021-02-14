import React, { useContext } from "react";
import { DataContext } from "./posts-page-layout";

export function SharedState() {
  const [sharedData, setSharedData] = useContext(DataContext);

  const { h, evidenceGivenH, evidenceGivenNotH } = sharedData;

  return (
    <div>
      <div>P(H): {h}</div>
      <div>P(E | H): {evidenceGivenH}</div>
      <div>P(E | not H): {evidenceGivenNotH}</div>
    </div>
  );
}
