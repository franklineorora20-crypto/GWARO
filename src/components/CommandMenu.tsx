import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Truck, Calculator, MapPin, Shirt, Crown, HelpCircle, Phone, ArrowRight, X, Command } from 'lucide-react';
import { PageType } from '../types';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (page: PageType) => void;
  onOpenBooking: (serviceName?: string) => void;
}

interface CommandItem {
  id: string;
  category: 'Actions' | 'Services' | 'Branches';
  title: string;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
}

export const CommandMenu: React.FC<CommandMenuProps> = ({
  isOpen,
  onClose,
  onSelectPage,
  onOpenBooking,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: CommandItem[] = [
    {
      id: 'book',
      category: 'Actions',
      title: 'Book Doorstep Collection',
      subtitle: 'Schedule free rider pickup within 1km',
      icon: Truck,
      action: () => {
        onOpenBooking();
        onClose();
      }
    },
    {
      id: 'calc',
      category: 'Actions',
      title: 'Calculate Laundry Price',
      subtitle: 'Instant Ksh estimator for garments & duvets',
      icon: Calculator,
      action: () => {
        onSelectPage('calculator');
        onClose();
      }
    },
    {
      id: 'track',
      category: 'Actions',
      title: 'Track Live Order',
      subtitle: 'Search with tracking ID or M-Pesa phone',
      icon: Search,
      action: () => {
        onSelectPage('track');
        onClose();
      }
    },
    {
      id: 'service-wash',
      category: 'Services',
      title: 'Wash & Fold (1-7kg)',
      subtitle: 'Ksh 450 · Everyday sanitized laundry',
      icon: Shirt,
      action: () => {
        onOpenBooking('Clothes Wash (1-7kg)');
        onClose();
      }
    },
    {
      id: 'service-suit',
      category: 'Services',
      title: 'Executive 2-Pc Suit Dry Cleaning',
      subtitle: 'Ksh 450 · Fiber-safe chemical-free solvent',
      icon: Shirt,
      action: () => {
        onOpenBooking('2 Pc Suits');
        onClose();
      }
    },
    {
      id: 'service-duvet',
      category: 'Services',
      title: 'Duvet Sanitization Clinic',
      subtitle: 'Ksh 850 · Anti-allergen thermal steam fluff',
      icon: Shirt,
      action: () => {
        onOpenBooking('Duvet Cleaning (1 piece)');
        onClose();
      }
    },
    {
      id: 'branch-rongai',
      category: 'Branches',
      title: 'Rongai Branch Hub',
      subtitle: 'Magadi Rd, Hill Valley Place · 0777 349 743',
      icon: MapPin,
      action: () => {
        onSelectPage('branches');
        onClose();
      }
    },
    {
      id: 'branch-ngong',
      category: 'Branches',
      title: 'Ngong Branch Hub',
      subtitle: 'Country Arcade, Ngong Town · 0777 140 102',
      icon: MapPin,
      action: () => {
        onSelectPage('branches');
        onClose();
      }
    },
    {
      id: 'vip',
      category: 'Actions',
      title: 'Gold Pass VIP Subscriptions',
      subtitle: 'Save 20% on monthly recurring laundry',
      icon: Crown,
      action: () => {
        onSelectPage('memberships');
        onClose();
      }
    }
  ];

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    (item.subtitle && item.subtitle.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-28 p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md -z-10"
      />

      {/* Emil Kowalski Command Menu Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -10 }}
        transition={{ type: "spring", stiffness: 450, damping: 32 }}
        className="bg-white dark:bg-[#130722] text-neutral-900 dark:text-white rounded-3xl max-w-xl w-full shadow-[0_24px_64px_rgba(0,0,0,0.35)] border border-black/[0.08] dark:border-white/[0.1] overflow-hidden max-h-[calc(100dvh-5rem)] flex flex-col"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4.5 py-3.5 border-b border-black/[0.06] dark:border-white/[0.08] gap-3 shrink-0">
          <Search className="w-4 h-4 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or service name..."
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-neutral-400 font-worksans text-neutral-900 dark:text-white"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-white p-1 text-xs"
            >
              Clear
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-mono bg-black/[0.05] dark:bg-white/[0.1] text-neutral-500 px-1.5 py-0.5 rounded">
              ESC
            </kbd>
          )}
        </div>

        {/* Action List */}
        <div className="flex-1 max-h-[55vh] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-400">
              No results found for "{query}".
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = selectedIndex === index;

              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs font-worksans transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#5E228B]/[0.08] dark:bg-white/[0.08] text-neutral-900 dark:text-white'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate pr-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#5E228B] text-white dark:bg-[#FED65B] dark:text-[#0c0418]'
                        : 'bg-black/[0.04] dark:bg-white/[0.05] text-neutral-500 dark:text-neutral-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-semibold font-manrope text-neutral-900 dark:text-white truncate">
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1.5 text-neutral-400 shrink-0">
                      <kbd className="text-[10px] font-mono bg-black/[0.06] dark:bg-white/[0.1] px-1 py-0.5 rounded">
                        ↵
                      </kbd>
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-neutral-50 dark:bg-white/[0.03] border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-manrope text-[11px]">Goldtribe Concierge</span>
        </div>
      </motion.div>
    </div>
  );
};
