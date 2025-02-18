export interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  onClick?: () => void;
  className?: string;
  trend?: { value: number; isPositive: boolean };
}