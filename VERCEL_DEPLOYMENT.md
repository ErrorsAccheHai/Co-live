# Vercel Deployment Guide

## Project Structure
Your project is configured as a monorepo with separate frontend and backend directories, optimized for Vercel deployment.

## Deployment Options

### Option 1: Frontend on Vercel + Backend on Separate Service (Recommended)
This is the most common setup for scalable applications.

**Frontend Deployment (Vercel):**
- Automatically deploys from the `frontend` folder
- Auto-builds on every push to your repository
- Environment variables are set in Vercel dashboard

**Backend Deployment:**
Choose one of these services:
- **Render.com** (Free tier available)
- **Railway.app** (Generous free tier)
- **Fly.io** (Free tier available)
- **Heroku** (Paid, but stable)
- **AWS** (EC2 or Elastic Beanstalk)

### Option 2: Backend as Vercel Serverless Functions
Convert your Express routes to serverless functions in an `/api` directory.

## Step-by-Step Deployment

### 1. Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in with GitHub
3. Click "Add New Project"
4. Select your GitHub repository
5. Keep the default settings and click "Deploy"
6. Vercel will automatically:
   - Detect the `vercel.json` configuration
   - Build the frontend
   - Deploy it

### 2. Set Environment Variables in Vercel

After initial deployment, add your frontend environment variables:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add the following:
   - `REACT_APP_API_URL`: Your backend API URL (e.g., `https://your-backend.onrender.com`)
   - `REACT_APP_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name

**Note:** Environment variables starting with `REACT_APP_` are automatically exposed to the frontend

### 3. Deploy Backend (Choose One)

#### Option A: Deploy to Render.com (Easiest)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New +"  → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `co-live-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install --legacy-peer-deps`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret
   - `EMAIL_USER`: Your email
   - `EMAIL_PASSWORD`: Your email password
   - `RAZORPAY_KEY_ID`: Your Razorpay key
   - `RAZORPAY_KEY_SECRET`: Your Razorpay secret
   - `CLOUDINARY_NAME`: Your Cloudinary name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - And any other environment variables needed

7. Click "Create Web Service"
8. Render will deploy your backend
9. Copy the generated URL (e.g., `https://co-live-backend.onrender.com`)
10. Update `REACT_APP_API_URL` in Vercel with this URL

#### Option B: Deploy to Railway.app

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js
6. Add environment variables through Railway dashboard
7. Deploy and copy the generated URL

## Configuration Files

### vercel.json
- Configures the build process
- Sets output directory to `frontend/build`
- Handles rewrites for API calls (if needed)
- Includes cache headers for static assets

### package.json (Root)
- Manages monorepo scripts
- Provides convenient npm commands:
  - `npm run install-all`: Installs dependencies for all packages
  - `npm run build`: Builds frontend
  - `npm run start:frontend`: Runs frontend in development
  - `npm run start:backend`: Runs backend in production
  - `npm run dev:backend`: Runs backend with nodemon (development)

## Adding Environment Variables

### For Frontend (Vercel Dashboard)
1. Go to Project Settings → Environment Variables
2. Add variables with `REACT_APP_` prefix
3. Variables are embedded at build time

### For Backend (Your hosting platform)
Add through the hosting platform's dashboard:
- Render: Settings → Environment
- Railway: Variables
- Others: Follow their documentation

**Backend Environment Variables Needed:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-secret-key
PORT=3001
FRONTEND_URL=https://your-frontend-vercel-url.com
EMAIL_USER=your-email
EMAIL_PASSWORD=your-app-password
RAZORPAY_KEY_ID=your-key
RAZORPAY_KEY_SECRET=your-secret
CLOUDINARY_NAME=your-name
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret
BREVO_API_KEY=your-key (if using)
RESEND_API_KEY=your-key (if using)
```

## Connecting Frontend to Backend

Your `REACT_APP_API_URL` in frontend should point to your backend:

```javascript
// In frontend code:
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
```

Example values:
- **Development**: `http://localhost:3001`
- **Production**: `https://your-backend.onrender.com`

## Quick Deployment Checklist

- [ ] Frontend pushed to GitHub
- [ ] Backend pushed to GitHub
- [ ] Vercel connected and deployed
- [ ] Vercel environment variables set (REACT_APP_*)
- [ ] Backend service created and deployed
- [ ] Backend environment variables configured
- [ ] Database connection working
- [ ] Third-party API keys configured (Razorpay, Cloudinary, etc.)
- [ ] CORS configured on backend for frontend URL
- [ ] Test API calls from frontend

## Testing After Deployment

1. Visit your Vercel frontend URL
2. Try logging in
3. Check browser console for any errors
4. Monitor backend logs for issues
5. Test payment flow with Razorpay test keys

## Troubleshooting

**Frontend builds but shows blank page:**
- Check browser console for errors
- Verify `REACT_APP_API_URL` is set correctly
- Ensure backend API is accessible

**API calls failing:**
- Check backend is deployed and running
- Verify `REACT_APP_API_URL` points to correct backend
- Check CORS is configured on backend
- Verify environment variables on backend are set

**Build fails on Vercel:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `frontend/package.json`
- Try running `npm run build` locally

**Backend not starting:**
- Verify environment variables are set
- Check MongoDB connection string
- Review backend logs on hosting platform
