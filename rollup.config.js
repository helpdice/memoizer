// eslint-disable-next-line flowtype/require-valid-file-annotation
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

const input = 'src/index.ts';
const excludeAllExternals = id => !id.startsWith('.') && !id.startsWith('/');

const config = {
      tsconfig: './tsconfig.json',
      compilerOptions: {
        declaration: false,
        declarationMap: false,
        emitDeclarationOnly: false,
      },
    };

export default [
  // Universal module definition (UMD) build
  {
    input,
    output: {
      file: 'dist/memoizer.js',
      format: 'umd',
      name: 'memoizer',
      globals: { react: 'React' },
    },
    external: ['react'],
    plugins: [
      // Setting development env before running babel etc
      replace({ 'process.env.NODE_ENV': JSON.stringify('development') }),
      babel(),
      commonjs({ include: 'node_modules/**' }),
      typescript(config)
    ],
  },
  // Universal module definition (UMD) build (production)
  {
    input,
    output: {
      file: 'dist/memoizer.min.js',
      format: 'umd',
      name: 'useMemoOne',
      globals: { react: 'React' },
    },
    external: ['react'],
    plugins: [
      // Setting production env before running babel etc
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      babel(),
      commonjs({ include: 'node_modules/**' }),
      typescript(config),
      terser(),
    ],
  },
  // ESM build
  {
    input,
    external: excludeAllExternals,
    output: {
      file: 'dist/memoizer.esm.js',
      format: 'esm',
    },
    plugins: [babel(), typescript(config)],
  },
  // CommonJS build
  {
    input,
    external: excludeAllExternals,
    output: {
      file: 'dist/memoizer.cjs.js',
      format: 'cjs',
    },
    plugins: [babel(), typescript(config)],
  },
];
