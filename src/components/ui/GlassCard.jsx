import { cn } from "../../utils/cn";

export const GlassCard = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("glass rounded-2xl p-8 relative overflow-hidden group", className)} 
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
