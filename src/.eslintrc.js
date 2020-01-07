module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    // 'plugin:nuxt/recommended',
    // 'plugin:vue/recommended',
    // // 'eslint:recommended',
    // 'plugin:prettier/recommended',
    // 'prettier/vue'
    // // 'prettier'

    'eslint:recommended',
    '@nuxtjs',
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/recommended',
    'prettier/vue',
    'plugin:prettier/recommended'
  ],
  // plugins: ['vue'],
  // add your custom rules here
  rules: {
    'vue/max-attributes-per-line': 'off',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/html-self-closing': 'off',
    'prettier/prettier': ['error', { semi: false }]
  }
}
