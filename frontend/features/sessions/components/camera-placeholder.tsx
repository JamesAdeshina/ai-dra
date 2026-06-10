import { Maximize2, Video, Volume2 } from "lucide-react";

export function CameraPlaceholder() {
  return (
    <div className="relative h-[689px] overflow-hidden bg-[#1E1E1E]">
      <div className="absolute inset-0 bg-[url('/images/session-preview.png')] bg-cover bg-center" />

      <div className="absolute left-5 top-4 flex items-center gap-2 rounded-full bg-black/30 px-4 py-3">
        <span className="h-[18px] w-[18px] rounded-full bg-[#54D060]" />
        <span className="text-[16px] font-semibold text-white">Live</span>
      </div>

      <div className="absolute left-1/2 top-[21px] flex -translate-x-1/2 items-center gap-3 rounded-[24px] bg-[#40C057] px-5 py-4 text-black">
        <Volume2 size={24} />
        <span className="text-[17px] font-semibold">
          Raise your right arm a little higher
        </span>
      </div>

      <div className="absolute left-[38%] top-[32%] h-[340px] w-[280px]">
        <div className="absolute left-8 top-8 h-[360px] w-[3px] rotate-[-3deg] bg-[#06FA0A]" />
        <div className="absolute left-8 top-8 h-[3px] w-[270px] rotate-[-6deg] bg-[#06FA0A]" />

        {[
          "left-[28px] top-[20px]",
          "left-[150px] top-[10px]",
          "left-[270px] top-[-5px]",
          "left-[30px] top-[105px]",
          "left-[35px] top-[190px]",
          "left-[45px] top-[305px]",
        ].map((position) => (
          <span
            key={position}
            className={`absolute ${position} h-[18px] w-[18px] rounded-full bg-[#D9D9D9]`}
          />
        ))}
      </div>

      <div className="absolute bottom-4 left-4 flex items-start gap-2 rounded-[24px] bg-black/30 px-4 py-3">
        <Video size={18} className="text-white" />
        <div>
          <p className="text-[16px] font-semibold text-white">Camera</p>
          <p className="text-[13px] font-medium text-[#7875FB]">Front View</p>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-[24px] bg-black/30 px-4 py-3 text-white">
        <span className="text-[16px] font-semibold">Full Screen</span>
        <Maximize2 size={14} />
      </div>
    </div>
  );
}