# Setup Checklist for Bahari Fresh

Use this checklist to ensure everything is properly configured before deployment.

## Prerequisites
- [ ] Node.js (v14+) installed
- [ ] npm or yarn package manager
- [ ] Supabase account (supabase.com)
- [ ] M-Pesa Daraja account (sandbox or production)
- [ ] Git installed

## Backend Setup

### Step 1: Dependencies
```bash
cd backend
npm install
```
- [ ] Dependencies installed without errors
- [ ] node_modules/ folder created

### Step 2: Environment Configuration
```bash
cp .env.example .env
```
- [ ] `.env` file created in backend folder
- [ ] All values filled in (don't leave empty):
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_KEY
  - [ ] MPESA_CONSUMER_KEY
  - [ ] MPESA_CONSUMER_SECRET
  - [ ] MPESA_SHORTCODE
  - [ ] MPESA_PASSKEY
  - [ ] MPESA_CALLBACK_URL
  - [ ] MPESA_ENVIRONMENT (sandbox or production)
  - [ ] PORT (default 5000)

### Step 3: Start Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] Console shows: "Server running on port 5000"
- [ ] Health check works: curl http://localhost:5000/api/health
- [ ] Response shows: `{"status":"OK"}`

## Frontend Setup

### Step 1: Verify Configuration
- [ ] index.html has correct SUPABASE_URL
- [ ] index.html has correct SUPABASE_KEY
- [ ] admin.html has correct SUPABASE_URL
- [ ] admin.html has correct SUPABASE_KEY

### Step 2: Start Local Server
```bash
cd frontend
python -m http.server 8000
# OR
npx http-server . -p 8000
```
- [ ] Frontend server starts
- [ ] Visit http://localhost:8000
- [ ] Page loads without errors
- [ ] Check browser console for errors (F12)

### Step 3: Test Basic Functionality
- [ ] Products load on page
- [ ] Can add items to cart
- [ ] Cart displays correct total
- [ ] Can search products
- [ ] Can filter by category

## Supabase Configuration

### Step 1: Create Database Tables
Execute in Supabase SQL Editor:

```sql
-- Products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  customer_phone VARCHAR(20),
  items JSONB,
  total DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'pending',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

- [ ] All tables created successfully
- [ ] Tables visible in Supabase dashboard

### Step 2: Create Storage Bucket
- [ ] Go to Supabase Storage
- [ ] Create bucket named: `product-images`
- [ ] Set to Public
- [ ] Add sample image (test upload)

### Step 3: Enable Email Authentication
- [ ] Go to Authentication settings
- [ ] Enable Email/Password provider
- [ ] Configure email templates (optional)

### Step 4: Add Admin User
- [ ] Go to admin_users table
- [ ] Insert your email
- [ ] Test admin login

## API Testing

### Step 1: Test Products Endpoint
```bash
curl http://localhost:5000/api/products
```
- [ ] Returns empty array or product list
- [ ] Status code is 200

### Step 2: Test M-Pesa Endpoint
```bash
curl -X POST http://localhost:5000/api/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{"phone":"254712345678","cart":[{"name":"Fish","price":500,"quantity":1}]}'
```
- [ ] Returns success or error message
- [ ] Check M-Pesa Daraja logs for request

### Step 3: Test Orders Endpoint
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"phone":"254712345678","items":"Fish x1","total":500,"user_id":"test"}'
```
- [ ] Order created successfully
- [ ] Can retrieve with GET /api/orders

## User Testing

### Test 1: Customer Flow
- [ ] Go to index.html
- [ ] Browse products
- [ ] Add items to cart
- [ ] Click checkout
- [ ] Enter email/password (register or login)
- [ ] Enter phone number
- [ ] Click "Pay via M-Pesa"
- [ ] Check M-Pesa logs for STK push request

### Test 2: Admin Flow
- [ ] Go to admin.html
- [ ] Login with admin email
- [ ] Navigate to Products section
- [ ] Add new product
- [ ] Update product price
- [ ] Upload product image
- [ ] View orders section
- [ ] View admin users section

### Test 3: Error Handling
- [ ] Try invalid phone number - should show error
- [ ] Try empty cart checkout - should show error
- [ ] Try without logging in - should redirect to login

## Before Going Live

### Security
- [ ] Remove test credentials from code
- [ ] Verify .env is in .gitignore
- [ ] Check no secrets in git history
- [ ] Enable HTTPS for production domain
- [ ] Set M-Pesa environment to production (if ready)

### Performance
- [ ] Test with slow internet (throttle in DevTools)
- [ ] Test on mobile devices
- [ ] Check image load times
- [ ] Verify caching works

### Database
- [ ] Backup Supabase database
- [ ] Test order query performance
- [ ] Set up automated backups

### Monitoring
- [ ] Set up error logging (Sentry, LogRocket, etc.)
- [ ] Monitor API response times
- [ ] Log all transactions
- [ ] Set up alerts for failures

## Deployment Checklist

### Frontend (Netlify/Vercel)
- [ ] Create account on Netlify or Vercel
- [ ] Connect GitHub repository
- [ ] Set build directory to `frontend`
- [ ] Configure custom domain
- [ ] Enable auto-deploys on push

### Backend (Heroku/Railway)
- [ ] Create account on Heroku or Railway
- [ ] Create new app
- [ ] Connect GitHub repository
- [ ] Add environment variables in dashboard
- [ ] Enable automatic deploys

### DNS & Domain
- [ ] Register domain (if needed)
- [ ] Point domain to hosting service
- [ ] Set up SSL certificate (usually automatic)
- [ ] Test https://yourdomain.com works

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Products not loading | Check Supabase connection, verify SUPABASE_KEY, check browser console |
| M-Pesa errors | Verify credentials in .env, check Daraja sandbox/production setting |
| Auth not working | Check Supabase has email auth enabled, verify redirect URLs |
| CORS errors | Check backend has `cors()` middleware enabled |
| Images not showing | Check storage bucket is public, verify image URL is correct |
| Admin can't access | Ensure email is in admin_users table |

## Support Resources

- Supabase Docs: https://supabase.com/docs
- Express Docs: https://expressjs.com
- M-Pesa Daraja: https://developer.safaricom.co.ke
- Netlify Docs: https://docs.netlify.com
- Vercel Docs: https://vercel.com/docs

---

**Checklist Version:** 1.0  
**Last Updated:** April 28, 2026  
**Status:** Ready for setup
