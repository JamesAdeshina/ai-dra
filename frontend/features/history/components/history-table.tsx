const sessions = [
  {
    date: "01 Jun 2026",
    exercises: "Shoulder Flexion, Elbow Flexion",
    score: "82%",
    status: "Partial",
    duration: "25 min",
    notes: "Good progress",
  },
  {
    date: "30 May 2026",
    exercises: "Wrist Extension, Cup to Shelf",
    score: "78%",
    status: "Partial",
    duration: "28 min",
    notes: "Needed extra guidance",
  },
  {
    date: "30 May 2026",
    exercises: "Bilateral Arm Raise, Shoulder Flexion",
    score: "80%",
    status: "Completed",
    duration: "25 min",
    notes: "Great form",
  },
  {
    date: "28 May 2026",
    exercises: "Elbow Flexion, Wrist Extension",
    score: "82%",
    status: "Completed",
    duration: "25 min",
    notes: "Improved shoulder movement",
  },
  {
    date: "28 May 2026",
    exercises: "Shoulder Flexion, Cup to Shelf",
    score: "80%",
    status: "Partial",
    duration: "25 min",
    notes: "Felt tired",
  },
  {
    date: "28 May 2026",
    exercises: "Wrist Extension, Bilateral Arm Raise",
    score: "78%",
    status: "Completed",
    duration: "28 min",
    notes: "Great form",
  },
];

export function HistoryTable() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b bg-white text-[14px] font-semibold text-[#1E1E1E]">
            <th className="px-6 py-5">Date</th>
            <th className="px-6 py-5">Exercises</th>
            <th className="px-6 py-5">Score</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Duration</th>
            <th className="px-6 py-5">Notes</th>
          </tr>
        </thead>

        <tbody>
          {sessions.map((session, index) => (
            <tr
              key={`${session.date}-${index}`}
              className="border-b bg-[#FAFAFA] text-[14px] text-[#1E1E1E]"
            >
              <td className="px-6 py-5">{session.date}</td>
              <td className="px-6 py-5">{session.exercises}</td>
              <td className="px-6 py-5">{session.score}</td>
              <td className="px-6 py-5">
                <span
                  className={
                    session.status === "Completed"
                      ? "text-[#00A651]"
                      : "text-[#F5A94C]"
                  }
                >
                  {session.status}
                </span>
              </td>
              <td className="px-6 py-5">{session.duration}</td>
              <td className="px-6 py-5">{session.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between px-6 py-4 text-[14px]">
        <span>Page 1 of 10</span>

        <div className="flex gap-2">
          <button className="rounded-md border px-4 py-2">Previous</button>
          <button className="rounded-md border px-4 py-2">Next</button>
        </div>
      </div>
    </div>
  );
}