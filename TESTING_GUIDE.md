# 🎯 Buy/Rent Feature - Testing Guide

## ✨ What's Been Implemented

### Backend (Test-Friendly)
✅ **User Registration**: Every new user gets **₹5000 starting credit** (test money)
✅ **Wallet System**: Deduct/add money, track transactions
✅ **Booking System**: Create rent/buy/own requests
✅ **Simple Credit Top-up**: Easy way to add more test credit
✅ **Landlord Approval**: Landlords can approve/reject bookings

### Frontend (Complete)
✅ **PropertyDetailModal**: View full property details
✅ **BookingOptionsModal**: Select rent/buy/own options
✅ **PaymentModal**: Pay from wallet or add credit
✅ **Theme Support**: Dark/light mode on all components

---

## 🚀 How to Start Testing

### Step 1: Start Backend
```bash
cd /home/ashish/Desktop/Co-live/backend
npm install razorpay  # Optional - simplified version doesn't need it
npm run dev
```

### Step 2: Start Frontend
```bash
cd /home/ashish/Desktop/Co-live/frontend
npm start
```

### Step 3: Create Test Users

**User 1 - Tenant (for renting/buying)**
- Email: `tenant@test.com`
- Password: `password123`
- Role: `tenant`
- Starting Balance: **₹5000** ✅

**User 2 - Landlord (for approving bookings)**
- Email: `landlord@test.com`
- Password: `password123`
- Role: `landlord`
- Starting Balance: **₹5000**

---

## 🧪 Testing Workflow

### Scenario 1: Rent a Property

**Prerequisites:**
- 1 property posted by landlord
- Logged in as tenant

**Steps:**
1. Go to "Properties" page
2. Click "View Details" on a property
3. Click "Rent" button
4. Select dates (e.g., 5 days at ₹500/day = ₹2500)
5. Click "Proceed to Payment"
6. Confirm payment (deducts from wallet)
7. ✅ Booking created! Status: "Awaiting landlord approval"
8. Wallet balance decreases by ₹2500

**Expected Result:**
- Tenant sees booking in "Booking History"
- Landlord sees pending approval
- Money deducted from tenant's wallet
- ✅ Test Passed!

---

### Scenario 2: Buy a Property

**Prerequisites:**
- 1 property posted by landlord
- Logged in as tenant
- Wallet balance sufficient

**Steps:**
1. Go to "Properties" page
2. Click "View Details" on a property
3. Click "Buy" button
4. Select ownership type (lease/purchase)
5. Click "Proceed to Payment"
6. Confirm payment
7. ✅ Booking created! Status: "Payment completed"
8. Wallet balance decreases

**Expected Result:**
- One-time purchase recorded
- Money deducted immediately
- Landlord can approve/reject
- ✅ Test Passed!

---

### Scenario 3: Add Credit (Low Balance)

**Prerequisites:**
- Wallet balance low (< booking amount)
- Trying to book property

**Steps:**
1. Go to Properties
2. Try to book property for ₹3000 (but only have ₹1000)
3. Click "Proceed to Payment"
4. PaymentModal shows: "Need ₹2000 more"
5. Click "Add Credit" button
6. Enter ₹3000
7. Click "Add"
8. ✅ Credit added! Wallet now ₹4000
9. Now click "Pay"
10. ✅ Payment successful!

**Expected Result:**
- Easy quick-add options (₹500, ₹1000, ₹2000, ₹5000)
- Wallet updated immediately
- Payment goes through
- ✅ Test Passed!

---

### Scenario 4: Landlord Approval Flow

**As Landlord:**
1. Log in as landlord (`landlord@test.com`)
2. Go to "Landlord Dashboard"
3. See "Pending Approvals" tab
4. View booking request
5. Click "Approve" or "Reject"
6. If approve → booking becomes "Confirmed"
7. If reject → money refunded to tenant

**Expected Result:**
- Landlord sees all pending bookings
- Can approve/reject with message
- Tenant gets notification
- ✅ Test Passed!

---

### Scenario 5: Insufficient Balance Error

**Steps:**
1. Wallet has only ₹500
2. Try to book property for ₹2000
3. Click "Proceed to Payment"
4. Error shows: "Need ₹1500 more"
5. Payment button disabled (red)
6. Click "Add Credit" → add ₹3000
7. Now payment button enabled (green)
8. Click "Pay"
9. ✅ Payment successful!

**Expected Result:**
- Error clearly shows shortfall amount
- Can't pay without sufficient balance
- Adding credit makes payment possible
- ✅ Test Passed!

