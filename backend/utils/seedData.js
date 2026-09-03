const mongoose = require('mongoose');
const { memoryStore, initialData } = require('./memoryStore');
require('dotenv').config();

console.log('===================================================');
console.log('🌱 MEMORY BRIDGE Demo Data Seeder');
console.log('===================================================');
console.log('Patient Profile: Ravi Kumar (Age 72)');
console.log('Caregiver: Meera Sharma');
console.log('Daughter: Ananya Kumar');
console.log('Son: Raj Kumar');
console.log('Sample Data loaded into Memory Bridge Store.');
console.log('===================================================');
process.exit(0);
