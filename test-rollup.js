import { rollup } from 'rollup';

console.log('Starting rollup test...');
try {
    const bundle = await rollup({
        input: 'test-input.js',
    });
    console.log('Rollup succeeded!');
} catch (e) {
    console.error('Rollup failed:', e);
}
