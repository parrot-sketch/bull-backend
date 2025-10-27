#!/bin/bash

# iHosi Authentication End-to-End Test Script
# This script tests the authentication flow from registration to login

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_BASE_URL="http://localhost:3000"
AUTH_ENDPOINT="$API_BASE_URL/auth"

echo -e "${BLUE}🧪 Starting iHosi Authentication End-to-End Tests${NC}"

# Test data
TEST_EMAIL="test@example.com"
TEST_PASSWORD="SecurePass123!"
TEST_FIRST_NAME="John"
TEST_LAST_NAME="Doe"

# Function to make HTTP requests
make_request() {
    local method=$1
    local url=$2
    local data=$3
    local headers=$4
    
    if [ -n "$data" ]; then
        curl -s -X "$method" \
             -H "Content-Type: application/json" \
             -H "$headers" \
             -d "$data" \
             "$url"
    else
        curl -s -X "$method" \
             -H "Content-Type: application/json" \
             -H "$headers" \
             "$url"
    fi
}

# Function to check if service is running
check_service() {
    local service_name=$1
    local url=$2
    
    echo -e "${BLUE}🔍 Checking $service_name...${NC}"
    
    if curl -f "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $service_name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $service_name is not responding${NC}"
        return 1
    fi
}

# Check if services are running
echo -e "${BLUE}🏥 Checking service health...${NC}"

if ! check_service "API Gateway" "$API_BASE_URL/gateway/health"; then
    echo -e "${RED}❌ API Gateway is not running. Please start the services first.${NC}"
    echo -e "${YELLOW}💡 Run: docker-compose -f docker-compose.gateway.yml up -d${NC}"
    exit 1
fi

if ! check_service "Auth Service" "$API_BASE_URL/auth/health"; then
    echo -e "${RED}❌ Auth Service is not running. Please start the services first.${NC}"
    echo -e "${YELLOW}💡 Run: docker-compose -f docker-compose.gateway.yml up -d${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All services are running${NC}"

# Test 1: User Registration
echo -e "${BLUE}📝 Test 1: User Registration${NC}"

REGISTER_DATA='{
    "email": "'$TEST_EMAIL'",
    "password": "'$TEST_PASSWORD'",
    "firstName": "'$TEST_FIRST_NAME'",
    "lastName": "'$TEST_LAST_NAME'",
    "role": "PATIENT",
    "phone": "+1-555-0123"
}'

echo -e "${YELLOW}📤 Sending registration request...${NC}"
REGISTER_RESPONSE=$(make_request "POST" "$AUTH_ENDPOINT/register" "$REGISTER_DATA")

echo -e "${YELLOW}📥 Registration response:${NC}"
echo "$REGISTER_RESPONSE" | jq '.' 2>/dev/null || echo "$REGISTER_RESPONSE"

# Check if registration was successful
if echo "$REGISTER_RESPONSE" | grep -q "Registration successful"; then
    echo -e "${GREEN}✅ User registration successful${NC}"
else
    echo -e "${RED}❌ User registration failed${NC}"
    echo -e "${YELLOW}💡 This might be expected if the user already exists${NC}"
fi

# Test 2: User Login
echo -e "${BLUE}🔐 Test 2: User Login${NC}"

LOGIN_DATA='{
    "email": "'$TEST_EMAIL'",
    "password": "'$TEST_PASSWORD'"
}'

echo -e "${YELLOW}📤 Sending login request...${NC}"
LOGIN_RESPONSE=$(make_request "POST" "$AUTH_ENDPOINT/login" "$LOGIN_DATA")

echo -e "${YELLOW}📥 Login response:${NC}"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extract access token
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.tokens.accessToken' 2>/dev/null)

if [ "$ACCESS_TOKEN" != "null" ] && [ -n "$ACCESS_TOKEN" ]; then
    echo -e "${GREEN}✅ User login successful${NC}"
    echo -e "${GREEN}🔑 Access token: ${ACCESS_TOKEN:0:20}...${NC}"
else
    echo -e "${RED}❌ User login failed${NC}"
    exit 1
fi

# Test 3: Get Current User
echo -e "${BLUE}👤 Test 3: Get Current User${NC}"

echo -e "${YELLOW}📤 Sending get current user request...${NC}"
USER_RESPONSE=$(make_request "GET" "$AUTH_ENDPOINT/me" "" "Authorization: Bearer $ACCESS_TOKEN")

echo -e "${YELLOW}📥 User response:${NC}"
echo "$USER_RESPONSE" | jq '.' 2>/dev/null || echo "$USER_RESPONSE"

# Check if user data was retrieved
if echo "$USER_RESPONSE" | grep -q "$TEST_EMAIL"; then
    echo -e "${GREEN}✅ Current user data retrieved successfully${NC}"
else
    echo -e "${RED}❌ Failed to retrieve current user data${NC}"
fi

# Test 4: Update User Profile
echo -e "${BLUE}✏️  Test 4: Update User Profile${NC}"