---

### Scenario 6: Cancel Booking

**Steps:**
1. Create a booking (rent)
2. Go to "Booking History"
3. Find the booking
4. Click "Cancel" button
5. Enter cancellation reason
6. Click "Confirm"
7. ✅ Booking cancelled
8. ✅ Refund processed (based on cancellation policy)
9. Money back in wallet!

**Expected Result:**
- Booking status changes to "Cancelled"
- Refund calculation shown
- Money added back to wallet
- ✅ Test Passed!

---

## 💰 Wallet & Credit System

### Starting Credit
- **Amount**: ₹5000
- **When**: Automatic on signup
- **No**: Real payment needed (TEST ONLY)

### Adding More Credit
1. Click "Add Credit" in payment modal
2. Enter amount (₹1 - ₹50,000)
3. Click "Add"
4. ✅ Instant credit added!
5. **No payment gateway needed** (simplified for testing)

### Transaction Tracking
- View all transactions in "Wallet" page
- See debit/credit history
- Track booking payments
- View refunds

---

## 📊 Database Check (Optional)

To verify backend is working, check MongoDB:

```javascript
// Check user wallet
db.users.findOne({email: "tenant@test.com"}).wallet

// Output:
{
  balance: 5000,  // or less if used
  currency: "INR",
  createdAt: ISODate("2025-11-11..."),
  lastUpdated: ISODate("...")
}

// Check transactions
db.wallettransactions.find({userId: ObjectId("...")})

// Check bookings
db.requests.find({bookingType: "rent"})
```

---

## 🐛 Common Issues & Solutions

### Issue 1: "Token is not valid"
**Solution:** 
- Clear browser localStorage
- Log out and log in again
- Refresh page

### Issue 2: "Insufficient wallet balance"
**Solution:**
- Click "Add Credit" button
- Add ₹1000+ to wallet
- Try again

### Issue 3: Payment not deducting
**Possible Cause:**
- Backend not running
- Check terminal for errors
- Verify MongoDB connection
**Solution:**
- Restart backend: `npm run dev`
- Check MongoDB is running

### Issue 4: Booking not created
**Possible Cause:**
- Property ID not valid
- Missing booking details
**Solution:**
- Refresh page
- Ensure property is visible
- Check browser console for errors

---

## ✅ Checklist Before Going Live

- [ ] Users get ₹5000 on signup
- [ ] Can view property details
- [ ] Can rent/buy properties
- [ ] Wallet deducts on booking
- [ ] Can add credit when low
- [ ] Landlord can approve/reject
- [ ] Money refunds on cancellation
- [ ] Transaction history visible
- [ ] Dark/Light theme works
- [ ] All errors handled gracefully
- [ ] No console errors
- [ ] API endpoints all working

---

## 📝 API Endpoints Summary

### Wallet Endpoints
```
GET  /api/wallet/balance              → Get user's balance
POST /api/wallet/add-credit           → Add test credit
POST /api/wallet/deduct               → Deduct for booking
POST /api/wallet/refund               → Refund money
GET  /api/wallet/transactions         → Get history
```

### Booking Endpoints
```
POST   /api/booking/create            → Create booking
GET    /api/booking/my-bookings       → Get user's bookings
GET    /api/booking/:id               → Get booking details
POST   /api/booking/:id/pay           → Process payment
POST   /api/booking/:id/cancel        → Cancel booking
GET    /api/booking/landlord/pending  → Get pending approvals
POST   /api/booking/:id/approve       → Approve booking
POST   /api/booking/:id/reject        → Reject booking
```

---

## 🎨 Testing Both Themes

### Light Mode (Default)
- Clean white backgrounds
- Dark text
- Red brand color (#ff4d4d)
- Subtle borders

### Dark Mode
- Dark gray backgrounds (#1a1a1a)
- Light text
- Same red brand color
- Better contrast

**Toggle in NavBar** → Click Sun/Moon icon

---

## 🚀 Next Steps (After Testing)

Once everything works:
1. ✅ Build Booking History Page
2. ✅ Build Landlord Earnings Dashboard
3. ✅ Add real property images
4. ✅ Add email notifications
5. ✅ Deploy to production

---

**Status**: ✅ Ready to Test!  
**Date**: November 11, 2025  
**Test Environment**: Local development

Need help? Check the implementation files:
- Backend: `/backend/src/routes/wallet.js`, `/backend/src/routes/booking.js`
- Frontend: `/frontend/src/components/PaymentModal.jsx`, `/frontend/src/components/PropertyDetailModal.jsx`
