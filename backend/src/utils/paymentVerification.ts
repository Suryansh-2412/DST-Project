import crypto from 'crypto'

// Razorpay signs `${order_id}|${payment_id}` with the key secret (HMAC SHA256).
// We recompute it server-side and compare — never trust the signature the client sends.
export const verifyRazorpaySignature = (
    orderId: string,
    paymentId: string,
    signature: string
): boolean => {

    const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
        .update(`${orderId}|${paymentId}`)
        .digest('hex')

    try {
        return crypto.timingSafeEqual(
            Buffer.from(expected),
            Buffer.from(signature)
        )
    } catch {
        // signature was the wrong length / not hex — definitely not a match
        return false
    }

}
