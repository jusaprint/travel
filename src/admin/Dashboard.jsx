import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './auth/AuthContext';
import { getPackagesFromDB, getCountriesFromDB, getMediaFromDB, getPagesFromDB } from './services/supabaseService';

// Stat card component with loading state
const StatCard = ({ title, value, icon, change, changeType, isLoading }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <div className="flex items-center">
      <div className="flex-shrink-0 p-3 rounded-lg bg-[#690d89]/10 text-[#690d89]">
        {icon}
      </div>
      <div className="ml-5 w-0 flex-1">
        <dl>
          <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
          <dd>
            {isLoading ? (
              <div className="h-8 bg-gray-200 animate-pulse rounded"></div>
            ) : (
              <div className="text-lg font-medium text-gray-900">{value}</div>
            )}
          </dd>
        </dl>
      </div>
    </div>
    {change && !isLoading && (
      <div className={`mt-4 flex items-center text-sm ${
        changeType === 'increase' ? 'text-green-600' : 'text-red-600'
      }`}>
        {changeType === 'increase' ? (
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ) : (
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        )}
        <span>{change} from last month</span>
      </div>
    )}
  </div>
);

// Recent activity item component with loading state
const ActivityItem = ({ title, time, description, icon, isLoading }) => (
  <div className="relative pb-8">
    <div className="relative flex items-start space-x-3">
      {isLoading ? (
        <>
          <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 w-1/4 bg-gray-200 animate-pulse rounded mb-2"></div>
            <div className="h-3 w-1/6 bg-gray-200 animate-pulse rounded mb-3"></div>
            <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </>
      ) : (
        <>
          <div className="relative">
            <div className="h-8 w-8 rounded-full bg-[#690d89]/10 flex items-center justify-center ring-8 ring-white">
              {icon}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div>
              <div className="text-sm">
                <span className="font-medium text-gray-900">{title}</span>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">{time}</p>
            </div>
            <div className="mt-2 text-sm text-gray-700">
              <p>{description}</p>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    packages: 0,
    countries: 0,
    media: 0,
    pages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [packages, countries, media, pages] = await Promise.all([
          getPackagesFromDB(),
          getCountriesFromDB(),
          getMediaFromDB(),
          getPagesFromDB()
        ]);

        setStats({
          packages: packages.length,
          countries: countries.length,
          media: media.length,
          pages: pages.length
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadActivity = async () => {
      try {
        // In a real app, you would fetch this from a dedicated activity log table
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRecentActivity([
          {
            title: 'Package Updated',
            time: '2 hours ago',
            description: 'Europe 10GB package price updated to €29.99',
            icon: (
              <svg className="w-5 h-5 text-[#690d89]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            )
          },
          {
            title: 'New Country Added',
            time: '5 hours ago',
            description: 'Added Turkey with 3 data plans',
            icon: (
              <svg className="w-5 h-5 text-[#690d89]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )
          }
        ]);
      } catch (error) {
        console.error('Error loading activity:', error);
      } finally {
        setActivityLoading(false);
      }
    };

    loadStats();
    loadActivity();
  }, []);

  const statCards = [
    {
      title: 'Total Packages',
      value: stats.packages,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      change: '12%',
      changeType: 'increase'
    },
    {
      title: 'Active Countries',
      value: stats.countries,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      change: '5%',
      changeType: 'increase'
    },
    {
      title: 'Media Files',
      value: stats.media,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      change: '8%',
      changeType: 'increase'
    },
    {
      title: 'Published Pages',
      value: stats.pages,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      change: '3%',
      changeType: 'increase'
    }
  ];

  return (
    <div>
      {/* Welcome Message */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.email}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Here's what's happening with your site today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              title: 'Add Package',
              description: 'Create a new data package',
              href: '/admin/packages/new',
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )
            },
            {
              title: 'Add Country',
              description: 'Add a new country',
              href: '/admin/countries/new',
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )
            },
            {
              title: 'Upload Media',
              description: 'Add images and files',
              href: '/admin/media/upload',
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              )
            },
            {
              title: 'Create Page',
              description: 'Add a new page',
              href: '/admin/pages/new',
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              )
            }
          ].map((action) => (
            <Link
              key={action.title}
              to={action.href}
              className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 p-3 rounded-lg bg-[#690d89]/10 text-[#690d89]">
                {action.icon}
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">{action.title}</p>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flow-root">
            <ul className="-mb-8">
              {activityLoading ? (
                // Loading state
                [...Array(3)].map((_, index) => (
                  <li key={index}>
                    <ActivityItem isLoading={true} />
                  </li>
                ))
              ) : (
                // Actual activity items
                recentActivity.map((activity, index) => (
                  <li key={index}>
                    <ActivityItem
                      title={activity.title}
                      time={activity.time}
                      description={activity.description}
                      icon={activity.icon}
                    />
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}