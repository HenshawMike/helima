# PAYSTACK TESTING GUIDE

## TEST KEYS
use Paystack test mode keys only

---

## TEST CARD
4084084084084081

---

## TEST FLOW
1. initialize payment
2. redirect to checkout
3. complete payment
4. confirm webhook received
5. verify order updated

---

## SUCCESS CONDITION
- payment shows success in dashboard
- order status becomes paid in DB