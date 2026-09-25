import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Review } from '../types';
import { INITIAL_REVIEWS } from '../data/initialData';
import { Star, MessageSquare, CheckCircle2, Plus, Sparkles, User, X } from 'lucide-react';

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!author.trim() || !comment.trim()) {
      setErrorMsg('Please provide your name and a brief review message.');
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
    onShowToast('Review Published', `Thank you, ${newReview.author}! Your review is now live.`);
  };

  return (
    <section className="py-20 sm:py-28 bg-[#FAFAFB] dark:bg-[#0c0418] relative transition-colors duration-200 border-t border-black/[0.06] dark:border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="text-xs font-semibold tracking-tight text-[#5E228B] dark:text-[#FED65B]">
              Verified Feedback · Rongai & Ngong Community
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-manrope text-neutral-900 dark:text-white tracking-[-0.02em] [text-wrap:balance]">
              Loved by Busy Families & Professionals
            </h2>
            <p className="text-sm font-worksans text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Read authentic feedback from regular households, Airbnb hosts, and corporate clients across Kajiado and Nairobi.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowReviewForm(true)}
            className="px-5 py-3 rounded-full bg-[#5E228B] hover:bg-[#501a78] text-white font-bold font-manrope text-xs sm:text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(94,34,139,0.3)] flex items-center gap-2 shrink-0 cursor-pointer transition-all self-start md:self-auto"
          >
            <Plus className="w-4 h-4 text-[#FED65B]" />
            <span>Write a Review</span>
          </motion.button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <motion.div
              key={rev.id}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex flex-col justify-between space-y-5 relative overflow-hidden"
            >
              {/* Micro top highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-black/[0.06] dark:via-white/[0.1] to-transparent" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating
                            ? 'text-[#E2B227] fill-[#FED65B]'
                            : 'text-neutral-200 dark:text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-[#5E228B] dark:text-[#FED65B] font-manrope">
                    Verified Order
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-worksans text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-between items-center text-xs font-worksans">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#5E228B] text-white flex items-center justify-center font-bold text-xs font-manrope shrink-0">
                    {rev.author[0]}
                  </div>
                  <div>
                    <div className="font-bold font-manrope text-neutral-900 dark:text-white">{rev.author}</div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400">{rev.branch}</div>
                  </div>
                </div>

                <span className="text-[11px] text-neutral-400 font-medium tabular-nums">{rev.date}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Emil Kowalski Spring Dialog */}
        <AnimatePresence>
          {showReviewForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowReviewForm(false)}
                className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md -z-10"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 16 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="bg-white dark:bg-[#130722] text-neutral-900 dark:text-white rounded-3xl max-w-md w-full p-5 sm:p-7 shadow-2xl border border-black/[0.08] dark:border-white/[0.1] space-y-5 relative my-auto max-h-[calc(100dvh-2rem)] overflow-y-auto overflow-x-hidden font-worksans"
              >
                {/* Micro highlight */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#FED65B]/60 to-transparent" />

                <div className="flex justify-between items-center border-b border-black/[0.06] dark:border-white/[0.08] pb-3">
                  <div>
                    <h3 className="text-lg font-bold font-manrope text-neutral-900 dark:text-white">
                      Submit Your Review
                    </h3>
                    <p className="text-xs text-neutral-500">Your feedback helps Rongai & Ngong neighbors</p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(false)}
                    className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Sarah Wambui"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                      Branch Used
                    </label>
                    <select
                      value={branch}
                      onChange={(e) => setBranch(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs sm:text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
                    >
                      <option value="Rongai Branch" className="dark:bg-[#130722]">Rongai Branch (Magadi Rd)</option>
                      <option value="Ngong Branch" className="dark:bg-[#130722]">Ngong Branch (Country Arcade)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                      Rating
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-xl focus:outline-none cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating
                                ? 'text-[#E2B227] fill-[#FED65B]'
                                : 'text-neutral-300 dark:text-neutral-600'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block font-manrope mb-1">
                      Your Comments
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share your experience regarding wash quality, turn-around time, or rider politeness..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 rounded-xl border border-black/[0.08] dark:border-white/[0.1] bg-neutral-50 dark:bg-white/[0.04] text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5E228B]"
                    />
                  </div>

                  <AnimatePresence>
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -6, height: 0 }}
                        className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-medium"
                      >
                        {errorMsg}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[#5E228B] hover:bg-[#501a78] text-white font-bold font-manrope text-xs sm:text-sm transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(94,34,139,0.3)] cursor-pointer"
                  >
                    Publish Review
                  </motion.button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
