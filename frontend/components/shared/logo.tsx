import Image from "next/image";

export function Logo() {
  return (
    <div className="flex items-center gap-3">
        <Image
          src="/images/logo.svg"
          alt="AI-DRA Logo"
          width={44}
          height={44}
        />

      <div>
        <h1 className="text-xl font-bold text-purple-700">AI-DRA</h1>
        <p className="text-xs text-muted-foreground">
          Digital Rehabilitation Assistant
        </p>
      </div>
    </div>
  );
}