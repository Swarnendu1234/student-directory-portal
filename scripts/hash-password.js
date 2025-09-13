const password = process.argv[2]
if (!password) {
  console.log('Usage: node scripts/change-password.js <your-new-password>')
  process.exit(1)
}

console.log('New password:', password)
console.log('\nUpdate your .env file:')
console.log(`ADMIN_PASSWORD=${password}`)