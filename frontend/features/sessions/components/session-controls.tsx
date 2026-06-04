import { Button } from "@/components/ui/button";
import { Pause, Play, Volume2 } from "lucide-react";

export function SessionControls() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <Button variant="outline" className="h-20 rounded-full text-[20px]">
        <Pause className="mr-2 h-5 w-5" />
        Pause
      </Button>

      <Button variant="outline" className="h-20 rounded-full text-[20px]">
        <Play className="mr-2 h-5 w-5" />
        Watch Demo
      </Button>

      <Button className="h-20 rounded-full bg-[#592EBD] text-[20px] hover:bg-[#4B24A8]">
        <Volume2 className="mr-2 h-5 w-5" />
        Voice Instruction
      </Button>

      <Button variant="outline" className="h-20 rounded-full border-red-500 text-[20px] text-red-500">
        End Session
      </Button>
    </div>
  );
}