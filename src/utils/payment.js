import { functions, httpsCallable } from '../../firebase';

export const requestPayment = (user, product) => {
    return new Promise((resolve, reject) => {
        if (!window.IMP) {
            reject(new Error("PortOne SDK not loaded"));
            return;
        }

        const IMP = window.IMP;
        // 🚨 REPLACE WITH YOUR ACTUAL MERCHANT ID
        // For testing, you might need to grab this from PortOne Console (impXXXXXX)
        IMP.init('imp37846014'); // Example Test ID

        const merchant_uid = `mid_${new Date().getTime()}_${user.uid.slice(0, 5)}`;

        const data = {
            pg: 'html5_inicis', // Test PG
            pay_method: 'card',
            merchant_uid: merchant_uid,
            name: product.name || 'Premium Resume Template',
            amount: product.price || 5000,
            buyer_email: user.email,
            buyer_name: user.displayName || 'Customer',
            buyer_tel: '010-1234-5678', // Required by some PGs
            m_redirect_url: window.location.origin // For mobile
        };

        IMP.request_pay(data, async (response) => {
            if (response.success) {
                console.log('Payment success, verifying...', response);
                try {
                    // Call Cloud Function to verify
                    const verifyPaymentFn = httpsCallable(functions, 'verifyPayment');
                    const result = await verifyPaymentFn({
                        imp_uid: response.imp_uid,
                        merchant_uid: response.merchant_uid
                    });

                    if (result.data.success) {
                        resolve(result.data);
                    } else {
                        reject(new Error(result.data.message || 'Verification failed'));
                    }
                } catch (error) {
                    console.error('Verification Error:', error);
                    reject(error);
                }
            } else {
                console.error('Payment failed:', response);
                reject(new Error(response.error_msg));
            }
        });
    });
};
