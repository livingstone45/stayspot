/**
 * Test script to verify the role-based registration and redirection flow
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:3001';

// Test data for different roles
const testUsers = {
  landlord: {
    firstName: 'John',
    lastName: 'Landlord',
    email: `landlord-${Date.now()}@test.com`,
    password: 'TestPassword123!',
    phone: '+1234567890',
    role: 'landlord'
  },
  propertyManager: {
    firstName: 'Jane',
    lastName: 'Manager',
    email: `manager-${Date.now()}@test.com`,
    password: 'TestPassword123!',
    phone: '+1234567891',
    role: 'property_manager'
  },
  companyAdmin: {
    firstName: 'Bob',
    lastName: 'Company',
    email: `company-${Date.now()}@test.com`,
    password: 'TestPassword123!',
    phone: '+1234567892',
    role: 'company_admin'
  }
};

// Role to dashboard mapping
const roleDashboardMap = {
  'landlord': '/landlord',
  'property_manager': '/management',
  'company_admin': '/company'
};

async function testRegistration(userType, userData) {
  console.log(`\n📝 Testing ${userType} registration...`);
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData, {
      validateStatus: () => true // Don't throw on any status
    });
    
    if (response.status === 201 || response.status === 200) {
      console.log(`✅ ${userType} registration successful`);
      console.log(`   Email: ${userData.email}`);
      
      const user = response.data.user || response.data.data?.user;
      if (user) {
        const expectedDashboard = roleDashboardMap[user.role];
        console.log(`   Role: ${user.role}`);
        console.log(`   Expected redirect: ${expectedDashboard}`);
        return { success: true, user };
      }
    } else {
      console.log(`❌ ${userType} registration failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || response.data.error}`);
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ ${userType} registration error: ${error.message}`);
    return { success: false };
  }
}

async function testLogin(userData) {
  console.log(`\n🔐 Testing login for ${userData.email}...`);
  
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: userData.email,
      password: userData.password
    }, {
      validateStatus: () => true
    });
    
    if (response.status === 200) {
      console.log(`✅ Login successful`);
      
      const user = response.data.user || response.data.data?.user;
      if (user) {
        const expectedDashboard = roleDashboardMap[user.role];
        console.log(`   Role: ${user.role}`);
        console.log(`   Expected redirect: ${expectedDashboard}`);
        return { success: true, user };
      }
    } else {
      console.log(`❌ Login failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.message || response.data.error}`);
      return { success: false };
    }
  } catch (error) {
    console.log(`❌ Login error: ${error.message}`);
    return { success: false };
  }
}

async function runTests() {
  console.log('🚀 Starting Registration & Redirection Flow Tests\n');
  console.log(`Frontend: ${FRONTEND_URL}`);
  console.log(`Backend: ${BASE_URL}\n`);
  
  const results = {
    landlord: {},
    propertyManager: {},
    companyAdmin: {}
  };
  
  // Test Landlord registration
  results.landlord.registration = await testRegistration('Landlord', testUsers.landlord);
  if (results.landlord.registration.success) {
    results.landlord.login = await testLogin(testUsers.landlord);
  }
  
  // Test Property Manager registration
  results.propertyManager.registration = await testRegistration('Property Manager', testUsers.propertyManager);
  if (results.propertyManager.registration.success) {
    results.propertyManager.login = await testLogin(testUsers.propertyManager);
  }
  
  // Test Company Admin registration
  results.companyAdmin.registration = await testRegistration('Company Admin', testUsers.companyAdmin);
  if (results.companyAdmin.registration.success) {
    results.companyAdmin.login = await testLogin(testUsers.companyAdmin);
  }
  
  // Summary
  console.log('\n📊 Test Summary:\n');
  let passed = 0;
  let failed = 0;
  
  Object.entries(results).forEach(([role, tests]) => {
    const regPassed = tests.registration?.success ? '✅' : '❌';
    const loginPassed = tests.login?.success ? '✅' : '❌';
    console.log(`${role.padEnd(20)} - Registration: ${regPassed} | Login: ${loginPassed}`);
    
    if (tests.registration?.success) passed++;
    else failed++;
    if (tests.login?.success) passed++;
    else failed++;
  });
  
  console.log(`\n📈 Results: ${passed} passed, ${failed} failed\n`);
  
  // Test role redirection mapping
  console.log('🗺️  Role-to-Dashboard Mapping:\n');
  Object.entries(roleDashboardMap).forEach(([role, dashboard]) => {
    console.log(`   ${role.padEnd(20)} → ${dashboard}`);
  });
  
  console.log('\n✨ Test complete!\n');
}

// Run tests
runTests().catch(console.error);
