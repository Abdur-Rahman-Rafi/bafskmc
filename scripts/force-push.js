const { execSync } = require('child_process');
try {
    console.log("Running prisma db push...");
    const output = execSync('npx prisma db push --accept-data-loss', { encoding: 'utf-8', stdio: 'inherit' });
    console.log("Push successful!");
} catch (error) {
    console.error("Push failed:");
    console.error(error.message);
}
try {
    console.log("Running prisma generate...");
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log("Generate successful!");
} catch (error) {
    console.error("Generate failed:");
    console.error(error.message);
}
