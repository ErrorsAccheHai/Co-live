# 🏠 Buy/Rent Feature - Complete Implementation Plan

## 📋 Overview

Create a full-featured property buying/renting system similar to real-world apps (OYO, Airbnb, Makaan).

### Key Features to Implement:
1. **Detailed Property View Modal** - Images, description, location, amenities
2. **Flexible Options** - Rent (daily/monthly), Buy (one-time), Own (contact owner)
3. **Wallet System** - In-app balance + external payment integration (Razorpay/Stripe)
4. **Booking Flow** - Select option → Pay → Get booking confirmation → Owner approval
5. **Booking History** - User's active/past bookings with landlord contact
6. **Landlord Earnings** - Track pending & approved bookings, earnings dashboard

---

## 🎯 Phase 1: Database Schema Updates

### 1. Update User Model (`backend/src/models/User.js`)

```javascript
// Add wallet and booking fields
{
  wallet: {
    balance: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
  },
  kyc: {
    verified: { type: Boolean, default: false },
    verificationDate: Date,
    idType: String,
    idNumber: String
  },
  preferences: {
    theme: { type: String, default: 'light' }, // ← Add to sync with frontend
    notifications: { type: Boolean, default: true }
  }
}
```

### 2. Create Wallet Transaction Model

File: `backend/src/models/WalletTransaction.js`

```javascript
{
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  amount: { type: Number, required: true },
  reason: {
    type: String,
    enum: ['payment', 'refund', 'cancellation', 'deposit', 'earnings', 'withdrawal'],
    required: true
  },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Request' },
  description: String,
  balanceBefore: Number,
  balanceAfter: Number,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' }
}
```

### 3. Update Request Model (`backend/src/models/Request.js`)

```javascript
{
  // ... existing fields ...
  
  bookingType: {
    type: String,
    enum: ['rent', 'buy', 'own_contact'],
    required: true
  },
  
  // Rent specific
  rentDetails: {
    period: { type: String, enum: ['daily', 'monthly', 'yearly'] },
    startDate: Date,
    endDate: Date,
    pricePerUnit: Number,
    totalPrice: Number,
    nights: Number  // for daily rate
  },
  
  // Buy specific
  buyDetails: {
    totalPrice: Number,
    paymentMethod: { type: String, enum: ['wallet', 'card', 'upi'] },
    ownership: { type: String, enum: ['lease', 'purchase'] }
  },
  
  // Own/Contact specific
  ownDetails: {
    contactAttempts: [{ timestamp: Date, message: String }],
    ownerResponse: String,
    ownerResponseDate: Date
  },
  
  // Payment tracking
  payment: {
    status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    paymentMethod: String,
    paidAmount: Number,
    paidDate: Date,
    refundAmount: { type: Number, default: 0 },
    refundDate: Date
  },
  
  // Booking status
  bookingStatus: {
    type: String,
    enum: ['inquiry', 'awaiting_payment', 'payment_completed', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'inquiry'
  },
  
  // Landlord approval
  landlordApproval: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'] },
    approvalDate: Date,
    message: String
  },
  
  cancellationPolicy: {
    type: String,
    enum: ['free', 'paid', 'no_cancellation'],
    default: 'paid'
  },
  
  checkinDate: Date,
  checkoutDate: Date
}
```

### 4. Create Payment Model (`backend/src/models/Payment.js`)

```javascript
{
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: Schema.Types.ObjectId, ref: 'Request', required: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  amount: Number,
  currency: { type: String, default: 'INR' },
  
  paymentMethod: {
    type: String,
    enum: ['wallet', 'razorpay', 'stripe', 'upi'],
    required: true
  },
  
  // Razorpay fields
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  
  status: {
    type: String,
    enum: ['initiated', 'processing', 'completed', 'failed', 'refunded'],
    default: 'initiated'
  },
  
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
  
  metadata: {
    bookingType: String,
    period: String,
    startDate: Date,
    endDate: Date
  }
}
```

---

## 🔌 Phase 2: Backend Routes & APIs

### 1. Wallet Routes (`backend/src/routes/wallet.js`)

**NEW FILE** - Create endpoints for:

