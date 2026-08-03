import React from 'react';
import { Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showMotto?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: 'light' | 'dark' | 'auto';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showMotto = true,
  className = '',
  onClick,
  variant = 'auto',
}) => {
  const badgeDimensions = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
    xl: 'w-20 h-20 sm:w-28 sm:h-28',
  };

  const titleSizes = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base',
    lg: 'text-base sm:text-xl',
    xl: 'text-xl sm:text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px] sm:text-[10px]',
    md: 'text-[10px] sm:text-[11px]',
    lg: 'text-xs sm:text-sm',
    xl: 'text-sm sm:text-base',
  };

  const isDark = variant === 'dark';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer group' : ''} ${className}`}
    >
      {/* Exact Vector Emblem Badge containing ONLY the emblem letter icon */}
      <div className={`relative shrink-0 flex items-center justify-center ${badgeDimensions[size]}`}>
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-md group-hover:drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top Hanging Tag Strings */}
          <line x1="77" y1="0" x2="77" y2="14" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round" />
          <line x1="83" y1="0" x2="83" y2="14" stroke="#3A3A3A" strokeWidth="2" strokeLinecap="round" />

          {/* Outer Dark Purple Badge Base */}
          <circle cx="80" cy="85" r="70" fill="#2E0C4B" stroke="#9A9A9A" strokeWidth="1.5" />
          <circle cx="80" cy="85" r="67" fill="#5E228B" />

          {/* Gold Hanger Hook atop white medallion */}
          <path
            d="M72 32 C72 16 90 16 88 28 C87 34 80 36 80 44"
            fill="none"
            stroke="#E2B227"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* White Inner Medallion */}
          <circle cx="80" cy="85" r="42" fill="#FFFFFF" stroke="#E2B227" strokeWidth="4.5" />

          {/* Custom Vector 'g' matching photo */}
          <g fill="#5E228B">
            {/* Top loop of 'g' */}
            <path d="M78 57 C70 57 65 63 65 70 C65 77 71 81 79 81 C88 81 92 75 92 70 C92 63 86 57 78 57 Z M78 63 C82 63 84 66 84 70 C84 73 82 76 78 76 C74 76 72 73 72 70 C72 66 74 63 78 63 Z" />
            
            {/* Ear/Curl on top right of top loop */}
            <path d="M88 61 C91 58 96 59 98 62 C96 64 92 64 89 62 Z" />

            {/* Connecting stem / neck */}
            <path d="M80 79 L80 87 L82 87 L82 79 Z" />

            {/* Bottom loop / descender of 'g' */}
            <path d="M80 85 C66 85 62 93 62 101 C62 111 72 116 83 116 C95 116 102 108 102 98 C102 90 94 85 80 85 Z M82 110 C72 110 68 105 68 100 C68 95 72 91 82 91 C91 91 95 95 95 100 C95 105 91 110 82 110 Z" />
          </g>

          {/* Two white oval cutouts / eyes inside the bottom loop of 'g' */}
          <circle cx="75" cy="100" r="2.5" fill="#FFFFFF" />
          <circle cx="86" cy="100" r="2.5" fill="#FFFFFF" />

          {/* Two purple soap bubble dots to the left of 'g' */}
          <circle cx="53" cy="74" r="3.2" fill="#5E228B" />
          <circle cx="58" cy="84" r="2.2" fill="#5E228B" />

          {/* Washing Liquid Wave at bottom of white circle */}
          <path
            d="M48 100 C58 120 102 120 114 98 C104 116 56 118 48 100 Z"
            fill="#5E228B"
          />
          {/* White Suds on Wave */}
          <circle cx="108" cy="101" r="2.2" fill="#FFFFFF" />
          <circle cx="102" cy="107" r="1.6" fill="#FFFFFF" />
        </svg>
      </div>

      <div className="flex flex-col justify-center font-manrope">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`${titleSizes[size]} font-black tracking-wider uppercase leading-tight ${
              isDark ? 'text-white' : 'text-[#5E228B]'
            }`}
          >
            Goldtribe Link
          </span>
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#5E228B] text-[#FED65B] uppercase tracking-wider shadow-2xs border border-[#FED65B]/30">
            Laundromat
          </span>
        </div>

        {showMotto && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span
              className="text-[10px] sm:text-[11px] font-black text-[#5E228B] dark:text-[#FED65B] bg-[#FED65B]/20 dark:bg-[#FED65B]/10 px-2 py-0.5 rounded-md border border-[#D8A620]/40 uppercase tracking-widest flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#D8A620]" />
              <span>USAFI: KAZI YETU</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


