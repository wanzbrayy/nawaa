const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 8080;

// API Key dan URL dari virtusim
const API_KEY = 'hVEqoxiPzKO3c9MkRGp4uSYI8FlNZB'; // Ganti dengan API key Anda
const API_URL = 'https://virtusim.com/api/json.php';

// Middleware untuk parsing JSON
app.use(bodyParser.json());

// Serve Static Files (HTML, CSS, JS) dari root folder
app.use(express.static(path.join(__dirname)));

// Endpoint untuk membuat nomor Virtual SIM
app.post('/create-sim', async (req, res) => {
    try {
        const postData = {
            api_key: API_KEY,
            action: 'order',
            service: '26',           // ID layanan (ganti dengan ID layanan yang sesuai)
            operator: 'indosat'      // Operator untuk nomor virtual (ganti dengan yang diinginkan)
        };

        const response = await axios.post(API_URL, postData);

        console.log('API Response:', response.data);  // Debugging: Log response dari API

        if (response.data.status) {
            const simNumber = response.data.data.number;
            console.log('Sim Number:', simNumber);

            if (simNumber) {
                res.status(200).json({
                    success: true,
                    number: simNumber
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'No number returned from API.'
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: response.data.data.msg || 'Failed to create SIM.'
            });
        }
    } catch (error) {
        console.error('Error creating Virtual SIM:', error);

        res.status(500).json({
            success: false,
            message: 'Failed to create SIM.',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Endpoint untuk memeriksa status SMS (jika diperlukan)
app.get('/check-sms/:number', async (req, res) => {
    try {
        const simNumber = req.params.number;

        const postData = {
            api_key: API_KEY,
            action: 'active_order',
            number: simNumber
        };

        const response = await axios.post(API_URL, postData);

        console.log('Check SMS Response:', response.data);

        if (response.data.status) {
            res.status(200).json({
                smsReceived: true,
                smsCode: response.data.data.sms_code
            });
        } else {
            res.status(200).json({
                smsReceived: false
            });
        }
    } catch (error) {
        console.error('Error checking SMS:', error);
        res.status(500).json({
            smsReceived: false,
            message: 'Failed to check SMS.',
            error: error.response ? error.response.data : error.message
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
