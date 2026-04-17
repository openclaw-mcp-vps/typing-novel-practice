import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", {
  variants: {
    variant: {
      default: "bg-[var(--accent)]/15 text-[#9ec3ff]",
      success: "bg-[var(--success)]/15 text-[#8ce99a]",
      danger: "bg-[var(--danger)]/15 text-[#ff9b94]"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
