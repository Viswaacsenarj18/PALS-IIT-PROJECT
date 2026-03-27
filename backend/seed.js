import mongoose from 'mongoose';
import Product from './models/Product.js';
import dotenv from 'dotenv';

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected for seeding');

    // Sample farmer products
    const sampleProducts = [
      {
        name: 'Organic Tomato Seeds',
        description: 'Premium hill-hybrid tomato seeds, high yield, disease resistant',
        price: 45,
        category: 'seeds',
        stock: 25,
        quality: 'Excellent',
        image: 'https://images.unsplash.com/photo-1529778873920-4da4926a72c2?w=500&h=500&fit=crop',
        seller: '64f5e2b4c7d2e8f1a2b3c4d5'
      },
      {
        name: 'NPK Fertilizer 10-20-10',
        description: 'Balanced NPK for hill crops, improves soil fertility',
        price: 350,
        category: 'fertilizers',
        stock: 40,
        quality: 'Good',
        image: 'https://images.unsplash.com/photo-1601005014349-417138d2a275?w=500&h=500&fit=crop',
        seller: '64f5e2b4c7d2e8f1a2b3c4d5'
      },
      {
        name: 'Garden Hand Tools Set',
        description: 'Premium stainless steel gardening tools for hill farming',
        price: 1200,
        category: 'tools',
        stock: 15,
        quality: 'Fair',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=500&fit=crop',
        seller: '64f5e2b4c7d2e8f1a2b3c4d5'
      }
    ];


    // Delete existing
    await Product.deleteMany({});

    // Insert samples
    await Product.insertMany(sampleProducts);
    console.log('✅ 3 sample products seeded!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seed error:', err);
    process.exit(1);
  });

