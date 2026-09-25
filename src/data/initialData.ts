import { ServiceItem, Branch, Order, MembershipPlan, Review } from '../types';

export const LOGO_URL = "/src/assets/images/goldtribe_logo_1785500902629.jpg";

export const INITIAL_SERVICES: ServiceItem[] = [
  // Normal Laundry
  {
    id: 's-1',
    name: 'Clothes Wash (1-7kg)',
    category: 'laundry',
    price: 450,
    priceUnit: 'load',
    turnaround: '24 Hours',
    description: 'Everyday laundry wash using eco-friendly detergents and sanitizing wash cycle.',
    image: '/src/assets/images/hero_laundry_pristine_1790275438376.jpg',
    popular: true,
    features: ['Standard load capacity', 'Eco-friendly detergent', 'Separated lights & darks', 'Deep stain removal']
  },
  {
    id: 's-13',
    name: 'Clothes Dry (1-7kg)',
    category: 'laundry',
    price: 450,
    priceUnit: 'load',
    turnaround: '24 Hours',
    description: 'Professional thermal tumble drying for pre-washed laundry loads.',
    popular: false,
    features: ['Standard load capacity', 'Gentle moisture control', 'Lint removal', 'Clean finish']
  },
  {
    id: 's-14',
    name: 'Clothes Iron (1-7kg)',
    category: 'laundry',
    price: 450,
    priceUnit: 'load',
    turnaround: '24 Hours',
    description: 'Professional steam pressing for washed and dried clothing.',
    popular: false,
    features: ['Standard load capacity', 'Crisp steam pressing', 'Crease removal', 'Hanger / folded option']
  },
  {
    id: 's-2',
    name: 'Super package (1-7kg)',
    category: 'laundry',
    price: 1300,
    priceUnit: 'load',
    turnaround: '24 Hours',
    description: 'All-inclusive bundle covering wash, dry, steam ironing, and folding.',
    popular: true,
    features: ['Standard load capacity', 'Full wash, dry, iron & fold', 'Crisp steam pressing', 'Hanger or folded packing']
  },
  {
    id: 's-15',
    name: 'Clothes Wash (12kg)',
    category: 'laundry',
    price: 750,
    priceUnit: 'load',
    turnaround: '24 Hours',
    description: 'Heavy family load wash for large laundry baskets.',
    popular: false,
    features: ['Family heavy load capacity', 'Deep stain removal', 'Softener rinse', 'High-efficiency wash']
  },
  {
    id: 's-16',
    name: 'Clothes Dry (12kg)',
    category: 'laundry',
    price: 750,
    priceUnit: 'load',
    turnaround: '24 Hours',
    description: 'High capacity thermal drying for large laundry loads.',
    popular: false,
    features: ['Family heavy load capacity', 'Thermal sanitizing', 'Wrinkle reduction']
  },
  {
    id: 's-17',
    name: 'Clothes Iron (12kg)',
    category: 'laundry',
    price: 750,
    priceUnit: 'load',
    turnaround: '24 Hours',
    description: 'Steam pressing service for large laundry loads.',
    popular: false,
    features: ['Family heavy load capacity', 'Crisp steam finish', 'Fabric protection']
  },
  {
    id: 's-11',
    name: 'Executive Shirt',
    category: 'laundry',
    price: 150,
    priceUnit: 'per shirt',
    turnaround: '24 Hours',
    description: 'Crisp steam pressed executive shirt wash with starch option and hanger packaging.',
    popular: false,
    features: ['Crisp collar press', 'Starch preference options', 'Hanger included', 'Stain removal']
  },
  {
    id: 's-18',
    name: 'Towels Wash (1-7kg)',
    category: 'laundry',
    price: 600,
    priceUnit: 'load',
    turnaround: '24 Hours',
    description: 'Sanitizing wash for bath towels and household linens.',
    popular: false,
    features: ['Standard load capacity', 'Fluffing softener rinse', 'High-temp sanitization']
  },
  {
    id: 's-19',
    name: 'Towels Dry (1-7kg)',
    category: 'laundry',
    price: 600,
    priceUnit: 'load',
    turnaround: '24 Hours',
    description: 'Thermal tumble dry for plush bath towels.',
    popular: false,
    features: ['Standard load capacity', 'Soft plush fluffing', 'Odour elimination']
  },

  // Dry Cleaning
  {
    id: 's-3',
    name: '2 Pc Suits',
    category: 'dry-cleaning',
    price: 450,
    priceUnit: 'per suit',
    turnaround: '24-48 Hours',
    description: 'Chemical-free, fiber-safe solvent cleaning for 2-piece suits, blazers, and formal evening wear.',
    image: '/src/assets/images/service_dry_cleaning_1790275450278.jpg',
    popular: true,
    features: ['Hand-finished lapels', 'Breathable garment bag', 'Form retention care', 'Stain pre-treatment']
  },
  {
    id: 's-12',
    name: '3 PC Suit',
    category: 'dry-cleaning',
    price: 550,
    priceUnit: 'per 3-pc suit',
    turnaround: '24-48 Hours',
    description: 'Full 3-piece suit dry cleaning including jacket, waistcoat, and trousers.',
    popular: false,
    features: ['Complete 3-pc suit care', 'Hand-finished lapels', 'Breathable garment bag', 'Wrinkle protection']
  },
  {
    id: 's-20',
    name: 'Kaunda Suits',
    category: 'dry-cleaning',
    price: 400,
    priceUnit: 'per suit',
    turnaround: '24-48 Hours',
    description: 'Specialized dry cleaning and pressing for Kaunda suits and Safari suits.',
    popular: false,
    features: ['Fiber-safe solvent cleaning', 'Crisp button line pressing', 'Garment bag']
  },
  {
    id: 's-21',
    name: 'Kids\' Suits',
    category: 'dry-cleaning',
    price: 250,
    priceUnit: 'per suit',
    turnaround: '24-48 Hours',
    description: 'Gentle cleaning for children\'s formal suits and ceremonial wear.',
    popular: false,
    features: ['Gentle solvent wash', 'Soft finish', 'Stain removal']
  },
  {
    id: 's-22',
    name: 'White / Cream Coat',
    category: 'dry-cleaning',
    price: 250,
    priceUnit: 'per coat',
    turnaround: '24-48 Hours',
    description: 'Specialized optical brightening and stain extraction for white and cream coats.',
    popular: false,
    features: ['Color protection', 'Yellowing defense', 'Steam press']
  },
  {
    id: 's-23',
    name: 'Trench Coat (Long)',
    category: 'dry-cleaning',
    price: 550,
    priceUnit: 'per coat',
    turnaround: '48 Hours',
    description: 'Deep dry cleaning and water-repellent finishing for long trench coats.',
    popular: false,
    features: ['Water-repellent finish', 'Belt & buckle protection', 'Deep dust extraction']
  },
  {
    id: 's-24',
    name: 'Trench Coat (Short)',
    category: 'dry-cleaning',
    price: 450,
    priceUnit: 'per coat',
    turnaround: '48 Hours',
    description: 'Dry cleaning for short trench coats and heavy rain jackets.',
    popular: false,
    features: ['Fabric conditioning', 'Crisp steam press']
  },
  {
    id: 's-10',
    name: 'Suede / Leather Coat',
    category: 'dry-cleaning',
    price: 700,
    priceUnit: 'per coat',
    turnaround: '72 Hours',
    description: 'Conditioning, stain treatment, and shine restoration for genuine leather coats, jackets, and suede items.',
    popular: false,
    features: ['Natural oil conditioning', 'Suppleness restoration', 'Waterproof coating', 'Mildew defense']
  },
  {
    id: 's-25',
    name: 'Jacket',
    category: 'dry-cleaning',
    price: 300,
    priceUnit: 'per jacket',
    turnaround: '24-48 Hours',
    description: 'Dry cleaning for casual jackets, bombers, and winter coats.',
    popular: false,
    features: ['Lining deodorization', 'Stain treatment', 'Form pressing']
  },
  {
    id: 's-26',
    name: 'Coat / Blazer',
    category: 'dry-cleaning',
    price: 250,
    priceUnit: 'per coat',
    turnaround: '24-48 Hours',
    description: 'Professional dry cleaning and pressing for formal blazers and coats.',
    popular: false,
    features: ['Shoulder padding support', 'Lapel steaming']
  },
  {
    id: 's-27',
    name: 'Trouser',
    category: 'dry-cleaning',
    price: 200,
    priceUnit: 'per trouser',
    turnaround: '24-48 Hours',
    description: 'Dry cleaning and sharp crease steam pressing for official trousers.',
    popular: false,
    features: ['Sharp crease alignment', 'Pocket cleaning', 'Waistband refresh']
  },
  {
    id: 's-4',
    name: 'Dress Plain',
    category: 'dry-cleaning',
    price: 300,
    priceUnit: 'per dress',
    turnaround: '48 Hours',
    description: 'Gentle wet-clean or dry-clean process tailored for plain dresses and evening wear.',
    popular: false,
    features: ['Individual mesh care', 'No harsh chemicals', 'Shape retention drying', 'Delicate steam finishing']
  },
  {
    id: 's-28',
    name: 'Dress Pleated',
    category: 'dry-cleaning',
    price: 450,
    priceUnit: 'per dress',
    turnaround: '48 Hours',
    description: 'Delicate dry cleaning and precise hand pleat setting for pleated dresses.',
    popular: false,
    features: ['Hand pleat setting', 'Color preservation', 'Silk/chiffon safe']
  },
  {
    id: 's-29',
    name: 'Plain Skirt',
    category: 'dry-cleaning',
    price: 150,
    priceUnit: 'per skirt',
    turnaround: '24-48 Hours',
    description: 'Dry cleaning and steam pressing for plain skirts.',
    popular: false,
    features: ['Hemline preservation', 'Stain removal']
  },
  {
    id: 's-30',
    name: 'Pleated Skirt',
    category: 'dry-cleaning',
    price: 350,
    priceUnit: 'per skirt',
    turnaround: '48 Hours',
    description: 'Specialized pleat restoration and dry cleaning for pleated skirts.',
    popular: false,
    features: ['Pleat alignment', 'Fabric softening']
  },
  {
    id: 's-31',
    name: 'Blouse',
    category: 'dry-cleaning',
    price: 150,
    priceUnit: 'per blouse',
    turnaround: '24 Hours',
    description: 'Delicate wash and steam iron for women\'s blouses and tops.',
    popular: false,
    features: ['Gentle solvent', 'Fabric protection']
  },
  {
    id: 's-32',
    name: 'Linen Suit',
    category: 'dry-cleaning',
    price: 550,
    priceUnit: 'per suit',
    turnaround: '48 Hours',
    description: 'Wrinkle-safe dry cleaning and crisp pressing for pure linen suits.',
    popular: false,
    features: ['Linen fiber care', 'Steam pressing']
  },
  {
    id: 's-33',
    name: 'Vitenge / Traditional Dress',
    category: 'dry-cleaning',
    price: 400,
    priceUnit: 'per dress',
    turnaround: '48 Hours',
    description: 'Color-lock dry cleaning for African print Vitenge, Ankara, and traditional attire.',
    popular: false,
    features: ['Color bleed protection', 'Embroidery care']
  },
  {
    id: 's-34',
    name: 'Cashmere Wool Sweater',
    category: 'dry-cleaning',
    price: 600,
    priceUnit: 'per sweater',
    turnaround: '48 Hours',
    description: 'Ultra-gentle dry cleaning for 100% cashmere and merino wool knits.',
    popular: false,
    features: ['Shrinkage protection', 'Debobbling treatment']
  },
  {
    id: 's-35',
    name: 'Cashmere with Leather Trim',
    category: 'dry-cleaning',
    price: 650,
    priceUnit: 'per item',
    turnaround: '72 Hours',
    description: 'Dual-phase cleaning for cashmere knitwear featuring genuine leather trims.',
    popular: false,
    features: ['Dual material care', 'Leather conditioning']
  },
  {
    id: 's-36',
    name: 'Sleeping Bag',
    category: 'dry-cleaning',
    price: 500,
    priceUnit: 'per item',
    turnaround: '48 Hours',
    description: 'Deep sanitizing and drying for outdoor sleeping bags.',
    popular: false,
    features: ['Thermal sanitization', 'Fluffing loft restoration']
  },

  // Duvet Clinic
  {
    id: 's-5',
    name: 'Duvet Cleaning (1 piece)',
    category: 'duvet-clinic',
    price: 850,
    priceUnit: 'per duvet',
    turnaround: '24 Hours',
    description: 'High-volume machine wash and thermo-sanitizing dry for single/double fiberfill and feather duvets.',
    image: '/src/assets/images/service_duvet_clinic_1790275460988.jpg',
    popular: true,
    features: ['Thermo-sanitization', 'Anti-dustmite rinse', 'Deep stain removal', 'Protective carry sleeve']
  },
  {
    id: 's-6',
    name: 'Duvet Cleaning (2 piece)',
    category: 'duvet-clinic',
    price: 1400,
    priceUnit: 'per duvet set',
    turnaround: '24 Hours',
    description: 'Heavy duty deep cleaning for large king/queen size heavy duvets, comforters, and thick 2-piece sets.',
    popular: true,
    features: ['Thermal sanitization', 'Anti-fungal rinse', 'Deep stain removal', 'Protective carry sleeve']
  },
  {
    id: 's-37',
    name: 'Pillow Wash (1 pair)',
    category: 'duvet-clinic',
    price: 450,
    priceUnit: '1 pair',
    turnaround: '24 Hours',
    description: 'Deep hygienic wash for sleeping pillows.',
    popular: false,
    features: ['Dustmite removal', 'High heat drying', 'Pair processing']
  },
  {
    id: 's-38',
    name: 'Pillow Dry (1 pair)',
    category: 'duvet-clinic',
    price: 450,
    priceUnit: '1 pair',
    turnaround: '24 Hours',
    description: 'Thermal tumble drying and fluffing for sleeping pillows.',
    popular: false,
    features: ['Loft restoration', 'Odour elimination']
  },

  // Carpets & Curtains
  {
    id: 's-7',
    name: 'Mattress Cover (3kg)',
    category: 'carpet-cleaning',
    price: 500,
    priceUnit: 'load',
    turnaround: '48 Hours',
    description: 'Deep extraction steam cleaning for household mattress covers, living room runners, and woolen rugs.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQhs8fYKq1Mx-BHvcne2U2apFbcqEyIqCQsi4pw6652nOdFNWkNq0XQYfYPMjaRps25mxRVpwInN7aSf0YylSnnen8YHUVoI6h2kumBeDMiVrTXs9Ohi7gVXRIwpPAPNsRT8kOzjC4ddrrsvXlOp5Lp9Ur-mGHa-ztof3hW8SBZ91E-BwU0R4YfAMWyzBuko3oOisdK5v-Cs4w1VJGc58pdky4XlsrB3NW-44aKaMjprEvrBxHdhWoIKK4rFSCXdqM1m_DNSnigMc',
    popular: false,
    features: ['Deep pile dirt extraction', 'Odour neutralizing treatment', 'Pet stain removal', 'Fast dry technology']
  },
  {
    id: 's-8',
    name: 'Curtains Dry (3kg)',
    category: 'carpet-cleaning',
    price: 500,
    priceUnit: 'load',
    turnaround: '48 Hours',
    description: 'Specialized moisture extraction and dry cleaning for blackout curtains and velvet drapes.',
    popular: false,
    features: ['Dust extraction', 'Fabric shrinkage protection', 'Pleat setting']
  },
  {
    id: 's-39',
    name: 'Curtains Iron (3kg)',
    category: 'carpet-cleaning',
    price: 500,
    priceUnit: 'load',
    turnaround: '48 Hours',
    description: 'Steam pressing and pleat setting for household drapes and curtains.',
    popular: false,
    features: ['Steam pleat setting', 'Ring & hook preservation']
  },

  // Janitorial
  {
    id: 's-9',
    name: 'Post-Construction & Deep Janitorial Cleaning',
    category: 'janitorial',
    price: 4500,
    priceUnit: 'per visit',
    turnaround: 'Scheduled',
    description: 'Comprehensive post-build dust removal, tile scrub, window polishing, and sanitization for homes & offices.',
    popular: false,
    features: ['Industrial floor scrubbers', 'HEPA dust extraction', 'Window & glass polish', 'Full team deployment']
  }
];

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'b-rongai',
    name: 'Rongai Branch',
    locationName: 'Rongai, Kajiado North',
    fullAddress: 'Hill Valley Place Magadi Road, near Magenche, Rongai',
    phone: '0777349743',
    phoneDisplay: '0777 349 743',
    whatsapp: '254777349743',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIauRqDwNNseA1BWDS5DVN4CUlRPdOdbW50FQr8JNx5k9j8J3hiT8nWvdVevf0unx4psPitfXiPwq1fMBIJsuAIvRlvCWvv1B_H29Y1_NiHTCezSclJRq9yy-e2MnwJefxDeK2t3oR-8FdnDInEXeimfkfzSkfrn7Q1dleXJaBQ4WPC6iyeGgXk42jvY3hJTrFp2j4YuMIwcJM1lBrRXLevB9RygPJPcBfkxfOeRrrVbmVsSwwOeQ4HuorLNYJtgHcLi3zyFqPX0A',
    mapQuery: 'Hill Valley Place Magadi Road Rongai',
    hours: 'Mon - Sat: 7:00 AM - 8:00 PM'
  },
  {
    id: 'b-ngong',
    name: 'Ngong Branch',
    locationName: 'Ngong Town, Kajiado',
    fullAddress: 'Ngong Town, Country Arcade',
    phone: '0777140102',
    phoneDisplay: '0777 140 102',
    whatsapp: '254777140102',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7d5Wgn8EPWwo6TWYedEzul0jxh3KOdoKNQ0Uv2J5ooFxewjkQF9yPq-ORDdJdeoPmk2ayVnQr9LVVW7T4RAQdVDJkKm7xt_e70iN58NuMBj5OaTfYem8C5Kxtxl0Fy6Z86226nB8Kh0JSQgVGpQOAn_If6S-ccJdyx_faEDo6MFywjxj3nikjRG3MTqsQYvYMPPdv8boeJfrRjlr63zvDWbdN5VkV0DNv4of2AG5oZif0xkOyKont6MjhleV-ObSTFGSWUlj_7ks',
    mapQuery: 'Country Arcade Ngong Town',
    hours: 'Mon - Sat: 7:00 AM - 8:00 PM'
  }
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'GT-8829',
    customerName: 'Faith Wanjiku',
    phone: '0777349743',
    branch: 'Rongai Branch',
    address: 'Hill Valley Place, Magadi Road, Rongai',
    items: [
      { serviceName: 'Super Package (Wash, Dry, Iron & Fold)', quantity: 1, unitPrice: 1300 },
      { serviceName: 'King & Queen Heavy Duvet Clinic (2-pc)', quantity: 1, unitPrice: 1400 }
    ],
    totalPrice: 2700,
    status: 'In Wash & Revitalizing',
    createdAt: 'Today, 09:30 AM',
    estimatedDelivery: 'Tomorrow, 04:00 PM',
    paymentStatus: 'Paid via M-Pesa',
    mpesaRef: 'RKS998210M',
    deliveryType: 'Delivery to Door',
    specialNotes: 'Driver currently at Ngong Road hub on route to Hill Valley Place.',
    trackingNotes: [
      { time: '09:30 AM, Today', note: 'Order received at Rongai Hub.', status: 'Order Received' },
      { time: '11:15 AM, Today', note: 'Washing/Cleaning initiated in Eco Drum #2.', status: 'Inspection & Sorting' },
      { time: '12:45 PM, Today', note: 'Ironing/Folding in progress with crisp steam press.', status: 'In Wash & Revitalizing' }
    ]
  },
  {
    id: 'GL-1234',
    customerName: 'David Njoroge',
    phone: '0712 345 678',
    branch: 'Rongai Branch',
    address: 'Hill Valley Estate, Magadi Rd, Rongai',
    items: [
      { serviceName: 'Wash & Fold Laundry', quantity: 1, unitPrice: 450 },
      { serviceName: 'King & Queen Heavy Duvet Clinic (2-pc)', quantity: 1, unitPrice: 1400 }
    ],
    totalPrice: 1850,
    status: 'In Wash & Revitalizing',
    createdAt: 'Today, 09:15 AM',
    estimatedDelivery: 'Tomorrow, 04:00 PM',
    paymentStatus: 'Paid via M-Pesa',
    mpesaRef: 'RKL892104X',
    deliveryType: 'Delivery to Door',
    specialNotes: 'Please extra fabric softener for duvet and lavender scent spray.',
    trackingNotes: [
      { time: '09:15 AM', note: 'Order collected at customer address by Goldtribe Express Rider (James).', status: 'Order Received' },
      { time: '10:00 AM', note: 'Order logged at Rongai Hub. Garments tagged, weighed and stain inspected.', status: 'Inspection & Sorting' },
      { time: '11:30 AM', note: 'Loaded into Eco-Wash Drum #4 with thermal sanitizing bath.', status: 'In Wash & Revitalizing' }
    ]
  },
  {
    id: 'GL-2089',
    customerName: 'Grace Mutua',
    phone: '0722 987 654',
    branch: 'Ngong Branch',
    address: 'Matasia, Ngong-Kiserian Rd',
    items: [
      { serviceName: '2-Piece Suit Dry Cleaning', quantity: 2, unitPrice: 450 },
      { serviceName: 'Plain Dress Dry Cleaning', quantity: 1, unitPrice: 300 }
    ],
    totalPrice: 1200,
    status: 'Ready for Pickup / Out for Delivery',
    createdAt: 'Yesterday, 11:30 AM',
    estimatedDelivery: 'Today, 05:00 PM',
    paymentStatus: 'Paid via M-Pesa',
    mpesaRef: 'RKM554312Z',
    deliveryType: 'Delivery to Door',
    specialNotes: 'Hang suits in breathable garment bags.',
    trackingNotes: [
      { time: 'Yesterday 11:30 AM', note: 'Dropped off at Ngong Branch (Country Arcade).', status: 'Order Received' },
      { time: 'Yesterday 02:00 PM', note: 'Chemical-free delicate dry clean completed.', status: 'In Wash & Revitalizing' },
      { time: 'Today 09:00 AM', note: 'Passed 5-point quality check. Steam pressed and packaged.', status: 'Quality Check' },
      { time: 'Today 01:15 PM', note: 'Out for doorstep delivery with Rider Peter (0777140102).', status: 'Ready for Pickup / Out for Delivery' }
    ]
  },
  {
    id: 'GL-3041',
    customerName: 'Amina Hassan',
    phone: '0733 112 233',
    branch: 'Rongai Branch',
    address: 'Rimpa, Rongai',
    items: [
      { serviceName: 'Mattress Cover / Rug Deep Cleaning', quantity: 2, unitPrice: 500 }
    ],
    totalPrice: 1000,
    status: 'Quality Check',
    createdAt: '22 Jul 2026, 02:00 PM',
    estimatedDelivery: 'Today, 06:00 PM',
    paymentStatus: 'Pay on Delivery',
    deliveryType: 'Delivery to Door',
    trackingNotes: [
      { time: '22 Jul 02:00 PM', note: 'Carpet picked up from Rimpa residence.', status: 'Order Received' },
      { time: '23 Jul 10:00 AM', note: 'Deep steam pile extraction and stain removal performed.', status: 'In Wash & Revitalizing' },
      { time: 'Today 10:30 AM', note: 'Final inspection for moisture and scent audit completed.', status: 'Quality Check' }
    ]
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'mem-1',
    name: 'Gold Starter',
    price: 3500,
    period: 'per month',
    description: 'Perfect for busy single professionals in Rongai & Ngong needing clean clothes weekly without stress.',
    features: [
      'Up to 20kg Wash & Fold per month',
      'Free Doorstep Pickup & Delivery twice a month',
      '1 Free Duvet Wash per month',
      '10% Discount on Dry Cleaning',
      'Priority 24-hr Turnaround'
    ],
    popular: false,
    color: 'border-outline-variant bg-white'
  },
  {
    id: 'mem-2',
    name: 'Gold Family Pass',
    price: 7500,
    period: 'per month',
    description: 'Complete household package designed to handle laundry and duvets for 3-5 family members.',
    features: [
      'Up to 55kg Wash & Fold per month',
      'Free Unlimited Weekly Doorstep Pickups',
      '3 Free King Duvet Washes per month',
      '2 Free Suits / Dresses Dry Cleaned',
      '20% Discount on Carpet Cleaning',
      'Dedicated Express Support Agent'
    ],
    popular: true,
    color: 'border-secondary-container bg-gradient-to-br from-white via-[#fdf8eb] to-[#fed65b]/20 shadow-xl ring-2 ring-[#fed65b]'
  },
  {
    id: 'mem-3',
    name: 'Commercial Executive',
    price: 18000,
    period: 'per month',
    description: 'Tailored for boutique hotels, Airbnb hosts, law firms, and offices needing pristine linens and uniforms.',
    features: [
      'Up to 150kg Commercial Wash & Iron',
      'Daily Scheduled Pickup & Return',
      'Free Starch & Hanger Packaging',
      'Janitorial Office Floor Polish Voucher',
      'Monthly Invoicing & VAT Receipts',
      '12-Hour Emergency Express Service'
    ],
    popular: false,
    color: 'border-outline-variant bg-white'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r-1',
    author: 'Wanjiku M.',
    branch: 'Ngong Branch',
    rating: 5,
    comment: 'They picked up from my office in Ngong and delivered same day. Clothes came back smelling amazing and better than new! Usafi: Kazi Yetu is 100% real.',
    date: '2 days ago',
    verified: true
  },
  {
    id: 'r-2',
    author: 'Mama Brian',
    branch: 'Rongai Branch',
    rating: 5,
    comment: 'As a busy mother in Rongai, Goldtribe\'s doorstep pickup saved my weekend. Clothes ironed and folded to absolute perfection! The Gold Family Pass is worth every shilling.',
    date: '5 days ago',
    verified: true
  },
  {
    id: 'r-3',
    author: 'Eng. Kevin Ochieng',
    branch: 'Rongai Branch',
    rating: 5,
    comment: 'Rescued my expensive wool suit before an executive conference in Upperhill. Cleaned, pressed, and delivered back to Hill Valley in under 24 hours with M-Pesa tracking updates!',
    date: '1 week ago',
    verified: true
  }
];

