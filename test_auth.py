#!/usr/bin/env python3
"""
Quick Auth Test Script
Tests registration and login functionality
"""

import requests
import json
import time

BASE_URL = "http://localhost:5000/api"
HEADERS = {"Content-Type": "application/json"}

def test_registration():
    """Test user registration"""
    print("\n🧪 Testing Registration...\n")
    
    payload = {
        "firstName": "Test",
        "lastName": "User",
        "email": f"test{int(time.time())}@example.com",
        "password": "password123",
        "phone": "+1234567890",
        "role": "tenant"
    }
    
    print(f"📤 Request: POST {BASE_URL}/auth/register")
    print(f"📋 Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=payload, headers=HEADERS, timeout=10)
        print(f"\n✅ Status: {response.status_code}")
        print(f"📥 Response:\n{json.dumps(response.json(), indent=2)}\n")
        
        if response.status_code == 201:
            return response.json().get('data', {})
        else:
            return None
    except Exception as e:
        print(f"❌ Error: {str(e)}\n")
        return None

def test_login(email, password):
    """Test user login"""
    print("\n🧪 Testing Login...\n")
    
    payload = {
        "email": email,
        "password": password
    }
    
    print(f"📤 Request: POST {BASE_URL}/auth/login")
    print(f"📋 Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=payload, headers=HEADERS, timeout=10)
        print(f"\n✅ Status: {response.status_code}")
        print(f"📥 Response:\n{json.dumps(response.json(), indent=2)}\n")
        
        if response.status_code == 200:
            return response.json().get('data', {})
        else:
            return None
    except Exception as e:
        print(f"❌ Error: {str(e)}\n")
        return None

def test_health_check():
    """Test backend health"""
    print("\n🏥 Testing Backend Health...\n")
    
    try:
        response = requests.get(f"{BASE_URL.replace('/api', '')}/health", timeout=5)
        print(f"✅ Status: {response.status_code}")
        print(f"📥 Response:\n{json.dumps(response.json(), indent=2)}\n")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {str(e)}\n")
        return False

def main():
    print("=" * 60)
    print("🚀 StaySpot Auth System Test")
    print("=" * 60)
    
    # Test health
    if not test_health_check():
        print("❌ Backend is not running!")
        return
    
    # Test registration
    reg_data = test_registration()
    if not reg_data:
        print("❌ Registration failed!")
        return
    
    user_id = reg_data.get('user', {}).get('id')
    email = reg_data.get('user', {}).get('email')
    
    print(f"✅ Registration successful!")
    print(f"   User ID: {user_id}")
    print(f"   Email: {email}")
    
    # Test login
    time.sleep(1)  # Wait a moment
    login_data = test_login(email, "password123")
    if not login_data:
        print("❌ Login failed!")
        return
    
    token = login_data.get('tokens', {}).get('accessToken')
    print(f"✅ Login successful!")
    print(f"   Token: {token[:20]}..." if token else "No token")
    
    print("\n" + "=" * 60)
    print("✅ All tests passed!")
    print("=" * 60)

if __name__ == "__main__":
    main()
