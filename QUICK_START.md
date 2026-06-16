# 🚀 Quick Start - Buy/Rent Feature

## One-Click Setup

### Backend Setup
```bash
cd /home/ashish/Desktop/Co-live/backend

# 1. Install new dependency
npm install

# 2. Start server
npm run dev
```

**Expected Output:**
```
Server started on 5000
Connected to MongoDB
```

### Frontend Setup
```bash
cd /home/ashish/Desktop/Co-live/frontend

# Start app
npm start
```

**Expected Output:**
```
Compiled successfully!
Ready on http://localhost:3000
```

---

## 🧑‍💼 Test User Accounts

### Tenant Account (Buyer/Renter)
```
Email: tenant@test.com
Password: password123
Role: tenant
Starting Balance: ₹5000
```

### Landlord Account (Property Owner)
```
Email: landlord@test.com
Password: password123
Role: landlord
Starting Balance: ₹5000
```

---

## 📋 What You Can Test

### As Tenant:
✅ View property details with full info  
✅ Rent property for daily/monthly/yearly  
✅ Buy property  
✅ Contact owner  
✅ Add wallet credit  
✅ Cancel bookings  
✅ View booking history  
✅ See wallet balance & transactions  

### As Landlord:
✅ Post properties  
✅ Approve bookings  
✅ Reject bookings (refunds money)  
✅ View earnings  
✅ See active bookings  

---

## 💻 Key Features

| Feature | Status | Notes |
|---------|--------|-------|
| User Registration | ✅ | ₹5000 auto credit |
| Wallet System | ✅ | No real payments |
| Rent Properties | ✅ | Daily/Monthly/Yearly |
| Buy Properties | ✅ | One-time purchase |
| Contact Owner | ✅ | Send messages |
| Approval System | ✅ | Landlord can approve/reject |
| Theme Toggle | ✅ | Dark/Light mode |
| Responsive Design | ✅ | Works on all devices |

---

## 🎯 Quick Test Flow (5 mins)

1. **Sign up** as tenant (email, password, role)  
   → Get ₹5000 auto credit ✅

2. **View** a property  
   → Click "View Details" → See full info ✅

3. **Rent** for 3 days @ ₹500/day = ₹1500  
   → Balance becomes ₹3500 ✅

4. **Check wallet**  
   → See ₹1500 deducted ✅

5. **Log in** as landlord  
   → Approve booking ✅

6. **Check booking history**  
   → Status: "Confirmed" ✅

---

## ⚡ Quick Add Credit Feature

When wallet balance is low:
1. Click "Add Credit" button (appears in payment modal)
2. Enter amount (₹1 - ₹50,000)
3. Click "Add"
4. ✅ Instant credit! No payment needed.

Or use quick buttons:
- `+₹500`
- `+₹1000`
- `+₹2000`
- `+₹5000`

---

## 📱 Responsive Theme

**Light Mode** (Default)
- White backgrounds
- Dark text
- Red accent (#ff4d4d)

**Dark Mode**
- Dark backgrounds (#1a1a1a)
- Light text
- Red accent

**Toggle**: Click Sun/Moon in NavBar

---

## 🔧 Troubleshooting

### Backend won't start
```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### Frontend won't compile
```bash
# Clear node_modules
rm -rf node_modules
npm install
npm start
```

### MongoDB connection error
```bash
# Check MongoDB is running
mongosh

# If not installed:
# Mac: brew install mongodb-community
# Linux: sudo apt-get install mongodb
```

### Payment not working
- Backend running? (Check terminal)
- MongoDB running? (Check MongoDB)
- Token in localStorage? (Check DevTools)

---

## 📂 File Structure

**Backend:**
```
backend/
├── src/
│   ├── models/
│   │   ├── User.js (wallet added)
│   │   ├── Request.js (booking types added)
│   │   ├── WalletTransaction.js (NEW)
│   │   └── Payment.js (NEW)
│   └── routes/
│       ├── wallet.js (NEW - simplified)
│       └── booking.js (NEW)
```

**Frontend:**
```
frontend/src/
├── components/
│   ├── PropertyDetailModal.jsx (NEW)
│   ├── BookingOptionsModal.jsx (NEW)
│   └── PaymentModal.jsx (NEW - simplified)
├── pages/
└── utils/
    └── ThemeContext.jsx (already has theme)
```

---

## 📊 Database Models Updated

### User Model
- Added `wallet` object with balance
- Added `kyc` for future use
- Added `bankDetails` for landlord payments

### Request Model
- `bookingType`: rent | buy | own_contact
- `rentDetails`: period, dates, price
- `buyDetails`: ownership type, price
- `payment`: status, amount, method
- `landlordApproval`: status, message

### NEW: WalletTransaction Model
- Tracks all debit/credit operations
- Transaction history
- Refund tracking

### NEW: Payment Model
- Payment details
- Razorpay fields (for future)
- Metadata for analytics

---

## 🎓 How Test Credit Works

1. **User Signs Up** → Automatic ₹5000 added
2. **Books Property** → ₹X deducted from wallet
3. **Low Balance?** → Click "Add Credit" → Get more ₹
4. **Booking Rejected** → Money refunded automatically
5. **Cancel Booking** → Get partial refund (policy-based)

---

## ✅ Pre-Testing Checklist

- [ ] Node.js installed (`node -v`)
- [ ] MongoDB running (`mongosh`)
- [ ] `.env` file exists in backend
- [ ] No errors in backend startup
- [ ] Frontend compiles successfully
- [ ] Can create users
- [ ] Users get ₹5000 on signup

---

## 🚀 You're Ready!

Everything is set up and ready to test. Just:

1. Run backend (`npm run dev`)
2. Run frontend (`npm start`)
3. Sign up with test email
4. Start testing! 🎉

**For detailed testing guide, see**: `TESTING_GUIDE.md`

---

*Happy Testing! Let me know if you face any issues.* 😊
