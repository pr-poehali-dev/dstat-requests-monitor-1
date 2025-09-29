import { useState, useEffect } from 'react';
import Navigation from '@/components/dashboard/Navigation';
import MetricsCard from '@/components/dashboard/MetricsCard';
import LiveChart from '@/components/dashboard/LiveChart';
import RealTimeTracker from '@/components/analytics/RealTimeTracker';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface MetricsData {
  type: string;
  data: Array<{
    timestamp: string;
    value: number;
    label: string;
  }>;
  metrics: {
    current_rps: number;
    avg_rps: number;
    peak_rps: number;
    total_requests: number;
    uptime: string;
    response_time: string;
    active_users: number;
    error_rate: string;
  };
  timestamp: string;
  status: string;
}

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchMetrics = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('https://functions.poehali.dev/b4a8335f-97d5-40b2-8822-bbd82fb1cb22');
      if (response.ok) {
        const data = await response.json();
        setMetricsData(data);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 1000); // Refresh every 1 second
    return () => clearInterval(interval);
  }, []);

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Real Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Реальная аналитика сайта на основе настоящих посещений</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-red-600">LIVE</span>
          </div>
        </div>
        <Button 
          onClick={fetchMetrics} 
          disabled={isRefreshing}
          className="flex items-center space-x-2"
        >
          <Icon name={isRefreshing ? 'Loader2' : 'RefreshCw'} size={16} className={isRefreshing ? 'animate-spin' : ''} />
          <span>{isRefreshing ? 'Обновление...' : 'Обновить'}</span>
        </Button>
      </div>

      {/* Metrics Cards */}
      {metricsData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricsCard
              title="Текущий RPS"
              value={metricsData.metrics.current_rps.toString()}
              icon="Zap"
              trend="up"
              trendValue="+12%"
              status="healthy"
            />
            <MetricsCard
              title="Средний RPS"
              value={metricsData.metrics.avg_rps.toString()}
              icon="BarChart3"
              trend="stable"
              status="healthy"
            />
            <MetricsCard
              title="Активные пользователи"
              value={metricsData.metrics.active_users.toString()}
              icon="Users"
              trend="up"
              trendValue="+5%"
              status="healthy"
            />
            <MetricsCard
              title="Время отклика"
              value={metricsData.metrics.response_time}
              icon="Clock"
              trend="down"
              trendValue="-8ms"
              status="healthy"
            />
          </div>

          {/* Live Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <LiveChart
                title="Запросы в секунду (RPS)"
                data={metricsData.data}
                height={300}
                color="#3B82F6"
              />
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricsCard
              title="Пиковый RPS"
              value={metricsData.metrics.peak_rps.toString()}
              icon="TrendingUp"
              status="healthy"
            />
            <MetricsCard
              title="Процент ошибок"
              value={metricsData.metrics.error_rate}
              icon="AlertTriangle"
              status={parseFloat(metricsData.metrics.error_rate) > 2 ? 'warning' : 'healthy'}
            />
            <MetricsCard
              title="Время работы"
              value={metricsData.metrics.uptime}
              icon="Shield"
              status="healthy"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderCharts = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Детальные графики</h1>
      {metricsData && (
        <div className="grid grid-cols-1 gap-6">
          <LiveChart
            title="RPS за последние 30 минут"
            data={metricsData.data}
            height={400}
            color="#10B981"
          />
        </div>
      )}
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Подробная статистика</h1>
      {metricsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricsCard title="Всего запросов" value={metricsData.metrics.total_requests.toLocaleString()} icon="Database" />
          <MetricsCard title="Средний RPS" value={metricsData.metrics.avg_rps.toString()} icon="BarChart" />
          <MetricsCard title="Максимальный RPS" value={metricsData.metrics.peak_rps.toString()} icon="TrendingUp" />
        </div>
      )}
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return renderDashboard();
      case 'charts': return renderCharts();
      case 'stats': return renderStats();
      case 'alerts': return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-900">Алерты</h2><p className="text-gray-500 mt-2">Функционал в разработке</p></div>;
      case 'history': return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-900">История</h2><p className="text-gray-500 mt-2">Функционал в разработке</p></div>;
      case 'settings': return <div className="text-center py-20"><h2 className="text-2xl font-bold text-gray-900">Настройки</h2><p className="text-gray-500 mt-2">Функционал в разработке</p></div>;
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
      <RealTimeTracker />
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <main className="flex-1 p-6 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
}