export const FAQS = [
  {
    q: 'How does doorstep pickup and delivery work in Rongai and Ngong?',
    a: 'Simply click "Book a Collection" on our website, select your items or estimated weight, pick your address (Rongai, Ngong, Matasia, Karen, Kiserian, Langata, etc.), and choose a time slot. Our Goldtribe Express rider will arrive with laundry bags to weigh and tag your clothes on the spot.'
  },
  {
    q: 'What is the standard turnaround time for laundry and dry cleaning?',
    a: 'Standard Wash & Fold is 24 hours. Executive Dry Cleaning and Duvet Clinic are 24-48 hours. Carpet cleaning takes 48 hours to ensure complete moisture extraction. We also offer same-day express turnaround for urgent requests!'
  },
  {
    q: 'How do I pay for my laundry order?',
    a: 'We accept M-Pesa (Till / Paybill / STK Push prompt directly on your phone) as well as Cash on Delivery or Card. You can pay when booking online or upon delivery when you inspect your garments.'
  },
  {
    q: 'Are your detergents safe for sensitive skin and baby clothes?',
    a: 'Yes! We use hypoallergenic, bio-degradable, eco-friendly detergents and optional fragrance-free baby-safe rinses. You can specify your detergent preferences during online checkout.'
  },
  {
    q: 'Where are your physical branches located?',
    a: 'Rongai Branch is located at Hill Valley Place Magadi Road (near Magenche). Ngong Branch is located at Country Arcade in Ngong Town. You are welcome to drop off your items directly or request collection!'
  }
];
