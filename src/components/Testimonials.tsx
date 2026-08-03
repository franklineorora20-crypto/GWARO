import React, { useState } from 'react';
import { Review } from '../types';
import { INITIAL_REVIEWS } from '../data/initialData';
import { Star, MessageSquare, CheckCircle2, Plus, Sparkles, User } from 'lucide-react';

interface TestimonialsProps {
  onShowToast: (title: string, message?: string) => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ onShowToast }) => {
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Form State
  const [author, setAuthor] = useState('');
  const [branch, setBranch] = useState('Rongai Branch');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) {
      alert('Please fill in your name and review comments.');
      return;
    }

    const newReview: Review = {
      id: `r-${Date.now()}`,
      author: author.trim(),
      branch,
      rating,
      comment: comment.trim(),
      date: 'Just now',
      verified: true
    };

    setReviews([newReview, ...reviews]);
    setShowReviewForm(false);
    setAuthor('');
    setComment('');
    onShowToast('Thank You!', 'Your review has been published successfully.');
  };

  return (
    <section className="py-16 sm:py-24 bg-[#fcf9f8] dark:bg-[#0f0717] relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fed65b]/30 dark:bg-[#FED65B]/10 text-[#745c00] dark:text-[#FED65B] font-bold text-xs uppercase font-manrope">
              <Star className="w-3.5 h-3.5 text-[#341168] dark:text-[#FED65B] fill-[#341168] dark:fill-[#FED65B]" />
              <span>Community Ratings</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-[#341168] dark:text-white">
              Trusted by Rongai & Ngong Families
            </h2>
            <p className="text-sm font-worksans text-[#4a4550] dark:text-gray-300">
              See what busy professionals, families, and Airbnb hosts say about our concierge laundry service.
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-[#341168] dark:bg-[#5E228B] text-[#fed65b] px-5 py-3 rounded-full text-xs sm:text-sm font-bold font-manrope hover:bg-[#4b2c7f] transition-all flex items-center gap-2 shrink-0 cursor-pointer shadow-md border border-[#FED65B]/30"
          >
            <Plus className="w-4 h-4" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-[#1a0c2a] rounded-3xl p-6 sm:p-8 border border-[#e5e2e1] dark:border-white/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'text-[#735c00] dark:text-[#FED65B] fill-[#fed65b]' : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-[#735c00] dark:text-[#FED65B] ml-2 font-manrope">
                    5.0 Verified
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-worksans text-[#1c1b1b] dark:text-gray-200 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-[#e5e2e1] dark:border-white/10 flex justify-between items-center text-xs font-worksans">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#341168] dark:bg-[#5E228B] text-white flex items-center justify-center font-bold text-xs font-manrope border border-[#FED65B]/30">
                    {rev.author[0]}
                  </div>
                  <div>
                    <div className="font-bold text-[#1c1b1b] dark:text-white">{rev.author}</div>
                    <div className="text-[11px] text-[#735c00] dark:text-[#FED65B] font-bold">{rev.branch}</div>
                  </div>
                </div>

                <span className="text-[11px] text-[#7b7581] dark:text-gray-400">{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Write Review */}
        {showReviewForm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-[#1c1b1b] rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-[#e5e2e1] font-worksans animate-bounce-in">
              <div className="flex justify-between items-center border-b border-[#e5e2e1] pb-3">
                <h3 className="text-lg font-bold font-manrope text-[#341168]">
                  Submit Your Review
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-[#7b7581] hover:text-[#1c1b1b]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#341168] block font-manrope mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Sarah Wambui"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-[#e5e2e1] bg-[#f6f3f2] text-sm focus:ring-2 focus:ring-[#341168]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#341168] block font-manrope mb-1">Select Branch Used</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-[#e5e2e1] bg-[#f6f3f2] text-sm focus:ring-2 focus:ring-[#341168]"
                  >
                    <option value="Rongai Branch">Rongai Branch (Magadi Rd)</option>
                    <option value="Ngong Branch">Ngong Branch (Country Arcade)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#341168] block font-manrope mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 text-2xl focus:outline-none"
                      >
                        <span className={star <= rating ? 'text-[#fed65b]' : 'text-gray-300'}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#341168] block font-manrope mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Tell us about the laundry quality, speed, or rider punctuality..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-3 rounded-2xl border border-[#e5e2e1] bg-[#f6f3f2] text-sm focus:ring-2 focus:ring-[#341168]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#341168] text-white font-bold font-manrope text-sm hover:bg-[#4b2c7f] cursor-pointer"
                >
                  Publish Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
