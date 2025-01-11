const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 8080;

// API Key untuk layanan Virtual SIM
const API_KEY = 'hVEqoxiPzKO3c9MkRGp4uSYI8FlNZB'; // API Key yang valid

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
        // Kirim permintaan ke API Virtual SIM
        const response = await axios.post('https://virtusim.com/api/json.php', {
            api_key: API_KEY, // API Key
            action: 'create_number', // Aksi yang diminta
            country: req.body.country || 'US', // Negara (default ke US jika tidak diberikan)
        });

        console.log('API Response:', response.data); // Log respons API untuk debugging

        // Cek apakah respons berhasil
        if (response.data.success) {
            res.status(200).json({
                success: true,
                number: response.data.number, // Nomor virtual yang dibuat
                message: response.data.message || 'Virtual SIM created successfully!',
            });
        } else {
            res.status(400).json({
                success: false,
                message: response.data.message || 'Failed to create Virtual SIM.',
            });
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create Virtual SIM.',
            error: error.response ? error.response.data : error.message,
        });
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
