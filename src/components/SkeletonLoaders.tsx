import React, { useState } from 'react';
import { motion } from 'motion/react';

interface SkeletonProps {
  className?: string;
  shimmer?: boolean;
}

/**
 * Base atomic Skeleton component with dark mode support and optional shimmer
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', shimmer = true }) => {
  return (
    <div
      className={`bg-neutral-200/80 dark:bg-white/[0.07] rounded-md ${
        shimmer ? 'animate-shimmer' : 'animate-pulse'
      } ${className}`}
    />
  );
};

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  aspectClassName?: string;
  fallbackIcon?: React.ReactNode;
}

/**
 * Image wrapper that shows a bone-colored shimmer skeleton until the image loads,
 * preventing Cumulative Layout Shift (CLS) on mobile browsers.
 */
export const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectClassName = 'aspect-[4/3]',
  fallbackIcon,
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${aspectClassName} ${containerClassName}`}>
      {/* Skeleton Shimmer Underlay */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-0 bg-neutral-200/90 dark:bg-[#1a0c2e] animate-shimmer flex items-center justify-center">
          {fallbackIcon ? (
            <div className="text-neutral-400 dark:text-white/20 animate-pulse">{fallbackIcon}</div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-neutral-300 dark:bg-white/10 animate-pulse" />
          )}
        </div>
      )}

      {/* Actual Image with smooth fade-in */}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          onLoad={(e) => {
            setIsLoaded(true);
            if (onLoad) onLoad(e);
          }}
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          referrerPolicy="no-referrer"
          {...props}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 dark:bg-white/[0.04] text-neutral-400 text-xs p-4 text-center">
          <span>Image preview unavailable</span>
        </div>
      )}
    </div>
  );
};

/**
 * Dedicated Hero Visual Skeleton Loader matching the 4:3 frame and overlay info badge
 */
export const HeroImageSkeleton: React.FC = () => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-black/[0.08] dark:border-white/[0.1] shadow-[0_20px_48px_-12px_rgba(0,0,0,0.18)] bg-neutral-100 dark:bg-[#130722] aspect-[4/3]">
      <div className="absolute inset-0 bg-neutral-200/80 dark:bg-[#1a0c2e] animate-shimmer" />

      {/* Floating Info Overlay Skeleton */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 p-3 sm:p-4 rounded-2xl bg-white/90 dark:bg-[#120722]/90 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg flex items-center justify-between gap-3">
        <div className="space-y-1.5 flex-1 min-w-0">
          <Skeleton className="h-3.5 w-32 rounded" />
          <Skeleton className="h-2.5 w-48 rounded" />
        </div>
        <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
      </div>
    </div>
  );
};

/**
 * Skeleton loader for Service Cards in Bento Grid
 */
export const ServiceCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl p-6 border bg-white dark:bg-[#130722] border-black/[0.08] dark:border-white/[0.1] shadow-xs flex flex-col justify-between space-y-6 overflow-hidden relative">
      <div className="space-y-4">
        {/* Header Icon + Turnaround */}
        <div className="flex justify-between items-start">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="w-20 h-4 rounded-full" />
        </div>

        {/* Thumbnail Image Skeleton */}
        <Skeleton className="h-40 w-full rounded-xl" />

        {/* Title + Description */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="h-3.5 w-full rounded" />
          <Skeleton className="h-3.5 w-2/3 rounded" />
        </div>

        {/* Features Checklist */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
            <Skeleton className="h-3 w-48 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
        </div>
      </div>

      {/* Bottom Price & Button */}
      <div className="pt-4 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-2.5 w-12 rounded" />
          <Skeleton className="h-6 w-24 rounded" />
        </div>
        <Skeleton className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Skeleton loader for Testimonial Review Cards
 */
export const TestimonialSkeleton: React.FC = () => {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-[#130722] border border-black/[0.08] dark:border-white/[0.1] shadow-2xs space-y-4">
      {/* Rating stars */}
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="w-4 h-4 rounded-sm" />
        ))}
      </div>

      {/* Comment text */}
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full rounded" />
        <Skeleton className="h-3.5 w-5/6 rounded" />
        <Skeleton className="h-3.5 w-4/6 rounded" />
      </div>

      {/* Author info */}
      <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-4 w-28 rounded" />
          <Skeleton className="h-2.5 w-20 rounded" />
        </div>
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
    </div>
  );
};

/**
 * Comprehensive Order Tracking / Search Page Skeleton Loader
 * Mirrored precisely against TrackOrder's 12-column layout:
 * - Left 7 cols: Order Header, Milestone Stepper (10 steps), Garment Items Breakdown
 * - Right 5 cols: Destination & Hub card, Payment Verification card
 */
export const TrackOrderSkeleton: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="grid gap-6 lg:grid-cols-12 items-start"
    >
      {/* Left 7 Columns: Stepper Timeline & Garment Items */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-6">
          {/* Title & Status Pill */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] dark:border-white/[0.08] pb-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-28 rounded-lg" />
                <Skeleton className="h-5 w-5 rounded" />
              </div>
              <Skeleton className="h-3 w-44 rounded" />
            </div>
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>

          {/* Stepper Nodes Skeleton (10 stages) */}
          <div className="space-y-4">
            <Skeleton className="h-3 w-32 rounded" />
            <div className="space-y-3.5">
              {[
                'Order Received',
                'Pickup Scheduled',
                'Picked Up',
                'Washing',
                'Drying',
                'Ironing',
                'Quality Check',
                'Ready for Delivery',
                'Out for Delivery',
                'Delivered',
              ].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-6 h-6 rounded-full shrink-0" />
                  <Skeleton
                    className={`h-3.5 rounded ${
                      i === 0 ? 'w-36' : i === 1 ? 'w-44' : i === 2 ? 'w-32' : 'w-28'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Garment Items In-Transit Skeleton */}
        <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>

          <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {[1, 2].map((i) => (
              <div key={i} className="py-3 flex justify-between items-center">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-48 rounded" />
                  <Skeleton className="h-2.5 w-16 rounded" />
                </div>
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex justify-between items-center">
            <Skeleton className="h-3.5 w-20 rounded" />
            <Skeleton className="h-6 w-28 rounded" />
          </div>
        </div>
      </div>

      {/* Right 5 Columns: Destination, Hub & Payment Verification */}
      <div className="lg:col-span-5 space-y-6">
        {/* Destination & Hub Skeleton */}
        <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-3 w-32 rounded" />
          </div>
          <div className="space-y-3.5">
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-14 rounded" />
              <Skeleton className="h-4 w-full rounded" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-14 rounded" />
              <Skeleton className="h-4 w-32 rounded" />
            </div>
            <div className="space-y-1">
              <Skeleton className="h-2.5 w-24 rounded" />
              <Skeleton className="h-4 w-40 rounded" />
            </div>
          </div>
        </div>

        {/* Payment Verification Skeleton */}
        <div className="bg-white dark:bg-[#130722] rounded-3xl p-6 sm:p-7 border border-black/[0.08] dark:border-white/[0.1] shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded" />
            <Skeleton className="h-3 w-36 rounded" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-4 w-28 rounded" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-4 w-24 rounded font-mono" />
            </div>
          </div>
        </div>

        {/* Action Button Skeleton */}
        <div className="p-4 rounded-2xl bg-neutral-100 dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.08] space-y-2">
          <Skeleton className="h-3 w-32 rounded" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Full Home Page Skeleton for initial hydration or view transition
 */
export const HomePageSkeleton: React.FC = () => {
  return (
    <div className="space-y-16 animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-12 items-center pt-8">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-4 w-48 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-10 sm:h-14 w-full rounded-xl" />
            <Skeleton className="h-10 sm:h-14 w-3/4 rounded-xl" />
          </div>
          <Skeleton className="h-5 w-5/6 rounded" />
          <Skeleton className="h-28 w-full max-w-xl rounded-2xl" />
          <div className="flex gap-3">
            <Skeleton className="h-12 w-48 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <HeroImageSkeleton />
        </div>
      </div>

      {/* Trust Banner Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
      </div>

      {/* Services Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center max-w-md mx-auto space-y-2">
          <Skeleton className="h-4 w-32 mx-auto rounded" />
          <Skeleton className="h-8 w-64 mx-auto rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
          <ServiceCardSkeleton />
        </div>
      </div>
    </div>
  );
};
