import React, { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import authService from '../../services/authService';

const AdminDebugPanel = () => {
  const [debugInfo, setDebugInfo] = useState({});
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    const info = {};

    // Environment info
    info.environment = {
      NODE_ENV: process.env.NODE_ENV,
      REACT_APP_API_URL: process.env.REACT_APP_API_URL,
      timestamp: new Date().toISOString()
    };

    // Auth info
    const token = authService.getToken();
    info.auth = {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      user: authService.getCurrentUser()
    };

    // API connectivity test
    try {
      console.log('Testing API connectivity...');
      const response = await productAPI.getAll(1, 5);
      info.api = {
        connected: true,
        response: {
          hasData: !!response.data,
          dataType: Array.isArray(response.data) ? 'array' : typeof response.data,
          productCount: response.data?.products?.length || response.data?.length || 0,
          sampleProduct: response.data?.products?.[0] || response.data?.[0] || null
        }
      };
    } catch (error) {
      info.api = {
        connected: false,
        error: {
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 3),
          name: error.name
        }
      };
    }

    // Direct fetch test
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const directResponse = await fetch(`${apiUrl}/products?limit=2`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      info.directFetch = {
        status: directResponse.status,
        ok: directResponse.ok,
        url: directResponse.url,
        data: directResponse.ok ? await directResponse.json() : null
      };
    } catch (error) {
      info.directFetch = {
        error: error.message
      };
    }

    setDebugInfo(info);
    setLoading(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700">🔧 Admin Debug Panel</h3>
        <button
          onClick={runDiagnostics}
          disabled={loading}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Re-test'}
        </button>
      </div>
      
      <div className="space-y-3 text-xs">
        {/* Environment */}
        <div className="bg-white p-2 rounded border">
          <h4 className="font-medium text-gray-800 mb-1">Environment</h4>
          <pre className="text-gray-600 overflow-x-auto">
            {JSON.stringify(debugInfo.environment, null, 2)}
          </pre>
        </div>

        {/* Authentication */}
        <div className="bg-white p-2 rounded border">
          <h4 className="font-medium text-gray-800 mb-1">Authentication</h4>
          <div className="text-gray-600">
            <p>• Token Present: {debugInfo.auth?.hasToken ? '✅ Yes' : '❌ No'}</p>
            <p>• User: {debugInfo.auth?.user?.name || 'Not logged in'}</p>
            <p>• Role: {debugInfo.auth?.user?.role || 'Unknown'}</p>
          </div>
        </div>

        {/* API Test */}
        <div className="bg-white p-2 rounded border">
          <h4 className="font-medium text-gray-800 mb-1">
            API Connection {debugInfo.api?.connected ? '✅' : '❌'}
          </h4>
          {debugInfo.api?.connected ? (
            <div className="text-gray-600">
              <p>• Products Found: {debugInfo.api.response.productCount}</p>
              <p>• Data Type: {debugInfo.api.response.dataType}</p>
              {debugInfo.api.response.sampleProduct && (
                <details>
                  <summary className="cursor-pointer">Sample Product</summary>
                  <pre className="mt-1 overflow-x-auto">
                    {JSON.stringify(debugInfo.api.response.sampleProduct, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ) : (
            <div className="text-red-600">
              <p>• Error: {debugInfo.api?.error?.message}</p>
            </div>
          )}
        </div>

        {/* Direct Fetch Test */}
        <div className="bg-white p-2 rounded border">
          <h4 className="font-medium text-gray-800 mb-1">
            Direct Fetch {debugInfo.directFetch?.ok ? '✅' : '❌'}
          </h4>
          <div className="text-gray-600">
            <p>• Status: {debugInfo.directFetch?.status}</p>
            <p>• URL: {debugInfo.directFetch?.url}</p>
            {debugInfo.directFetch?.data && (
              <p>• Products: {debugInfo.directFetch.data.products?.length || debugInfo.directFetch.data.length || 0}</p>
            )}
            {debugInfo.directFetch?.error && (
              <p className="text-red-600">• Error: {debugInfo.directFetch.error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDebugPanel;
