module.exports = {
    extends: ['@commitlint/config-conventional'],
    plugins: ['commitlint-plugin-cspell'],
    rules: {
        'subject-case': [2, 'always', 'sentence-case'],
        'type-case': [2, 'always', 'pascal-case'],
        'type-enum': [2, 'always', [
            'New', // New feature|widget|addon
            'Tweak', // Minor change
            'Fix', // Bug fix
            'Add', // New functionality
            'Deprecate', // Mark for removal
            'Revert', // Revert changes || version rollback
            'Format', // Code formatting [PHP, JS, CSS, etc.]
            'Remove', // Remove Files
            'Update', // Update Files
        ]],
        'cspell/type': [2, 'always'],
        'cspell/scope': [2, 'always'],
        'cspell/subject': [2, 'always'],
    }
};