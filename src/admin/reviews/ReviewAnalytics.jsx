import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseService';

const StatCard = ({ title, value, icon, change }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <div className="flex items-center">
      <div className="p-3 rounded-lg bg-[#690d89]/10 text-[#690d89]">
        {icon}
      </div>
      <div className="ml-5">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-xl font-semibold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}% from last month
          </p>
        )}
      </div>
    </div>
  </div>
);

const RatingDistribution = ({ ratings }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
    <div className="space-y-4">
      {[5, 4, 3, 2, 1].map(rating => {
        const count = ratings[rating] || 0;
        const percentage = (count / Object.values(ratings).reduce((a, b) => a + b, 0)) * 100;
        
        return (
          <div key={rating} className="flex items-center">
            <div className="w-12 text-sm text-gray-600">{rating} stars</div>
            <div className="flex-1 mx-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-[#690d89] rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-sm text-gray-600">{count}</div>
          </div>
        );
      })}
    </div>
  </div>
);

const ReviewTrends = ({ trends }) => (
  <div className="bg-white rounded-xl p-6 shadow-lg">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Review Trends</h3>
    <div className="h-64">
      {/* Add your preferred charting library here */}
      <p className="text-gray-500">Review volume over time chart would go here</p>
    </div>
  </div>
);

export default function ReviewAnalytics() {
  const [stats, setStats] = useState({
    total: 0,
    average: 0,
    responseRate: 0,
    ratings: {},
    trends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      
      const { data: reviews, error } = await supabase
        .from('cms_testimonials')
        .select('*');

      if (error) throw error;

      // Calculate statistics
      const total = reviews.length;
      const average = reviews.reduce((acc, review) => acc + review.rating, 0) / total;
      const responseRate = (reviews.filter(r => r.response).length / total) * 100;
      
      // Calculate rating distribution
      const ratings = reviews.reduce((acc, review) => {
        acc[review.rating] = (acc[review.rating] || 0) + 1;
        return acc;
      }, {});

      // Calculate trends (simplified)
      const trends = []; // You would calculate this based on your needs

      setStats({
        total,
        average,
        responseRate,
        ratings,
        trends
      });
    } catch (error) {
      console.error('Error loading review stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Review Analytics</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Reviews"
          value={stats.total}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          }
          change={8}
        />
        <StatCard
          title="Average Rating"
          value={stats.average.toFixed(1)}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          change={2}
        />
        <StatCard
          title="Response Rate"
          value={`${stats.responseRate.toFixed(0)}%`}
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
          change={5}
        />
        <StatCard
          title="Pending Reviews"
          value="12"
          icon={
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          change={-3}
        />
      </div>

      {/* Rating Distribution and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingDistribution ratings={stats.ratings} />
        <ReviewTrends trends={stats.trends} />
      </div>
    </div>
  );
}