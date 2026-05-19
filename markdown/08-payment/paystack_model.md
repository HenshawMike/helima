# ORDER PAYMENT MODEL

## PURPOSE
Define structure of payment-related order data

---

## ORDER STRUCTURE

id: string
userId: string
email: string
amount: number
status: "pending" | "paid"
paymentReference: string
orderId: string

---

## RULES
- status starts as pending
- only webhook can set paid
- orderId must match metadata