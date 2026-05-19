# PAYSTACK INITIALIZE PAYMENT

## PURPOSE
Create payment session and return authorization_url

---

## INPUT
email: string
amount: number
orderId: string

---

## OUTPUT
authorization_url: string
reference: string

---

## FLOW
1. receive request
2. send request to Paystack initialize API
3. attach metadata (orderId)
4. return authorization_url

---

## API CALL
POST https://api.paystack.co/transaction/initialize

---

## RULES
- amount must be multiplied by 100
- secret key must stay in backend only
- always attach orderId in metadata