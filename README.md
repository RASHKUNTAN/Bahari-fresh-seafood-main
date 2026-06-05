# Bahari Fresh - Premium Seafood Marketplace

Online marketplace for daily fresh fish and ocean-to-table seafood delivery in Kenya.

## Features

- 🐟 Fresh seafood products showcase
- 🛒 Shopping cart with persistent storage
- 💳 M-Pesa Daraja payment integration
- 👤 User authentication via Supabase
- 🛡️ Admin dashboard for product & order management
- 📱 Responsive mobile design
- 🔐 Secure payment processing

## Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Supabase JavaScript Client
- Service Worker for offline support

**Backend:**
- Node.js + Express.js
- Supabase (PostgreSQL, Auth, Storage)
- M-Pesa Daraja API
- Axios for HTTP requests

## Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/RASHKUNTAN/Bahari-fresh-seafood.git
cd Bahari-fresh-seafood
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with:
- **Supabase**: Your project URL and anon key
- **M-Pesa**: Consumer key, secret, shortcode, passkey
- **Server**: Port and environment

```bash
# Example .env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
MPESA_CONSUMER_KEY=your_key
MPESA_CONSUMER_SECRET=your_secret
MPESA_SHORTCODE=174379
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=https://your-domain.com/api/mpesa/callback
MPESA_ENVIRONMENT=sandbox
PORT=5000
```

#### Start Server
```bash
npm run dev    # Development (with nodemon)
npm start      # Production
```

Server runs on `http://localhost:5000`

### 3. Frontend Setup

Frontend files are in the `frontend/` directory. Deploy to:
- **Production**: Netlify, Vercel, GitHub Pages
- **Local Development**: Simple HTTP server

```bash
# Option 1: Python
cd frontend
python -m http.server 8000

# Option 2: Node.js
npx http-server frontend -p 8000
```

Visit `http://localhost:8000`

## Supabase Database Schema

**Tables needed:**
- `products` (id, name, price, category, stock_quantity, image_url)
- `orders` (id, customer_phone, items, total, status, created_at, user_id)
- `admin_users` (id, email, created_at)

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/user/:userId` - Get user orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status (admin)

### M-Pesa
- `POST /api/mpesa/stkpush` - Initiate payment prompt
- `POST /api/mpesa/callback` - M-Pesa callback handler

## Key Files

```
frontend/
├── index.html          # Main marketplace
├── admin.html          # Admin dashboard
├── verify-email.html   # Email verification
├── reset-password.html # Password reset
├── style.css           # Styles (embedded in HTML)
├── sw.js               # Service Worker
└── manifest.json       # PWA manifest

backend/
├── server.js           # Express app
├── package.json        # Dependencies
├── .env.example        # Environment template
├── routes/             # API routes
├── controllers/        # Business logic
├── middleware/         # Custom middleware
├── models/             # Data models
└── utils/              # Helper functions
```

## Security Notes

⚠️ **Important:**
- Never commit `.env` file (use `.env.example`)
- Keep Supabase keys secure
- Validate all user inputs on backend
- Use HTTPS in production
- Enable M-Pesa callback signature verification

## Deployment

### Frontend Deployment (Netlify/Vercel)
1. Push to GitHub
2. Connect repository to Netlify/Vercel
3. Set build directory to `frontend/`
4. Deploy

### Backend Deployment (Heroku/Railway)
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Set environment variables: `heroku config:set KEY=value`
4. Deploy: `git push heroku main`

## Troubleshooting

### M-Pesa Not Working
- Verify credentials in `.env`
- Check Daraja environment (sandbox vs production)
- Confirm callback URL is publicly accessible

### Products Not Loading
- Check Supabase connection
- Verify table exists with correct schema
- Check browser console for errors

### Payment Fails
- Validate phone number format (254)
- Check M-Pesa account balance
- Verify amount is within limits

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## Support

For issues, questions, or feedback, please create a GitHub issue.

## License

MIT License - see LICENSE file for details
