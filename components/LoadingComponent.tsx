"use client";

type LoaderProps = {
  text?: string;
};

export default function LoadingComponent({
  text = "Loading...",
}: LoaderProps) {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center gap-5 bg-[hsl(var(--background))] px-4">
      {/* Spinner */}
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-[hsl(var(--primary)/0.15)]" />

        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[hsl(var(--primary))] border-r-[hsl(var(--primary))] animate-spin" />
      </div>

      {/* Text */}
      <div className="text-center space-y-1">
        <p className="text-sm font-medium text-[hsl(var(--foreground))]">
          {text}
        </p>

        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Please wait a moment
        </p>
      </div>
    </div>
  );
}