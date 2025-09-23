import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, Eye, PhoneCall, Download, Search } from 'lucide-react';

const SEODashboard = () => {
  const [analytics, setAnalytics] = useState({
    pageViews: 0,
    uniqueVisitors: 0,
    inquiries: 0,
    phoneClicks: 0,
    catalogDownloads: 0,
    searchImpressions: 0,
    organicTraffic: 0,
    conversionRate: 0
  });

  const [searchRankings, setSearchRankings] = useState([
    { keyword: 'steel furniture Nepal', position: 'Not ranked', searches: 1200 },
    { keyword: 'furniture Biratnagar', position: 'Not ranked', searches: 800 },
    { keyword: 'office furniture Nepal', position: 'Not ranked', searches: 600 },
    { keyword: 'affordable furniture Nepal', position: 'Not ranked', searches: 500 },
    { keyword: 'best furniture Biratnagar', position: 'Not ranked', searches: 400 }
  ]);

  useEffect(() => {
    // Simulate analytics data - replace with real API calls
    const loadAnalytics = () => {
      // This would typically come from Google Analytics API
      setAnalytics({
        pageViews: Math.floor(Math.random() * 1000) + 500,
        uniqueVisitors: Math.floor(Math.random() * 500) + 200,
        inquiries: Math.floor(Math.random() * 50) + 10,
        phoneClicks: Math.floor(Math.random() * 30) + 5,
        catalogDownloads: Math.floor(Math.random() * 20) + 3,
        searchImpressions: Math.floor(Math.random() * 5000) + 2000,
        organicTraffic: Math.floor(Math.random() * 300) + 100,
        conversionRate: (Math.random() * 5 + 2).toFixed(2)
      });
    };

    loadAnalytics();
    const interval = setInterval(loadAnalytics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkSearchRankings = async () => {
    // This would typically use Google Search Console API or a third-party SEO tool
    // For now, we'll simulate some improvements
    setSearchRankings(prev => prev.map(item => ({
      ...item,
      position: Math.floor(Math.random() * 50) + 1
    })));
  };

  const metrics = [
    {
      title: 'Page Views',
      value: analytics.pageViews.toLocaleString(),
      icon: Eye,
      color: 'text-blue-600',
      change: '+12%'
    },
    {
      title: 'Unique Visitors',
      value: analytics.uniqueVisitors.toLocaleString(),
      icon: Users,
      color: 'text-green-600',
      change: '+8%'
    },
    {
      title: 'Inquiries',
      value: analytics.inquiries.toLocaleString(),
      icon: TrendingUp,
      color: 'text-purple-600',
      change: '+15%'
    },
    {
      title: 'Phone Clicks',
      value: analytics.phoneClicks.toLocaleString(),
      icon: PhoneCall,
      color: 'text-orange-600',
      change: '+5%'
    },
    {
      title: 'Catalog Downloads',
      value: analytics.catalogDownloads.toLocaleString(),
      icon: Download,
      color: 'text-indigo-600',
      change: '+20%'
    },
    {
      title: 'Search Impressions',
      value: analytics.searchImpressions.toLocaleString(),
      icon: Search,
      color: 'text-red-600',
      change: '+25%'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">SEO Performance Dashboard</h1>
        <button 
          onClick={checkSearchRankings}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Check Rankings
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <Card key={index} className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {metric.title}
              </CardTitle>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
              <p className="text-xs text-green-600 mt-1">
                {metric.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search Rankings */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Keyword Rankings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium text-gray-600">Keyword</th>
                  <th className="text-left py-2 font-medium text-gray-600">Position</th>
                  <th className="text-left py-2 font-medium text-gray-600">Monthly Searches</th>
                  <th className="text-left py-2 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {searchRankings.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 font-medium text-gray-900">{item.keyword}</td>
                    <td className="py-3">
                      {typeof item.position === 'number' ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.position <= 10 ? 'bg-green-100 text-green-800' :
                          item.position <= 30 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          #{item.position}
                        </span>
                      ) : (
                        <span className="text-gray-500">{item.position}</span>
                      )}
                    </td>
                    <td className="py-3 text-gray-600">{item.searches.toLocaleString()}</td>
                    <td className="py-3">
                      {typeof item.position === 'number' ? (
                        item.position <= 10 ? (
                          <span className="text-green-600 font-medium">Great</span>
                        ) : item.position <= 30 ? (
                          <span className="text-yellow-600 font-medium">Good</span>
                        ) : (
                          <span className="text-orange-600 font-medium">Needs Work</span>
                        )
                      ) : (
                        <span className="text-gray-500">Not Tracking</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SEO Recommendations */}
      <Card className="bg-white shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            SEO Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Local SEO</h3>
              <p className="text-gray-600 text-sm">
                Submit your business to Google My Business and local directories in Nepal.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900">Content Marketing</h3>
              <p className="text-gray-600 text-sm">
                Create blog posts about furniture care, office setup tips, and local interior design trends.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">Social Signals</h3>
              <p className="text-gray-600 text-sm">
                Increase social media presence on Facebook and Instagram with furniture showcase posts.
              </p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-gray-900">Mobile Optimization</h3>
              <p className="text-gray-600 text-sm">
                Continue optimizing for mobile users as they represent 70% of furniture shoppers in Nepal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEODashboard;
