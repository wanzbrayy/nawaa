const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 8080;

// API Key untuk layanan Virtual SIM
const API_KEY = 'hVEqoxiPzKO3c9MkRGp4uSYI8FlNZB'; // Ganti dengan API Key yang valid

// Middleware untuk meng-handle JSON dan file statis
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Endpoint untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint untuk membuat Virtual SIM
app.post('/api/virtualsim/create', async (req, res) => {
    try {
        const { country } = req.body; // Negara yang dipilih pengguna (opsional)
        const response = await axios.post('https://virtusim.com/api/json.php', {
            api_key: API_KEY,
            action: 'create_number', // Action untuk membuat nomor
            country: country || 'US', // Default ke 'US' jika negara tidak disediakan
        });

        // Jika berhasil, respons akan mengandung nomor virtual
        if (response.data.success) {
            res.status(200).json({
                success: true,
                number: response.data.number,
            });
        } else {
            res.status(500).json({
                success: false,
                message: response.data.message || 'Failed to create Virtual SIM.',
            });
        }
    } catch (error) {
        console.error('Error creating Virtual SIM:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create Virtual SIM.',
            error: error.response ? error.response.data : error.message,
        });
    }
});

// Endpoint untuk mendapatkan SMS
app.post('/api/virtualsim/getSMS', async (req, res) => {
    const { number } = req.body; // Nomor yang ingin dicek pesan masuknya
    try {
        const response = await axios.post('https://virtusim.com/api/json.php', {
            api_key: API_KEY,
            action: 'get_sms', // Action untuk mendapatkan SMS
            number: number,
        });

        // Jika berhasil, respons akan mengandung pesan SMS
        if (response.data.success) {
            res.status(200).json({
                success: true,
                messages: response.data.messages, // Daftar pesan yang diterima nomor tersebut
            });
        } else {
            res.status(500).json({
                success: false,
                message: response.data.message || 'Failed to fetch SMS.',
            });
        }
    } catch (error) {
        console.error('Error fetching SMS:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch SMS.',
            error: error.response ? error.response.data : error.message,
        });
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
