# PAYSTACK PAYMENT FLOW (HELIMA)

## PURPOSE
Define full payment lifecycle

---

## STEPS

1. user creates order
   status = pending

2. system initializes payment
   → returns authorization_url

3. user completes payment on Paystack

4. Paystack sends webhook

5. backend verifies transaction

6. system updates order
   status = paid

---

## FINAL STATE
order.status = "paid"

---

## FAILURE CASES
- payment failed → order remains pending
- webhook missing → retry verification
- duplicate webhook → ignore