```
GET  /api/wallet/balance                     → Get user's current balance
POST /api/wallet/add                         → Add money via payment gateway
POST /api/wallet/deduct                      → Deduct for booking
GET  /api/wallet/transactions                → Get transaction history
POST /api/wallet/initiate-razorpay           → Start Razorpay payment
POST /api/wallet/verify-razorpay             → Verify Razorpay payment
```

### 2. Booking Routes (`backend/src/routes/booking.js`)

**NEW FILE** - Create endpoints for:

```
POST   /api/booking/create                   → Create rent/buy request
GET    /api/booking/my-bookings              → Get user's bookings
GET    /api/booking/:id                      → Get booking details
PUT    /api/booking/:id/cancel               → Cancel booking
GET    /api/booking/landlord/pending         → Get pending approvals
PUT    /api/booking/:id/approve              → Approve booking
PUT    /api/booking/:id/reject               → Reject booking
GET    /api/booking/landlord/earnings        → Get earnings summary
GET    /api/booking/landlord/transactions    → Get transaction history
```

### 3. Property Routes Update

**UPDATE** `backend/src/routes/request.js` or create `backend/src/routes/property.js`:

```
GET    /api/property                         → List all properties
GET    /api/property/:id                     → Get property details (detailed)
POST   /api/property                         → Create property (existing)
PUT    /api/property/:id                     → Update property
DELETE /api/property/:id                     → Delete property (existing)
GET    /api/property/:id/reviews             → Get property reviews
POST   /api/property/:id/review              → Add review after stay
```

---

## 🎨 Phase 3: Frontend Components

### 1. Property Detail Modal (`frontend/src/components/PropertyDetailModal.jsx`)

```javascript
// Shows:
// - Large image gallery (carousel)
// - Property name, location, rating
// - Description & amenities
// - Availability calendar
// - Price breakdown (daily/monthly/yearly)
// - Owner info (name, photo, reviews)
// - Three action buttons:
//   • Rent for X days
//   • Buy this property
//   • Contact owner to own/discuss
```

### 2. Booking Options Modal (`frontend/src/components/BookingOptionsModal.jsx`)

```javascript
// After clicking "Rent" / "Buy" / "Contact":
// - RentOptionsTab:
//   • Calendar to select dates
//   • Calculate nights/days
//   • Show daily/monthly pricing
//   • Show total price
//   
// - BuyOptionsTab:
//   • Show full ownership terms
//   • Show total price
//   • Lease vs Purchase toggle
//   
// - ContactOwnerTab:
//   • Message textarea to owner
//   • Show owner response deadline
//   • Show estimated response time
```

### 3. Payment Modal (`frontend/src/components/PaymentModal.jsx`)

```javascript
// Shows:
// - Booking summary (dates, price)
// - Payment breakdown (price + tax + fees)
// - Two payment options:
//   • Pay from Wallet (if balance sufficient)
//   • Pay via Card/UPI (Razorpay)
// - Price breakdown row by row
```

### 4. Wallet Component (`frontend/src/components/WalletCard.jsx`)

```javascript
// Shows in dashboard/sidebar:
// - Current balance (large, prominent)
// - "Add Money" button
// - Recent transactions (last 3-5)
// - View full history link
```

### 5. Booking History Page (`frontend/src/pages/BookingHistory.jsx`)

```javascript
// Three tabs:
// - Active Bookings: Shows current stays/rentals
//   • Property name, dates, status
//   • Landlord contact button
//   • Map to view location
//   • Early checkout option
//   
// - Past Bookings: Shows completed stays
//   • Rebook button
//   • Write review button
//   • Download invoice button
//   
// - Pending Approval: Shows waiting for landlord
//   • Cancel option
//   • Expected approval time
```

### 6. Landlord Earnings Dashboard (`frontend/src/pages/LandlordEarnings.jsx`)

```javascript
// Shows:
// - Total earnings (month/year/all-time)
// - Pending amount (awaiting payment from tenants)
// - Active bookings (count)
// - Revenue chart (monthly trend)
// - Recent transactions list
// - Withdrawal requests section
// - Bank account setup
```

### 7. Payment Gateway Setup Component (`frontend/src/components/AddMoneyModal.jsx`)

