// src/mock/data.ts
export const mockProducts = [
  {
    id: '1',
    name: 'Organic Foxtail Millet',
    price: 120,
    originalPrice: 150,
    unit: 'kg',
    rating: 4.5,
    reviewCount: 128,
    image: '/images/millet1.jpg',
    inStock: true,
    isCertified: true,
    traceId: 'trace_123',
    description: '100% organic foxtail millet, rich in fiber and protein. Grown naturally without chemical fertilizers or pesticides.',
    nutrition: {
      calories: 351,
      protein: '12g',
      carbs: '63g',
      fiber: '6g',
      fat: '4g',
      vitamins: ['B1', 'B6', 'Folate', 'Iron', 'Magnesium']
    },
    seller: {
      name: 'Organic Farms Co-op',
      rating: 4.8,
      location: 'Madhya Pradesh',
      memberSince: '2020'
    },
    reviews: [
      { id: 1, user: 'Rahul K.', rating: 5, comment: 'Excellent quality millet!', date: '2023-10-15' },
      { id: 2, user: 'Priya M.', rating: 4, comment: 'Good taste and quality', date: '2023-10-10' }
    ]
  },
  // Add more mock products as needed
];

export const mockTraceData = {
  batchId: 'BATCH_12345',
  productName: 'Organic Foxtail Millet',
  harvestDate: '2023-09-15',
  expiryDate: '2024-09-15',
  origin: 'Madhya Pradesh, India',
  timeline: [
    {
      id: 1,
      date: '2023-09-10',
      event: 'Sowing',
      location: 'Farm A, Madhya Pradesh',
      description: 'Seeds sown in organic certified fields',
      images: ['/images/sowing.jpg']
    },
    {
      id: 2,
      date: '2023-09-15',
      event: 'Harvesting',
      location: 'Farm A, Madhya Pradesh',
      description: 'Manual harvesting of mature millet crops',
      images: ['/images/harvest.jpg']
    },
    {
      id: 3,
      date: '2023-09-20',
      event: 'Processing',
      location: 'Organic Processing Unit, MP',
      description: 'Cleaning, sorting, and packaging',
      images: ['/images/processing.jpg']
    }
  ]
};