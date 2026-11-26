export function AttendanceQr({ large = false }: { large?: boolean }) {
  const cells = Array.from({ length: 225 }, (_, index) => {
    const row = Math.floor(index / 15);
    const column = index % 15;
    const finder =
      (row < 5 && column < 5) ||
      (row < 5 && column > 9) ||
      (row > 9 && column < 5);
    return finder || (row * 7 + column * 11 + row * column) % 5 < 2;
  });

  return (
    <div
      className={`grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[2px] rounded-2xl bg-white p-4 shadow-card ${
        large ? "size-[min(72vw,34rem)]" : "size-64"
      }`}
    >
      {cells.map((filled, index) => (
        <span key={index} className={filled ? "bg-ink" : "bg-white"} />
      ))}
    </div>
  );
}
