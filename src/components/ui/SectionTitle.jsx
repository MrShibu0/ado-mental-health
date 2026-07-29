import { cn } from "../../utils/cn";

export const SectionTitle = ({ title, subtitle, centered = false, className }) => {
  return (
    <div className={cn("max-w-3xl", centered && "mx-auto text-center", className)}>
      <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-8 text-muted">
          {subtitle}
        </p>
      )}
    </div>
  );
};