```javascript
// Options:
// - Enter amount
// - Select payment method (Razorpay/Stripe)
// - Load Razorpay form
// - Show payment success confirmation
```

---

## 🏗️ Phase 4: Business Logic Flow

### Rent Flow:
```
User clicks Property
    ↓
PropertyDetailModal opens
    ↓
User clicks "Rent"
    ↓
Select dates (start & end)
    ↓
Calculate price (nights × pricePerDay or months × pricePerMonth)
    ↓
Click "Book Now"
    ↓
PaymentModal opens → Select wallet or card
    ↓
If wallet: Deduct balance → Create Request → Set bookingStatus='payment_completed'
If card: Razorpay payment → Verify → Create Request → Deduct wallet
    ↓
Request created with bookingType='rent'
    ↓
Landlord receives notification → Can approve/reject
    ↓
Once approved → bookingStatus='confirmed'
    ↓
Booking active until checkoutDate
    ↓
After checkout → User can write review & rebook
```

### Buy Flow:
```
User clicks Property
    ↓
PropertyDetailModal opens
    ↓
User clicks "Buy"
    ↓
BookingOptionsModal → Select "Purchase" or "Lease"
    ↓
Show total price (property cost)
    ↓
Click "Buy Now"
    ↓
PaymentModal → Select wallet or card
    ↓
Payment processing → Create Request with bookingType='buy'
    ↓
Landlord approval
    ↓
After approval → Transfer ownership (update in backend)
    ↓
Send legal documents to user
```

### Own/Contact Flow:
```
User clicks Property
    ↓
PropertyDetailModal opens
    ↓
User clicks "Contact Owner to Own"
    ↓
ContactOwnerModal → User writes message/inquiry
    ↓
Send inquiry to owner
    ↓
Landlord receives notification
    ↓
Owner can respond with price/terms
    ↓
User can negotiate through messages
    ↓
Once agreed → Create booking request
    ↓
Payment processed
```

---

## 💰 Phase 5: Wallet & Payment Integration

### Razorpay Integration Steps:

**1. Backend Setup** (`backend/src/routes/wallet.js`):
```javascript
// Generate Razorpay order
router.post('/initiate-razorpay', async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: `wallet_${Date.now()}`,
    payment_capture: 1
  };
  
  try {
    const order = await razorpayInstance.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// Verify payment signature
router.post('/verify-razorpay', async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_SECRET)
    .update(body)
    .digest('hex');
    
  if (expectedSignature === razorpaySignature) {
    // Payment verified → Add money to wallet
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { 'wallet.balance': amount },
      $set: { 'wallet.lastUpdated': Date.now() }
    });
    
    // Log transaction
    await WalletTransaction.create({
      userId: req.user.id,
      type: 'credit',
      amount: amount,
      reason: 'deposit',
      status: 'completed'
    });
    
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, error: 'Invalid signature' });
  }
});
```

**2. Frontend Setup** (`frontend/src/components/RazorpayButton.jsx`):
```javascript
// Load Razorpay script
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);
}, []);

// Handle payment
const handlePayment = (amount) => {
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY,
    amount: amount * 100,
    currency: 'INR',
    name: 'Co-Live',
    description: 'Add Money to Wallet',
    handler: async (response) => {
      // Verify with backend
      const result = await verifyPayment(response);
      if (result.success) {
        // Add money to wallet state
        setWalletBalance(prev => prev + amount);
      }
    }
  };
  
  const razorpay = new window.Razorpay(options);
  razorpay.open();
};
```

---

## 📱 Phase 6: Frontend Pages Structure

```
/dashboard                    → Main dashboard (existing)
  └─ WalletCard component

/properties                   → List all properties (existing)
  ├─ PropertyCard (with View Details button)
  └─ PropertyDetailModal (new)

/booking/create              → Booking options (new)
  ├─ BookingOptionsModal
  └─ PaymentModal

/booking/history             → User's bookings (new)
  ├─ Active Bookings Tab
  ├─ Past Bookings Tab
  └─ Pending Approval Tab

/wallet                       → Wallet management (new)
  ├─ Balance display
  ├─ Add Money button
  ├─ Transaction history
  └─ Withdrawal requests

/landlord/earnings           → Earnings dashboard (new)
  ├─ Earnings summary
  ├─ Revenue chart
  ├─ Pending approvals
  ├─ Active bookings
  └─ Bank account setup

/payment/success             → Payment confirmation (new)
/payment/failed              → Payment error (new)
```

