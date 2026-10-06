#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'resources', 'public-apis.json');
if (!fs.existsSync(jsonPath)) {
  console.error('Database not found at', jsonPath);
  process.exit(1);
}

const apis = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const query = process.argv.slice(2).join(' ').trim().toLowerCase();

if (!query) {
  console.log(`\n=== Public APIs Index (Total: ${apis.length} APIs) ===\n`);
  const categories = {};
  apis.forEach(a => {
    categories[a.category] = (categories[a.category] || 0) + 1;
  });
  console.log('Available Categories:');
  Object.entries(categories).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`- ${cat} (${count} APIs)`);
  });
  console.log('\nUsage: node search.js <query or category>');
  console.log('Example: node search.js bible');
  console.log('Example: node search.js geocoding\n');
  process.exit(0);
}

const results = apis.filter(a => {
  return (
    a.name.toLowerCase().includes(query) ||
    a.description.toLowerCase().includes(query) ||
    a.category.toLowerCase().includes(query)
  );
});

console.log(`\nFound ${results.length} API(s) matching "${query}":\n`);
results.forEach((a, i) => {
  console.log(`${i + 1}. [${a.name}] (${a.url})`);
  console.log(`   Category: ${a.category} | Auth: ${a.auth || 'None'} | HTTPS: ${a.https ? 'Yes' : 'No'} | CORS: ${a.cors}`);
  console.log(`   Description: ${a.description}\n`);
});
