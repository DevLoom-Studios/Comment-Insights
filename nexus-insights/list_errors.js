const fs = require('fs');
try {
    const data = fs.readFileSync('lint_report.json', 'utf8').replace(/^\uFEFF/, '');
    const report = JSON.parse(data);
    report.forEach(file => {
        const errors = file.messages.filter(msg => msg.severity === 2);
        if (errors.length > 0) {
            console.log(`\nFile: ${file.filePath}`);
            errors.forEach(msg => {
                console.log(`  ${msg.line}:${msg.column} - ${msg.message} (${msg.ruleId})`);
            });
        }
    });
} catch (e) {
    console.error('Error parsing lint report:', e.message);
}
