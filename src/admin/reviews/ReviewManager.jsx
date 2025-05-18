import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { supabase } from '../services/supabaseService';

const ReviewCard = ({ review, onApprove, onReject, onDelete, onEdit, onRespond }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedReview, setEditedReview] = useState(review);
  const [response, setResponse] = useState('');

  const handleRatingChange = (newRating) => {
    setEditedReview({ ...editedReview, rating: newRating });
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#690d89] text-white flex items-center justify-center font-bold">
            {review.author[0]}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{review.author}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{review.location}</span>
              <span>{review.flag}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {review.status === 'pending' && (
            <>
              <button
                onClick={() => onApprove(review.id)}
                className="text-green-600 hover:text-green-800"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(review.id)}
                className="text-red-600 hover:text-red-800"
              >
                Reject
              </button>
            </>
          )}
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#690d89] hover:text-[#8B5CF6]"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(review.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4 space-y-4">
          {/* Author Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Author Name</label>
            <input
              type="text"
              value={editedReview.author}
              onChange={(e) => setEditedReview({ ...editedReview, author: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={editedReview.location}
              onChange={(e) => setEditedReview({ ...editedReview, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
            />
          </div>

          {/* Flag Emoji */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Flag Emoji</label>
            <input
              type="text"
              value={editedReview.flag}
              onChange={(e) => setEditedReview({ ...editedReview, flag: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
              placeholder="🇺🇸"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating</label>
            <div className="mt-1 flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className={`p-1 ${star <= editedReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Photo URL</label>
            <input
              type="url"
              value={editedReview.image}
              onChange={(e) => setEditedReview({ ...editedReview, image: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
              placeholder="https://example.com/photo.jpg"
            />
          </div>

          {/* Review Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={editedReview.content}
              onChange={(e) => setEditedReview({ ...editedReview, content: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                onEdit(editedReview);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-[#690d89] text-white rounded-md hover:bg-[#8B5CF6]"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-4 text-gray-700">{review.content}</p>
          <div className="mt-2 flex gap-1">
            {[...Array(review.rating)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          
          {/* Response Section */}
          <div className="mt-4 border-t pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900">Admin Response</h4>
            </div>
            {review.response ? (
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{review.response}</p>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Write a response..."
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
                />
                <button
                  onClick={() => {
                    onRespond(review.id, response);
                    setResponse('');
                  }}
                  className="px-4 py-2 bg-[#690d89] text-white rounded-md hover:bg-[#8B5CF6]"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const FilterBar = ({ filters, onFilterChange }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-700">Date Range</label>
      <select
        value={filters.dateRange}
        onChange={(e) => onFilterChange('dateRange', e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
      >
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700">Rating</label>
      <select
        value={filters.rating}
        onChange={(e) => onFilterChange('rating', e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
      >
        <option value="all">All Ratings</option>
        <option value="5">5 Stars</option>
        <option value="4">4 Stars</option>
        <option value="3">3 Stars</option>
        <option value="2">2 Stars</option>
        <option value="1">1 Star</option>
      </select>
    </div>
    
    <div>
      <label className="block text-sm font-medium text-gray-700">Status</label>
      <select
        value={filters.status}
        onChange={(e) => onFilterChange('status', e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89]"
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  </div>
);

const AnalyticsPanel = ({ reviews }) => {
  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;
  const pendingReviews = reviews.filter(review => review.status === 'pending').length;
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-medium text-gray-500">Total Reviews</h3>
        <p className="mt-2 text-3xl font-bold text-[#690d89]">{totalReviews}</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
        <p className="mt-2 text-3xl font-bold text-[#690d89]">{averageRating.toFixed(1)}</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
        <p className="mt-2 text-3xl font-bold text-[#690d89]">{pendingReviews}</p>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-sm font-medium text-gray-500">Response Rate</h3>
        <p className="mt-2 text-3xl font-bold text-[#690d89]">
          {((reviews.filter(r => r.response).length / totalReviews) * 100).toFixed(0)}%
        </p>
      </div>
    </div>
  );
};

export default function ReviewManager() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    rating: 'all',
    status: 'all'
  });
  const { t } = useTranslation();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cms_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { error } = await supabase
        .from('cms_testimonials')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      await loadReviews();
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (id) => {
    try {
      const { error } = await supabase
        .from('cms_testimonials')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      await loadReviews();
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      const { error } = await supabase
        .from('cms_testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEdit = async (review) => {
    try {
      const { error } = await supabase
        .from('cms_testimonials')
        .update(review)
        .eq('id', review.id);

      if (error) throw error;
      await loadReviews();
    } catch (error) {
      console.error('Error updating review:', error);
    }
  };

  const handleRespond = async (id, response) => {
    try {
      const { error } = await supabase
        .from('cms_testimonials')
        .update({ response })
        .eq('id', id);

      if (error) throw error;
      await loadReviews();
    } catch (error) {
      console.error('Error adding response:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredReviews = reviews.filter(review => {
    if (filters.rating !== 'all' && review.rating !== parseInt(filters.rating)) return false;
    if (filters.status !== 'all' && review.status !== filters.status) return false;
    
    if (filters.dateRange !== 'all') {
      const reviewDate = new Date(review.created_at);
      const now = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          return reviewDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          return reviewDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          return reviewDate >= monthAgo;
        default:
          return true;
      }
    }
    
    return true;
  });

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and moderate customer reviews
          </p>
        </div>
      </div>

      {/* Analytics Panel */}
      <AnalyticsPanel reviews={reviews} />

      {/* Filters */}
      <FilterBar filters={filters} onFilterChange={handleFilterChange} />

      {/* Reviews List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#690d89]"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onApprove={handleApprove}
              onReject={handleReject}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onRespond={handleRespond}
            />
          ))}
          
          {filteredReviews.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No reviews found matching your filters</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}