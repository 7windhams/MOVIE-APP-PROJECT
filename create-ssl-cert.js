const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, 'certificates');

// Create certificates directory if it doesn't exist
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
    console.log('📁 Created certificates directory');
}

try {
    console.log('🔐 Generating self-signed SSL certificates...');
    
    // Generate private key
    execSync(`openssl genrsa -out "${path.join(certDir, 'private.key')}" 2048`, { stdio: 'inherit' });
    console.log('✅ Private key generated');
    
    // Generate certificate
    execSync(`openssl req -new -x509 -key "${path.join(certDir, 'private.key')}" -out "${path.join(certDir, 'certificate.crt')}" -days 365 -subj "/C=US/ST=MS/L=Jackson/O=Movie Database/OU=Development/CN=localhost"`, { stdio: 'inherit' });
    console.log('✅ Certificate generated');
    
    console.log('\n🎉 SSL certificates created successfully!');
    console.log('📍 Certificates location:', certDir);
    console.log('⚠️  Note: These are self-signed certificates for development only.');
    console.log('   Your browser will show a security warning - this is normal.');
    console.log('\n🚀 You can now run: node server-https.js');
    
} catch (error) {
    console.error('❌ Error creating certificates:', error.message);
    console.log('\n💡 Alternative: You can use the simpler HTTP-only setup');
    console.log('   Or install OpenSSL: https://www.openssl.org/source/');
}