'use client';

import { useEffect, useState } from 'react';
import { debugPlausible, trackEvent } from './Analytics';

export default function ProductionAnalyticsTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runAnalyticsTest = () => {
    addResult('🚀 Starting Plausible Analytics Test...');
    
    // Check if we're on production domain
    const currentDomain = window.location.hostname;
    addResult(`📍 Current domain: ${currentDomain}`);
    
    if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
      addResult('⚠️ Running on localhost - Plausible will ignore events');
    } else if (currentDomain === 'electrosage.emmi.zone') {
      addResult('✅ Running on production domain');
    } else {
      addResult(`🤔 Unknown domain: ${currentDomain}`);
    }

    // Run debug function
    debugPlausible();
    
    // Test event sending
    setTimeout(() => {
      if (window.plausible) {
        addResult('✅ Plausible function available - sending test event');
        try {
          window.plausible('Analytics Test', { 
            props: { 
              timestamp: Date.now(),
              domain: currentDomain,
              test: 'production-verification'
            } 
          });
          addResult('✅ Test event sent successfully');
        } catch (error) {
          addResult(`❌ Failed to send test event: ${error}`);
        }
      } else {
        addResult('❌ Plausible function not available');
      }
    }, 1000);

    // Test multiple events
    setTimeout(() => {
      trackEvent('Page View Test', { source: 'manual-test' });
      trackEvent('Feature Test', { feature: 'analytics-debugging' });
      addResult('🎯 Additional test events sent');
    }, 2000);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  // Auto-run test on production domains
  useEffect(() => {
    const domain = window.location.hostname;
    if (domain === 'electrosage.emmi.zone') {
      setTimeout(() => {
        runAnalyticsTest();
      }, 3000); // Wait for Plausible to load
    }
  }, []);

  if (!isVisible && window.location.hostname === 'localhost') {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors text-sm"
      >
        🔍 Analytics Test
      </button>
    );
  }

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-hidden z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          📊 Analytics Test Panel
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2 mb-3">
        <button
          onClick={runAnalyticsTest}
          className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          🚀 Run Test
        </button>
        <button
          onClick={clearResults}
          className="w-full bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors"
        >
          🗑️ Clear Results
        </button>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Test Results ({testResults.length} entries):
        </div>
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-2 max-h-48 overflow-y-auto text-xs space-y-1">
          {testResults.length === 0 ? (
            <div className="text-gray-500 italic">No test results yet</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-gray-700 dark:text-gray-300 font-mono">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
        💡 Check browser console for detailed debug info
      </div>
    </div>
  );
}