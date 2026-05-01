import { cn } from "@/lib/utils";
export const InlineInput = ({
  className,
  emptyHidePrint,
  value,
  ...props
}: any) => (
  <input
    autoComplete="off"
    value={value ?? ""} // 🔥 critical fix
    className={cn(
      "bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded transition-colors px-1 -mx-1 w-full placeholder-gray-400 print:placeholder-transparent",
      emptyHidePrint && !value ? "print:hidden" : "",
      className
    )}
    {...props}
  />
);
export const InlineTextarea = ({
  className,
  emptyHidePrint,
  ...props
}: any) => (
  <textarea
    className={cn(
      "bg-transparent hover:bg-slate-50 focus:bg-blue-50 focus:outline-none focus:ring-1 focus:ring-blue-500/50 rounded transition-colors px-1 -mx-1 w-full resize-none placeholder-gray-400 print:placeholder-transparent",
      emptyHidePrint && !props.value ? "print:hidden" : "",
      className
    )}
    {...props}
  />
);
