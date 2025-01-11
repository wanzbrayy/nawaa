const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 8080;

// API Key untuk layanan Virtual SIM
const API_KEY = 'hVEqoxiPzKO3c9MkRGp4uSYI8FlNZB'; // Ganti dengan API Key yang diberikan

// Middleware untuk menghandle JSON request
app.use(express.json());
app.use(express.static(path.join(__dirname)));  // Menyajikan file statis seperti HTML, JS, CSS

// Endpoint untuk membuat nomor virtual SIM
app.post('/create-sim', async (req, res) => {
    try {
        const response = await axios.post('https://virtusim.com/api/json.php', {
            api_key: API_KEY,
            action: 'create_number',
            country: 'US'
        });

        console.log('API Response:', response.data);  // Debugging: Log response dari API

        if (response.data.success) {
            res.status(200).json({
                success: true,
                number: response.data.number // Pastikan number ada di dalam response
            });
        } else {
            res.status(400).json({
                success: false,
                message: response.data.message || 'Failed to create SIM.'
            });
        }
    } catch (error) {
        console.error('Error creating Virtual SIM:', error); // Debugging: Log error
        res.status(500).json({
            success: false,
            message: 'Failed to create SIM.',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Endpoint untuk memeriksa SMS berdasarkan nomor virtual
app.get('/check-sms/:number', async (req, res) => {
    const { number } = req.params;

    try {
        const response = await axios.post('https://virtusim.com/api/json.php', {
            api_key: API_KEY,
            action: 'check_sms',
            number: number
        });

        console.log('Check SMS Response:', response.data); // Debugging: Log response dari API

        if (response.data.success && response.data.sms_received) {
            res.status(200).json({
                smsReceived: true,
                smsCode: response.data.sms_code
            });
        } else {
            res.status(200).json({
                smsReceived: false
            });
        }
    } catch (error) {
        console.error('Error checking SMS:', error); // Debugging: Log error
        res.status(500).json({
            success: false,
            message: 'Failed to check SMS.',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Menjalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
