import {
  FileText,
  CalendarDays,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";

const iconMap = {
  reports: FileText,
  appointments: CalendarDays,
  messages: MessageSquare,
  alerts: AlertTriangle,
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  type = "default",
}) => {
  const Icon =
    typeof icon === "string"
      ? iconMap[icon]
      : icon;

  return (
    <div className={`stat-card stat-card-${type}`}>
      <div className="stat-icon">
        {Icon && (
          <Icon
            size={25}
            strokeWidth={1.7}
          />
        )}
      </div>

      <div className="stat-content">
        <span className="stat-title">
          {title}
        </span>

        <strong className="stat-value">
          {value}
        </strong>

        <span className="stat-subtitle">
          {subtitle}
        </span>
      </div>
    </div>
  );
};

export default StatCard;