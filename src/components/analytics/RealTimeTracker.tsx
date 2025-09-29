import { useEffect } from 'react';

interface RealTimeTrackerProps {
  onPageView?: (data: any) => void;
}

export default function RealTimeTracker({ onPageView }: RealTimeTrackerProps) {
  useEffect(() => {
    // Generate or get session ID
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }

    const trackPageView = async () => {
      try {
        const pageData = {
          page: window.location.pathname,
          referrer: document.referrer,
          load_time: Math.round(performance.now()),
          session_id: sessionId,
          timestamp: new Date().toISOString(),
          screen_resolution: `${screen.width}x${screen.height}`,
          user_agent: navigator.userAgent
        };

        // Send to analytics backend
        const response = await fetch('https://functions.poehali.dev/b4a8335f-97d5-40b2-8822-bbd82fb1cb22', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(pageData)
        });

        if (response.ok && onPageView) {
          const result = await response.json();
          onPageView(result);
        }
      } catch (error) {
        console.log('Analytics tracking failed:', error);
      }
    };

    // Track initial page load
    trackPageView();

    // Track navigation changes (SPA)
    const handlePopState = () => trackPageView();
    window.addEventListener('popstate', handlePopState);

    // Track when user leaves page
    const handleBeforeUnload = () => {
      navigator.sendBeacon(
        'https://functions.poehali.dev/b4a8335f-97d5-40b2-8822-bbd82fb1cb22',
        JSON.stringify({
          page: window.location.pathname,
          event: 'page_exit',
          session_id: sessionId,
          session_time: Math.round(performance.now())
        })
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [onPageView]);

  return null; // This component doesn't render anything
}