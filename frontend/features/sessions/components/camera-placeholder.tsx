export function CameraPlaceholder() {
  return (
    <div className="relative h-[620px] overflow-hidden rounded-2xl bg-[#F7F4F2]">
      <div className="absolute left-5 top-5 rounded-full bg-black/60 px-4 py-2 text-sm font-semibold text-white">
        ● Live
      </div>

      <div className="flex h-full items-center justify-center text-center">
        <div>
          <div className="text-[120px]">📷</div>
          <p className="mt-4 text-2xl font-semibold text-[#1E1E1E]">
            Camera preview will appear here
          </p>
          <p className="mt-2 text-lg text-[#666666]">
            Motion tracking will start when camera access is enabled.
          </p>
        </div>
      </div>

      <div className="absolute bottom-5 left-5 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
        Camera • Front View
      </div>

      <div className="absolute bottom-5 right-5 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
        Full Screen
      </div>
    </div>
  );
}