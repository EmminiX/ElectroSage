'use client';

import { useEffect, useState } from 'react';
import { debugPlausible } from '@/components/Analytics';

export default function PlausibleDebug() {
  const [debugInfo, setDebugInfo] = useState<{
    domain: string;
    expectedDomain: string;
    plausibleLoaded: boolean;
    scriptFound: boolean;
    scriptSrc: string | null;
    currentUrl: string;
  } | null>(null);

  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setTimeout(() => {
        const script = document.querySelector('[data-domain="electrosage.emmi.zone"]');
        setDebugInfo({
          domain: window.location.hostname,
          expectedDomain: 'electrosage.emmi.zone',
          plausibleLoaded: typeof window.plausible === 'function',
          scriptFound: !!script,
          scriptSrc: script?.getAttribute('src') || null,
          currentUrl: window.location.href,
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Only show in development or when debugging
  if (process.env.NODE_ENV === 'production' && !showDebug) {
    return null;
  }

  if (!debugInfo) {
    return (
      <div className="fixed bottom-4 left-4 z-50 bg-gray-800 text-white p-3 rounded-lg text-xs">
        Loading Plausible debug info...
      </div>
    );
  }

  const isLocalhost = debugInfo.domain === 'localhost' || debugInfo.domain.includes('127.0.0.1');
  const domainMismatch = debugInfo.domain !== debugInfo.expectedDomain && !isLocalhost;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-sm text-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Plausible Analytics Debug</h3>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Current Domain:</span>
          <span className={domainMismatch ? 'text-red-400' : 'text-green-400'}>
            {debugInfo.domain}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Expected Domain:</span>
          <span className="text-blue-400">{debugInfo.expectedDomain}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Script Loaded:</span>
          <span className={debugInfo.scriptFound ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.scriptFound ? '✅' : '❌'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Plausible Function:</span>
          <span className={debugInfo.plausibleLoaded ? 'text-green-400' : 'text-red-400'}>
            {debugInfo.plausibleLoaded ? '✅' : '❌'}
          </span>
        </div>
        
        {debugInfo.scriptSrc && (
          <div className="mt-2 pt-2 border-t border-gray-700">
            <div className="text-gray-400">Script Source:</div>
            <div className="text-blue-400 break-all">{debugInfo.scriptSrc}</div>
          </div>
        )}
        
        {isLocalhost && (
          <div className="mt-2 pt-2 border-t border-gray-700 text-yellow-400">
            ⚠️ Running on localhost - analytics may not track in development
          </div>
        )}
        
        {domainMismatch && !isLocalhost && (
          <div className="mt-2 pt-2 border-t border-gray-700 text-red-400">
            ⚠️ Domain mismatch! Analytics will not track correctly.
          </div>
        )}
        
        <div className="mt-3 pt-2 border-t border-gray-700">
          <button
            onClick={debugPlausible}
            className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white"
          >
            Test Plausible
          </button>
        </div>
      </div>
    </div>
  );
}

// Development-only component
export function PlausibleDevDebug() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return <PlausibleDebug />;
}