import { Button } from "@/components/ui/button";
import { Pause, Play, Square, Volume2 } from "lucide-react";

export function SessionControls() {
  return (
    <div className="grid grid-cols-4 gap-2">
      <Button
        variant="outline"
        className="h-[84px] rounded-[53px] border-[#E0E0E0] text-[20px] font-normal"
      >
        <Pause className="mr-2 h-5 w-5" />
        Pause
      </Button>

      <Button
        variant="outline"
        className="h-[84px] rounded-[53px] border-[#E0E0E0] text-[20px] font-normal"
      >
        <Play className="mr-2 h-5 w-5 text-[#4F2BB1]" fill="#4F2BB1" />
        Watch Demo
      </Button>

      <Button className="h-[84px] rounded-[53px] bg-[#4F2BB1] text-[20px] font-normal text-white hover:bg-[#3F2292]">
        <Volume2 className="mr-2 h-5 w-5" />
        Voice Instruction
      </Button>

      <Button
        variant="outline"
        className="h-[84px] rounded-[53px] border-[#ED3A3A] text-[20px] font-normal text-[#ED3A3A] hover:text-[#ED3A3A]"
      >
        <Square className="mr-2 h-5 w-5" fill="#ED3A3A" />
        End Session
      </Button>
    </div>
  );
}