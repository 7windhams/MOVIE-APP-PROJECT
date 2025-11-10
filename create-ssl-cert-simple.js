const forge = require('node-forge');
const fs = require('fs');
const path = require('path');

const certDir = path.join(__dirname, 'certificates');

// Create certificates directory if it doesn't exist
if (!fs.existsSync(certDir)) {
    fs.mkdirSync(certDir);
    console.log('📁 Created certificates directory');
}

console.log('🔐 Generating self-signed SSL certificates with node-forge...');

try {
    // Generate a key pair
    console.log('🔑 Generating RSA key pair...');
    const keys = forge.pki.rsa.generateKeyPair(2048);
    
    // Create a certificate
    console.log('📜 Creating certificate...');
    const cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    cert.serialNumber = '01';
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1);
    
    const attrs = [{
        name: 'countryName',
        value: 'US'
    }, {
        name: 'stateOrProvinceName',
        value: 'Mississippi'
    }, {
        name: 'localityName',
        value: 'Jackson'
    }, {
        name: 'organizationName',
        value: 'Movie Database Development'
    }, {
        name: 'organizationalUnitName',
        value: 'Development'
    }, {
        name: 'commonName',
        value: 'localhost'
    }];
    
    cert.setSubject(attrs);
    cert.setIssuer(attrs);
    
    // Add extensions
    cert.setExtensions([{
        name: 'basicConstraints',
        cA: true
    }, {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
    }, {
        name: 'subjectAltName',
        altNames: [{
            type: 2, // DNS
            value: 'localhost'
        }, {
            type: 7, // IP
            ip: '127.0.0.1'
        }]
    }]);
    
    // Self-sign certificate
    cert.sign(keys.privateKey);
    
    // Convert to PEM format
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
    const certificatePem = forge.pki.certificateToPem(cert);
    
    // Save to files
    fs.writeFileSync(path.join(certDir, 'private.key'), privateKeyPem);
    fs.writeFileSync(path.join(certDir, 'certificate.crt'), certificatePem);
    
    console.log('✅ Private key saved to certificates/private.key');
    console.log('✅ Certificate saved to certificates/certificate.crt');
    console.log('\n🎉 SSL certificates created successfully!');
    console.log('📍 Certificates location:', certDir);
    console.log('⚠️  Note: These are self-signed certificates for development only.');
    console.log('   Your browser will show a security warning - this is normal.');
    console.log('\n🚀 You can now run: node server-https.js');
    
} catch (error) {
    console.error('❌ Error creating certificates:', error.message);
    console.log('💡 Make sure to install node-forge: npm install node-forge');
}