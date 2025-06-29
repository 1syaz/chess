export function getFiles(color: "w" | "b", colIdx: number) {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  // return color === "w" ? files[colIdx] : files[7 - colIdx];
  return files[colIdx];
}

export function getRanks(color: "w" | "b", rowIdx: number) {
  // return color === "w" ? 8 - rowIdx : 1 + rowIdx;
  return 8 - rowIdx;
}

export function getChessBoardColor(rowIdx: number, colIdx: number) {
  if ((rowIdx + colIdx) % 2 === 0) {
    return "bg-[#E6D0AE]";
  } else {
    return "bg-[#AE835F]";
  }
}
