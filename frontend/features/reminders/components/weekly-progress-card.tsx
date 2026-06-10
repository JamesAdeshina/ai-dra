export function WeeklyProgressCard() {
  return (
    <div className="rounded-2xl bg-white p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Weekly Progress</h3>

        <button className="text-sm text-[#7875FB]">
          View Progress
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-[#9E9E9E]">Sessions Completed</p>
          <p className="mt-2 text-3xl font-bold">3/5</p>
          <p className="text-sm text-[#9E9E9E]">Sessions</p>
        </div>

        <div>
          <p className="text-xs text-[#9E9E9E]">Weekly Goal</p>
          <p className="mt-2 text-3xl font-bold">30</p>
          <p className="text-sm text-[#9E9E9E]">Minutes</p>
        </div>

        <div>
          <p className="text-xs text-[#9E9E9E]">Current Streak</p>
          <p className="mt-2 text-3xl font-bold">3</p>
          <p className="text-sm text-[#9E9E9E]">Days</p>
        </div>
      </div>

      <div className="mt-6 h-3 rounded-full bg-[#F5F5F5]">
        <div className="h-3 w-[60%] rounded-full bg-[#592EBD]" />
      </div>

      <div className="mt-2 flex justify-between text-xs text-[#9E9E9E]">
        <span>60% of weekly goal</span>
        <span>2 sessions remaining</span>
      </div>
    </div>
  );
}