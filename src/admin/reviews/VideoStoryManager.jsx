import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseService';

export default function VideoStoryManager() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    type: 'video',
    author: '',
    location: '',
    flag: '',
    rating: 5,
    video_url: '',
    thumbnail_url: '',
    content: '',
    handle: ''
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('cms_video_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load reviews'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      type: item.type || 'video',
      author: item.author,
      location: item.location,
      flag: item.flag,
      rating: item.rating,
      video_url: item.video_url,
      thumbnail_url: item.thumbnail_url,
      content: item.content,
      handle: item.handle || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cms_video_reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReviews(reviews.filter(item => item.id !== id));
      setMessage({
        type: 'success',
        text: 'Review deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete review'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (currentItem) {
        // Update existing review
        const { error } = await supabase
          .from('cms_video_reviews')
          .update(formData)
          .eq('id', currentItem.id);

        if (error) throw error;

        setReviews(reviews.map(item => 
          item.id === currentItem.id ? { ...item, ...formData } : item
        ));
        setMessage({
          type: 'success',
          text: 'Review updated successfully'
        });
      } else {
        // Create new review
        const { data, error } = await supabase
          .from('cms_video_reviews')
          .insert([formData])
          .select();

        if (error) throw error;

        setReviews([...reviews, data[0]]);
        setMessage({
          type: 'success',
          text: 'Review created successfully'
        });
      }

      setIsEditing(false);
      setCurrentItem(null);
      setFormData({
        type: 'video',
        author: '',
        location: '',
        flag: '',
        rating: 5,
        video_url: '',
        thumbnail_url: '',
        content: '',
        handle: ''
      });
    } catch (error) {
      console.error('Error saving review:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save review'
      });
    }
  };

  const VideoPreview = ({ url }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    const getEmbedUrl = (url) => {
      if (url.includes('tiktok.com')) {
        // Extract TikTok video ID and create embed URL
        const videoId = url.split('/').pop();
        return `https://www.tiktok.com/embed/${videoId}`;
      } else if (url.includes('instagram.com')) {
        // Convert Instagram URL to embed URL
        return url.replace('/reel/', '/embed/');
      }
      return url;
    };

    return (
      <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
        {!isPlaying ? (
          <button
            onClick={() => setIsPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors"
          >
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        ) : (
          <iframe
            src={getEmbedUrl(url)}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allowFullScreen
          />
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Stories</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage video testimonials and stories
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
        >
          Add Video Story
        </button>
      </div>

      {/* Message display */}
      {message.text && (
        <div className={`mt-4 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <div className="mt-6 bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Author Name</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Social Handle</label>
                <input
                  type="text"
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                  placeholder="@username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Flag Emoji</label>
                <input
                  type="text"
                  value={formData.flag}
                  onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                  placeholder="🇺🇸"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Video URL</label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                  placeholder="https://www.tiktok.com/@user/video/1234567890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                <input
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Rating</label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#690d89] focus:ring-[#690d89] sm:text-sm"
                >
                  {[5, 4, 3, 2, 1].map(rating => (
                    <option key={rating} value={rating}>{rating} Stars</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setCurrentItem(null);
                  setFormData({
                    type: 'video',
                    author: '',
                    location: '',
                    flag: '',
                    rating: 5,
                    video_url: '',
                    thumbnail_url: '',
                    content: '',
                    handle: ''
                  });
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#690d89] hover:bg-[#8B5CF6]"
              >
                {currentItem ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Video Reviews List */}
      <div className="mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              {/* Video Preview */}
              <VideoPreview url={review.video_url} />

              {/* Review Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-[#690d89] text-white flex items-center justify-center font-bold">
                      {review.author[0]}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{review.author}</h3>
                      <div className="text-sm text-gray-500">
                        {review.handle && <span className="mr-2">{review.handle}</span>}
                        <span>{review.location}</span>
                        {review.flag && <span className="ml-1">{review.flag}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
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
                </div>

                <p className="text-gray-600 line-clamp-3 mb-4">{review.content}</p>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-[#690d89] hover:text-[#8B5CF6]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && reviews.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No video stories</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new video story.</p>
            <div className="mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#690d89] hover:bg-[#8B5CF6]"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Video Story
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}