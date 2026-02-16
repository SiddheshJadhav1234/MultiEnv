const fs = require('fs');
const path = require('path');

console.log('\n🔍 Validating Multi-Environment Setup...\n');

const environments = ['development', 'testing', 'staging', 'production'];
const requiredVars = ['NODE_ENV', 'PORT', 'DATABASE_URL', 'JWT_SECRET', 'CLIENT_URL', 'API_BASE_URL'];

let allValid = true;

environments.forEach(env => {
  const envFile = path.join(__dirname, `.env.${env}`);
  
  if (!fs.existsSync(envFile)) {
    console.log(`❌ Missing: .env.${env}`);
    allValid = false;
    return;
  }
  
  console.log(`✅ Found: .env.${env}`);
  
  const content = fs.readFileSync(envFile, 'utf8');
  const missingVars = requiredVars.filter(varName => !content.includes(varName));
  
  if (missingVars.length > 0) {
    console.log(`   ⚠️  Missing variables: ${missingVars.join(', ')}`);
    allValid = false;
  }
  
  // Extract database name
  const dbMatch = content.match(/DATABASE_URL=.*\/(\w+)/);
  if (dbMatch) {
    console.log(`   📦 Database: ${dbMatch[1]}`);
  }
  
  // Extract ports
  const portMatch = content.match(/PORT=(\d+)/);
  const clientMatch = content.match(/CLIENT_URL=.*:(\d+)/);
  if (portMatch && clientMatch) {
    console.log(`   🔌 Backend: ${portMatch[1]} | Frontend: ${clientMatch[1]}`);
  }
  
  console.log('');
});

// Check package.json scripts
const packageJson = require('./package.json');
const requiredScripts = ['dev', 'test', 'stage', 'prod'];

console.log('📜 Checking package.json scripts...\n');
requiredScripts.forEach(script => {
  if (packageJson.scripts[script]) {
    console.log(`✅ Script: npm run ${script}`);
  } else {
    console.log(`❌ Missing script: ${script}`);
    allValid = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✅ All validations passed!');
  console.log('🚀 Ready to run: npm run dev');
} else {
  console.log('❌ Some validations failed. Please fix the issues above.');
}
console.log('='.repeat(50) + '\n');
