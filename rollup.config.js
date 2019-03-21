import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default {
    input: 'src/index.tsx',
    output: {
        file: 'dist/bundle.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        json(),
        typescript(),
        resolve(),
        commonjs(),
        production && terser(),
    ],
};