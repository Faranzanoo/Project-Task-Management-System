module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true
    },
    extends: [
        'eslint:recommended'
    ],
    // Aplikasi dimuat lewat <script> biasa, jadi kelas saling berbagi variabel global
    globals: {
        User: 'readonly',
        Task: 'readonly',
        EnhancedTask: 'readonly',
        StorageManager: 'readonly',
        EnhancedStorageManager: 'readonly',
        UserRepository: 'readonly',
        TaskRepository: 'readonly',
        UserController: 'readonly',
        TaskController: 'readonly',
        TaskView: 'readonly'
    },
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    rules: {
        // Basic rules for educational purposes
        'no-unused-vars': 'warn',
        'no-console': 'off', // Allow console.log for learning
        'indent': ['error', 4],
        'quotes': ['error', 'single'],
        'semi': ['error', 'always']
    }
};