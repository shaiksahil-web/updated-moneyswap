require("dotenv").config();              // ✅ LOAD .env correctly before anything else

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// ✅ Stronger, controlled CORS for frontend service access
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
}));

app.use(express.json());

const PORT = process.env.PORT || 4000;

// ===== Lambda API base URLs (with correct variable names) =====
const USERS_API_BASE =
  process.env.USERS_API_BASE_URL ||
  "https://hujj01zp2a.execute-api.us-west-1.amazonaws.com";

const REQUESTS_API_BASE =
  process.env.REQUESTS_API_BASE_URL ||
  "https://7eb33vpxkj.execute-api.us-west-1.amazonaws.com";

// ================= AUTH =================

app.post('/api/auth/send-otp', (req, res) => {
  const { phone } = req.body;
  console.log(`OTP request received for phone: ${phone}`);

  // Simulate OTP
  return res.json({ success: true });
});

app.post('/api/auth/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  if (otp !== "123456") {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  try {
    // Check for existing user
    const url = `${USERS_API_BASE}/users/by-phone?phone=${encodeURIComponent(phone)}`;

    let isNewUser = true;
    let userId = null;

    try {
      const resp = await axios.get(url);
      if (resp.data && resp.data.user) {
        isNewUser = false;
        userId = resp.data.user.userId;
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("UsersAPI phone-check error: ", err.message);
      }
    }

    if (!userId) {
      userId = `temp_${phone}`;
    }

    const token = `demo-token-user-${phone}`;

    return res.json({
      userId,
      token,
      isNewUser,
    });
  } catch (err) {
    console.error("verifyOtp error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ================ USERS API =================

// Register
app.post('/api/users', async (req, res) => {
  try {
    const url = `${USERS_API_BASE}/users`;
    const resp = await axios.post(url, req.body);
    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error("createUser error:", err.message);
    return res
      .status(err.response?.status || 500)
      .json({ message: "Failed to create user" });
  }
});

// Get profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    const url = `${USERS_API_BASE}/users/${req.params.userId}`;
    const resp = await axios.get(url);
    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error("getUser error:", err.message);
    return res
      .status(err.response?.status || 500)
      .json({ message: "Failed to get profile" });
  }
});

// Update profile
app.put('/api/users/:userId', async (req, res) => {
  try {
    const url = `${USERS_API_BASE}/users/${req.params.userId}`;
    const resp = await axios.put(url, req.body);
    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error("updateUser error:", err.message);
    return res
      .status(err.response?.status || 500)
      .json({ message: "Failed to update profile" });
  }
});

// ================ REQUESTS API =================

// Create request
app.post('/api/requests', async (req, res) => {
  try {
    const url = `${REQUESTS_API_BASE}/requests`;
    const resp = await axios.post(url, req.body);
    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error("createRequest error:", err.message);
    return res
      .status(err.response?.status || 500)
      .json({ message: "Failed to create request" });
  }
});

// List requests
app.get('/api/requests', async (req, res) => {
  try {
    const { type } = req.query;

    const url = `${REQUESTS_API_BASE}/requests`;
    const resp = await axios.get(url, { params: { type } });

    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error("listRequests error:", err.message);
    return res
      .status(err.response?.status || 500)
      .json({ message: "Failed to load requests" });
  }
});

// ================ START SERVER =================

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