---

## 🔑 Key Implementation Steps

### Week 1: Backend Infrastructure
- [ ] Update User model (add wallet)
- [ ] Create WalletTransaction model
- [ ] Create Payment model
- [ ] Update Request model (add booking details)
- [ ] Create wallet routes
- [ ] Create booking routes
- [ ] Setup Razorpay account & keys

### Week 2: Wallet & Payment
- [ ] Implement wallet balance endpoints
- [ ] Implement Razorpay integration
- [ ] Create transaction logging
- [ ] Test payment flow locally

### Week 3: Booking Flow
- [ ] Implement rent booking logic
- [ ] Implement buy booking logic
- [ ] Implement contact owner flow
- [ ] Add landlord approval system

### Week 4: Frontend Components
- [ ] PropertyDetailModal
- [ ] BookingOptionsModal
- [ ] PaymentModal
- [ ] WalletCard
- [ ] BookingHistoryPage

### Week 5: Frontend Pages
- [ ] BookingHistoryPage (all tabs)
- [ ] LandlordEarningsPage
- [ ] WalletManagement page
- [ ] Payment success/error pages

### Week 6: Theme & Testing
- [ ] Apply dark/light theme to all new components
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Security review

---

## 📊 Data Flow Diagram

```
┌─────────────────┐
│  User Clicks    │
│  View Property  │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ PropertyDetailModal  │────→ Shows full property details
│  - Images gallery   │
│  - Description      │
│  - Location map     │
│  - Reviews/ratings  │
└────────┬─────────────┘
         │
    ┌────┴─────┬─────────┐
    │           │         │
    ▼           ▼         ▼
  Rent        Buy      Contact
  Modal       Modal     Owner
    │           │         │
    ▼           ▼         ▼
Select      Lease/    Send
Dates       Purchase  Message
    │           │         │
    ▼           ▼         ▼
Show        Show      Landlord
Price       Price     Reviews
    │           │         │
    └─────┬─────┴────┬────┘
          │          │
          ▼          ▼
    ┌──────────────────────┐
    │  PaymentModal        │
    │  - Wallet balance    │
    │  - Price breakdown   │
    │  - Payment methods   │
    └──────────┬───────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    Wallet         Card/UPI
    Payment        (Razorpay)
        │             │
        └──────┬──────┘
               │
               ▼
    ┌──────────────────────┐
    │  Create Request      │
    │  - bookingType       │
    │  - payment details   │
    │  - dates/prices      │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────┐
    │  Landlord Approval   │
    │  - Notification      │
    │  - Pending status    │
    │  - Approve/Reject    │
    └──────────┬───────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
    Approved     Rejected
    Booking      Refund
        │         Money
        │             │
        ▼             ▼
    Send to    Send to
    User       User
    Confirmed  Cancelled
```

---

## 🚀 Quick Start Implementation Order

1. **Start Backend First:**
   - Update models (User, Request)
   - Create WalletTransaction model
   - Create wallet routes

2. **Then Payment:**
   - Setup Razorpay
   - Implement wallet endpoints
   - Test locally

3. **Then Booking:**
   - Implement booking routes
   - Add landlord approval

4. **Then Frontend:**
   - PropertyDetailModal
   - BookingOptionsModal
   - PaymentModal

5. **Finally Pages:**
   - BookingHistory
   - LandlordEarnings
   - Wallet management

---

## 💡 Tips & Best Practices

- **Payment Security:** Never expose Razorpay secret on frontend
- **Idempotency:** Use unique transaction IDs to prevent duplicate charges
- **Confirmation:** Always send booking confirmation via email
- **Notifications:** Real-time updates using Socket.io (future)
- **Refunds:** Implement automatic refunds for rejected bookings
- **Tax:** Calculate GST/tax on booking amounts
- **Cancellation:** Implement flexible cancellation policies

---

**Status:** ✅ Plan Ready  
**Effort:** ~2-3 weeks for full implementation  
**Next Step:** Choose which module to start (Backend/Payment/Booking/Frontend)
