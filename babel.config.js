module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
        '@babel/preset-typescript',
    ],
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    '~config': './src/config',
                    '~controllers': './src/controllers',
                    '~entities': './src/entities',
                    '~enums': './src/enums',
                    '~helpers': './src/helpers',
                    '~migrations': './src/migrations',
                    '~routes': './src/routes',
                    '~services': './src/services',
                    '~types': './src/types',
                    '~utils': './src/utils',
                },
            },
        ],
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-proposal-class-properties', { loose: true }],
    ],
    ignore: ['**/*.spec.ts', '**/*.test.ts'],
}
