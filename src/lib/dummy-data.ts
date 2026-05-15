export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  description: string;
}

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    price: 249.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    description: 'High-fidelity audio with active noise cancellation. These premium wireless headphones deliver an immersive sound experience with up to 30 hours of battery life. Crafted with aerospace-grade aluminum and memory foam ear cushions.'
  },
  {
    id: '2',
    name: 'Desk Clock',
    price: 89.50,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=1000&auto=format&fit=crop',
    description: 'A minimalist masterpiece. This desk clock features a silent sweeping mechanism, solid brass construction, and a matte black face. Perfect for maintaining focus in any workspace without distraction.'
  },
  {
    id: '3',
    name: 'Mechanical Keyboard',
    price: 159.00,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop',
    description: 'Engineered for tactile precision. Features hot-swappable switches, a machined aluminum chassis, and double-shot PBT keycaps. The ultimate tool for developers and writers who demand the best.'
  },
  {
    id: '4',
    name: 'Office Chair',
    price: 399.00,
    category: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop',
    description: 'Ergonomic excellence. Designed to support your spine during long working sessions. Features breathable mesh, adaptive lumbar support, and 4D adjustable armrests.'
  },
  {
    id: '5',
    name: 'Leather Weekend Bag',
    price: 215.00,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    description: 'Full-grain Italian leather weekend bag with solid brass hardware. Ages beautifully over time, developing a unique patina. Spacious enough for a 3-day trip.'
  },
  {
    id: '6',
    name: 'Ceramic Pour-Over Set',
    price: 65.00,
    category: 'Kitchen',
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop',
    description: 'Handcrafted ceramic pour-over coffee maker. Retains heat perfectly for optimal extraction. Includes a matching dripper, carafe, and 100 organic paper filters.'
  },
  {
    id: '7',
    name: 'Stainless Steel Watch',
    price: 295.00,
    category: 'Fashion',
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop',
    description: 'Automatic movement housed in a surgical-grade stainless steel case. Features a scratch-resistant sapphire crystal and water resistance up to 100 meters. Timeless and robust.'
  },
  {
    id: '8',
    name: 'Smart Desk Lamp',
    price: 120.00,
    category: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1534281323063-cb5e98f06536?q=80&w=1000&auto=format&fit=crop',
    description: 'Adjustable color temperature and brightness to match your circadian rhythm. Integrates seamlessly with smart home systems. Casts a perfect, glare-free pool of light.'
  }
];

export const FEATURED_PRODUCTS = PRODUCTS.slice(0, 4);