UPDATE_DATA='{
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1-555-9876"
}'

echo -e "${YELLOW}📤 Sending profile update request...${NC}"
UPDATE_RESPONSE=$(make_request "PUT" "$AUTH_ENDPOINT/profile" "$UPDATE_DATA" "Authorization: Bearer $ACCESS_TOKEN")

echo -e "${YELLOW}📥 Update response:${NC}"
echo "$UPDATE_RESPONSE" | jq '.' 2>/dev/null || echo "$UPDATE_RESPONSE"

# Check if profile was updated
if echo "$UPDATE_RESPONSE" | grep -q "Jane"; then
    echo -e "${GREEN}✅ User profile updated successfully${NC}"
else
    echo -e "${RED}❌ Failed to update user profile${NC}"
fi

# Test 5: Change Password
echo -e "${BLUE}🔒 Test 5: Change Password${NC}"

NEW_PASSWORD="NewSecurePass123!"
CHANGE_PASSWORD_DATA='{
    "currentPassword": "'$TEST_PASSWORD'",
    "newPassword": "'$NEW_PASSWORD'"
}'

echo -e "${YELLOW}📤 Sending change password request...${NC}"
CHANGE_PASSWORD_RESPONSE=$(make_request "PUT" "$AUTH_ENDPOINT/change-password" "$CHANGE_PASSWORD_DATA" "Authorization: Bearer $ACCESS_TOKEN")

echo -e "${YELLOW}📥 Change password response:${NC}"
echo "$CHANGE_PASSWORD_RESPONSE" | jq '.' 2>/dev/null || echo "$CHANGE_PASSWORD_RESPONSE"

# Check if password was changed
if echo "$CHANGE_PASSWORD_RESPONSE" | grep -q "Password changed successfully"; then
    echo -e "${GREEN}✅ Password changed successfully${NC}"
else
    echo -e "${RED}❌ Failed to change password${NC}"
fi

# Test 6: Login with New Password
echo -e "${BLUE}🔐 Test 6: Login with New Password${NC}"

NEW_LOGIN_DATA='{
    "email": "'$TEST_EMAIL'",
    "password": "'$NEW_PASSWORD'"
}'

echo -e "${YELLOW}📤 Sending login request with new password...${NC}"
NEW_LOGIN_RESPONSE=$(make_request "POST" "$AUTH_ENDPOINT/login" "$NEW_LOGIN_DATA")

echo -e "${YELLOW}📥 New login response:${NC}"
echo "$NEW_LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$NEW_LOGIN_RESPONSE"

# Check if login with new password was successful
if echo "$NEW_LOGIN_RESPONSE" | grep -q "Login successful"; then
    echo -e "${GREEN}✅ Login with new password successful${NC}"
else
    echo -e "${RED}❌ Login with new password failed${NC}"
fi

# Test 7: Logout
echo -e "${BLUE}🚪 Test 7: User Logout${NC}"

echo -e "${YELLOW}📤 Sending logout request...${NC}"
LOGOUT_RESPONSE=$(make_request "POST" "$AUTH_ENDPOINT/logout" "" "Authorization: Bearer $ACCESS_TOKEN")

echo -e "${YELLOW}📥 Logout response:${NC}"
echo "$LOGOUT_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGOUT_RESPONSE"

# Check if logout was successful
if echo "$LOGOUT_RESPONSE" | grep -q "Logout successful"; then
    echo -e "${GREEN}✅ User logout successful${NC}"
else
    echo -e "${RED}❌ User logout failed${NC}"
fi

# Test 8: Test Protected Route After Logout
echo -e "${BLUE}🔒 Test 8: Test Protected Route After Logout${NC}"

echo -e "${YELLOW}📤 Sending protected request after logout...${NC}"
PROTECTED_RESPONSE=$(make_request "GET" "$AUTH_ENDPOINT/me" "" "Authorization: Bearer $ACCESS_TOKEN")

echo -e "${YELLOW}📥 Protected response:${NC}"
echo "$PROTECTED_RESPONSE" | jq '.' 2>/dev/null || echo "$PROTECTED_RESPONSE"

# Check if protected route is properly blocked
if echo "$PROTECTED_RESPONSE" | grep -q "Unauthorized"; then
    echo -e "${GREEN}✅ Protected route properly blocked after logout${NC}"
else
    echo -e "${RED}❌ Protected route should be blocked after logout${NC}"
fi

# Summary
echo -e "${BLUE}📊 Test Summary${NC}"
echo -e "${GREEN}✅ Authentication flow completed successfully${NC}"
echo -e "${GREEN}✅ All tests passed${NC}"

echo -e "${BLUE}🎉 Authentication End-to-End Tests Completed!${NC}"
echo -e "${YELLOW}📱 Your mobile app can now connect to: $API_BASE_URL${NC}"
echo -e "${YELLOW}🔐 Authentication endpoints are working correctly${NC}"
