import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ProfileSettingsProps = {
  hasData?: boolean;
};

export function ProfileSettings({ hasData = false }: ProfileSettingsProps) {
  return (
    <div>
      <h1 className="text-[40px] font-bold text-[#1E1E1E]">
        Profile Settings
      </h1>
      <p className="mt-1 text-[20px] text-[#1E1E1E]">
        Manage your personal information.
      </p>

      <div className="mt-8 rounded-2xl bg-white p-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-[#666666]">First name</label>
            <Input className="mt-2 h-16 rounded-xl" defaultValue="William" />
          </div>

          <div>
            <label className="text-sm text-[#666666]">Last name</label>
            <Input className="mt-2 h-16 rounded-xl" defaultValue="Carter" />
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm text-[#666666]">Email Address</label>
          <Input
            className="mt-2 h-16 rounded-xl"
            defaultValue="williamcarter@mail.com"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-[#666666]">Date of Birth</label>
          <Input
            className="mt-2 h-16 rounded-xl"
            defaultValue="15 March 1962"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-[#666666]">Emergency Contact</label>
          <Input
            className="mt-2 h-16 rounded-xl"
            defaultValue="William Johnson (+44 7123 987654)"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-[#666666]">Phone Number</label>
          <Input
            className="mt-2 h-16 rounded-xl"
            placeholder="Enter your phone number"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-[#666666]">Password</label>
          <div className="relative mt-2">
            <Input
              className="h-16 rounded-xl pr-16"
              placeholder="Enter your password"
              type="password"
            />
            <button className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold">
              Show
            </button>
          </div>
        </div>

        <Button className="mt-5 h-14 rounded-full bg-[#592EBD] px-10 text-[16px] hover:bg-[#4B24A8]">
          Save Changes
        </Button>
      </div>
    </div>
  );
}