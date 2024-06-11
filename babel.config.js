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
                    '~enums': './src/enums',
                    '~helpers': './src/helpers',
                    '~routes': './src/routes',
                    '~services': './src/services',
                    '~types': './src/types',
                    '~utils': './src/utils',
                },
            },
        ],
    ],
    ignore: ['**/*.spec.ts'],
}
