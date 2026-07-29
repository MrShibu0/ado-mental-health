import { cn } from "../../utils/cn";

export const Card = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn("bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden", className)} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn("px-6 py-5 border-b border-gray-100", className)} {...props}>
      {children}
    </div>
  );
};

export const CardBody = ({ className, children, ...props }) => {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
};
