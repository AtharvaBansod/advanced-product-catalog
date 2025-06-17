# Advanced Product Catalog - Cad & Cart | Atharva Bansod

An e-commerce product catalog with dynamic filtering, cart functionality, and product ratings built with Next.js, Tailwind CSS, and shadcn/ui.

### Live
- [https://advanced-product-catalog-atharva-ba.vercel.app/](https://advanced-product-catalog-atharva-ba.vercel.app/) 

> Note: Sockets don't work on Vercel due to serverless nature of Vercel, so - even though i have Implemented sockets to check Stocks during `addToCart`, I have put check of `process.env.NODE_ENV === 'development'` so that production code doesn't crash due to re-connection tries

> clone https://github.com/AtharvaBansod/advanced-product-catalog.git & `npm run dev` to see sockets working !

## Features

- Product catalog with pagination
- Advanced search with autocomplete suggestions
- Shopping cart functionality
- Product rating system
- Category-based product filtering
- Price range filtering
- Responsive design for all devices

## Installation

1. Clone the repository:
```bash
git clone https://github.com/AtharvaBansod/advanced-product-catalog.git
```

2. Navigate to the project directory:
```bash
cd advanced-product-catalog
```

3. Install dependencies:
```bash
npm install
```

4. Set up socket server:
```bash
cd socket-server-proto
npm i
node index.js
```

5. Run the development server:
```bash
# new terminal in root - advanced-product-catalog/
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser. 


## Break Down of task - `Planning`

#### Product Catalog
- Display products with images, prices, and ratings
- `Pagination` for desktop users
- `Infinite scroll` for mobile users
- Product details page with image gallery

#### Filtering System
- Category filtering
- Price range slider
- Minimum rating filter
- Sort by options (price, rating, name)

#### Search Functionality
- `Debounced` search input
- Real-time search suggestions
- Search results page

#### Shopping Cart
- Add/remove products
- Quantity adjustment
- Cart persistence (client-side)
- Cart summary with total price & quantity

#### Product Ratings
- Star-based rating system
- Customer reviews
- Average rating calculation
- Review submission form


## Challenges

1. **API Limitations**:
   - Using dummyjson.com as mock API with limited functionality
   - Thus seting up logic for Cart functionality

2. **Mobile Experience**:
   - Some filter options may be cramped on smaller screens
   - Infinite scroll could be optimized for better performance

3. **Error handling**:
   - Using Try Catch blocks frequently to prevent crashes due to failure of functionality 

4. **Accessibility**:
   - Some interactive elements may need better ARIA labels

4. **Time Management**:
   - Just 1 day time period made me focus more on application of functionalities instead of planning detailed solutions, and way was created to optimize code as per flow of things, making detailed architecture drive this App !
   


## Technologies Used

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons
- Framer Motion (for animations)
- Socket io


---

# Action Plan for Implementation:

### 1. Project Initialization

1. Created Next.js project with TypeScript template:
   npx create-next-app@latest advanced-product-catalog --typescript

2. Set up Tailwind CSS:
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init

3. Configured shadcn/ui:
   npx shadcn-ui@latest init
   Selected components: button, card, input, badge, sheet, etc.

4. Established folder structure:
```
   ├── src/
   │   ├── app/          # App router
   │   ├── components/   # Reusable UI components
   │   ├── contexts/     # React contexts
   │   ├── hooks/        # Custom hooks
   │   ├── lib/          # Utility functions
   │   └── types/        # TypeScript types
```

### 2. Core Architecture Implementation

1. Set up API Context:
   - Created ApiContext.tsx with methods for:
     * fetchProducts()
     * fetchProductById()
     * searchProducts()
     * fetchProductsByCategory()
   - Implemented error handling and loading states

2. Built Cart System:
   - Created CartContext.tsx with:
     * addToCart()
     * removeFromCart()
     * updateQuantity()
     * clearCart()
   - Designed cart state structure
   - Implemented local storage persistence

3. Developed Product Models:
   - Defined TypeScript interfaces:
     * Product
     * CartItem
     * FilterOptions
     * Review

> I used AI to write code of Components which were mostly Shadcn UI components and simple API calls via apiContext, so that i get **enough time** in `Implementing Core Logic` of *Cart*, *Search* *Pagination*, *Filter* and *Socket*


### 3. UI Component Development

1. Product Card Component:
   - Created responsive card layout
   - Added image, title, price, rating display
   - Implemented "Add to Cart" functionality
   - Added hover animations with Framer Motion

2. Product Grid:
   - Responsive grid layout (1-4 columns)
   - Loading skeleton states
   - Empty state handling

3. Filter System:
   - Built filter sidebar with:
     * Category dropdown
     * Price range slider
     * Rating selector
     * Sort options
   - Created mobile filter sheet version

4. Search Components:
   - Search bar with debounced input
   - Autocomplete suggestions dropdown
   - Search results page


### 4. Page Implementation

1. Home Page (/):
   - Implemented dual loading strategies:
     * Pagination for desktop
     * Infinite scroll for mobile
   - Integrated filter system
   - Added loading states

2. Product Detail Page (/product/[id]):
   - Created image gallery with thumbnail navigation
   - Implemented rating system
   - Added "Similar Products" section
   - Built review submission form

3. Search Page (/search):
   - Query parameter handling
   - Results display with empty state
   - Integrated with search API

4. Cart Page (/cart):
   - Cart items list with quantity controls
   - Order summary section
   - Empty cart state


### 5. State Management Integration

1. Connected components to contexts:
   - ProductGrid → ApiContext
   - ProductCard → CartContext
   - Filters → ApiContext + local state

2. Implemented derived states:
   - Filtered products
   - Paginated products
   - Cart totals calculation

3. Added state persistence:
   - Cart items in localStorage
   - Filter preferences in URL params


### 6. Performance Optimization

1. Implemented:
   - Image optimization with Next.js Image
   - Dynamic imports for heavy components
   - Debounced search inputs
   - Loading boundaries

2. Configured:
   - Static page generation for product pages
   - Client-side fetching for dynamic data

### 7. Socket set up

1. Implemented:
   - Socket io server to use `dummyApi` to ceck real time stocks of preducts
   - Connecting client i.e our Next App with Socket server using `socket-client`
   - Implementing event emits for getting proper live updates

### 8. Deployment 

1. Configuration:
   - Set up next.config.js
   - Configured build settings

2. Final Checks:
   - Verified production build
   - Tested deployed version
   - Checked console errors
