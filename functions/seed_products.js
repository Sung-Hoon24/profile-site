const admin = require('firebase-admin');

// 🔑 Initialize Admin SDK
// Ideally, set GOOGLE_APPLICATION_CREDENTIALS environment variable
// or run this in an environment where ADC is set up.
// If running locally without env var, you might need a serviceAccountKey.json
try {
    admin.initializeApp();
} catch (e) {
    console.error("Failed to initialize admin. Ensure you have credentials set up.", e);
    process.exit(1);
}

const db = admin.firestore();

async function seedProducts() {
    const productRef = db.collection('products').doc('resume_premium');

    console.log("🌱 Seeding 'resume_premium' product...");

    try {
        await productRef.set({
            name: "Premium Resume Template",
            price: 5000,
            currency: "KRW",
            description: "Unlock all premium templates and features forever.",
            active: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log("✅ Product 'resume_premium' seeded successfully!");
    } catch (error) {
        console.error("❌ Error seeding product:", error);
    }
}

seedProducts();
