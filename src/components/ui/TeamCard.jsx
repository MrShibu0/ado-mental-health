import { useTranslation } from "react-i18next";
import { User } from "lucide-react";
import { cn } from "../../utils/cn";

export const TeamCard = ({ member, className }) => {
  const { t } = useTranslation('team');
  return (
    <div className={cn("flex flex-col items-center bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-shadow hover:shadow-lg", className)}>
      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-white shadow-md bg-slate-100 flex items-center justify-center text-slate-400">
        {member.image ? (
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-16 h-16" />
        )}
      </div>
      <h3 className="text-xl font-bold text-primary text-center mb-1">{member.name}</h3>
      <p className="text-teal font-medium text-sm text-center mb-2">
        {member.roleKey ? t(`roles.${member.roleKey}`) : member.role}
      </p>
      <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-600 border border-gray-200">
        {t(`departments.${member.department}`, { defaultValue: member.department })}
      </span>
    </div>
  );
};
