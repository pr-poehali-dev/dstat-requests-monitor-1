import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface MetricsCardProps {
  title: string;
  value: string;
  icon: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  status?: 'healthy' | 'warning' | 'error';
}

export default function MetricsCard({
  title,
  value,
  icon,
  trend = 'stable',
  trendValue,
  status = 'healthy'
}: MetricsCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return 'TrendingUp';
      case 'down': return 'TrendingDown';
      default: return 'Minus';
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-dashboard-green';
      case 'down': return 'text-dashboard-red';
      default: return 'text-gray-500';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'healthy': return 'bg-dashboard-green';
      case 'warning': return 'bg-dashboard-red';
      case 'error': return 'bg-red-600';
      default: return 'bg-dashboard-green';
    }
  };

  return (
    <Card className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <div className={`absolute top-0 left-0 w-full h-1 ${getStatusColor()}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon name={icon} size={20} className="text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline space-x-3">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {trendValue && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              <Icon name={getTrendIcon()} size={14} />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <div className="mt-2">
          <Badge variant="outline" className={`text-xs ${getStatusColor().replace('bg-', 'text-')} border-current`}>
            {status === 'healthy' ? 'Healthy' : status === 'warning' ? 'Warning' : 'Error'}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}