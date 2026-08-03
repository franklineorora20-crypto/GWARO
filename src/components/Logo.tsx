import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  const badgeDimensions = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  return (
    <div className="flex items-center gap-3 group cursor-pointer select-none">
      {/* Exact Standalone Emblem Patch matching master artwork */}
      <div className={`relative shrink-0 flex items-center justify-center ${badgeDimensions[size]}`}>
        <svg
          viewBox="0 0 160 180"
          className="w-full h-full drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* WHITE DIE-CUT EMBLEM PATCH BACKDROP */}
          <path
            d="M 72 26 C 72 4 98 4 93 24 C 88 32 83 37 83 44 A 62 62 0 0 1 146 94 C 146 112 152 132 138 146 C 124 160 100 172 74 172 C 44 172 18 150 14 120 C 9 100 16 80 28 68 A 62 62 0 0 1 77 44 C 77 37 72 32 72 26 Z"
            fill="#FFFFFF"
          />

          {/* INNER WHITE MEDALLION BASE */}
          <circle cx="80" cy="96" r="54" fill="#FFFFFF" />

          {/* GOLD CLOTHES HANGER (HOOK & SHOULDER ARCH) */}
          <path
            d="M 74 28 C 74 11 95 10 90 25 C 87 31 80 36 80 46"
            fill="none"
            stroke="#E3A314"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 27 94 A 53 53 0 0 1 133 94"
            fill="none"
            stroke="#E3A314"
            strokeWidth="8.5"
            strokeLinecap="round"
          />

          {/* DEEP PURPLE CUSTOM VECTOR LETTER 'g' */}
          <g fill="#421354">
            {/* Upper Oval Bowl & Inner Counter */}
            <path d="M 79 53 C 65 53 54 62 54 73 C 54 84 65 91 79 91 C 93 91 104 84 104 73 C 104 62 93 53 79 53 Z M 79 61 C 86 61 92 66 92 73 C 92 80 86 84 79 84 C 72 84 66 80 66 73 C 66 66 72 61 79 61 Z" />

            {/* Top-Right Calligraphic Ear with Teardrop Void */}
            <path d="M 96 58 C 103 52 112 54 114 60 C 111 65 103 64 99 60 Z" />

            {/* Calligraphic Neck / Waist connecting the two bowls */}
            <path d="M 85 85 C 97 87 69 90 74 96 C 79 99 89 96 86 100 C 78 102 66 97 72 90 C 76 86 82 85 85 85 Z" />

            {/* Lower Descender Loop & Inner Counter */}
            <path d="M 80 96 C 56 96 47 107 47 121 C 47 138 64 146 84 146 C 104 146 116 134 116 118 C 116 105 101 96 80 96 Z M 82 139 C 68 139 59 131 59 121 C 59 111 68 103 82 103 C 96 103 104 111 104 121 C 104 131 96 139 82 139 Z" />
          </g>

          {/* TWO WHITE EYES INSIDE LOWER COUNTER OF 'g' */}
          <circle cx="72" cy="122" r="4" fill="#FFFFFF" />
          <circle cx="91" cy="122" r="4" fill="#FFFFFF" />

          {/* TWO PURPLE SOAP BUBBLE DOTS TO THE LEFT */}
          <circle cx="43" cy="77" r="5.5" fill="#421354" />
          <circle cx="49" cy="93" r="3.8" fill="#421354" />

          {/* LOWER DEEP PURPLE WATER SPLASH FLUID STROKES WITH EVEN SPACES */}
          <path
            d="M 23 104 C 24 120 32 138 49 148 C 53 150 56 146 51 143 C 38 135 29 122 26 110 C 25 105 22 99 23 104 Z"
            fill="#421354"
          />
          <path
            d="M 59 152 C 68 161 82 161 90 154 C 93 151 88 147 83 149 C 76 153 69 152 64 148 C 61 146 58 149 59 152 Z"
            fill="#421354"
          />
          <path
            d="M 98 153 C 111 148 124 139 131 127 C 134 123 129 120 126 124 C 118 134 107 142 97 146 C 93 148 94 152 98 153 Z"
            fill="#421354"
          />
          <path
            d="M 137 122 C 145 112 148 102 148 94 C 144 92 141 97 140 104 C 138 112 134 119 132 124 C 131 127 134 128 137 122 Z"
            fill="#421354"
          />

          {/* Small organic liquid droplets in gaps */}
          <circle cx="134" cy="132" r="3.6" fill="#421354" />
          <circle cx="116" cy="147" r="3.2" fill="#421354" />
          <circle cx="94" cy="157" r="2.8" fill="#421354" />
          <circle cx="55" cy="154" r="3" fill="#421354" />
        </svg>
      </div>
    </div>
  );
};