const axios = require('axios');

const USERS_API_BASE =
  process.env.USERS_API_BASE_URL ||
  'https://hujj01zp2a.execute-api.us-west-1.amazonaws.com';

/**
 * Register a new user
 */
async function registerUser(payload) {
  try {
    const res = await axios.post(`${USERS_API_BASE}/users`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res.data;
  } catch (error) {
    console.error('Register user error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get user by userId
 */
async function getUser(userId) {
  try {
    const res = await axios.get(`${USERS_API_BASE}/users/${userId}`);
    return res.data;
  } catch (error) {
    console.error('Get user error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Update user information
 */
async function updateUser(userId, payload) {
  try {
    const res = await axios.put(
      `${USERS_API_BASE}/users/${userId}`,
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    return res.data;
  } catch (error) {
    console.error('Update user error:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Get user by phone number
 * This queries the API Gateway to find user by phone
 */
async function getUserByPhone(phone) {
  try {
    // Option 1: If your Lambda supports query by phone
    const res = await axios.get(`${USERS_API_BASE}/users`, {
      params: { phone: phone }
    });
    
    if (res.data && res.data.user) {
      return res.data.user;
    }
    
    if (res.data && res.data.users && res.data.users.length > 0) {
      return res.data.users[0];
    }
    
    return null;
  } catch (error) {
    // 404 means user not found - that's okay
    if (error.response && error.response.status === 404) {
      console.log(`User with phone ${phone} not found`);
      return null;
    }
    
    console.error('Get user by phone error:', error.response?.data || error.message);
    throw error;
  }
}

module.exports = { 
  registerUser, 
  getUser, 
  updateUser,
  getUserByPhone 
};
