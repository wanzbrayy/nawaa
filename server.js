const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 8080;

// API Key untuk layanan Virtual SIM
const API_KEY = '8UAkynwz2f6ION1SVGCbBTFhMDajQr'; // Ganti dengan API Key yang valid

// Middleware untuk menghandle JSON request
app.use(express.json());

// Atur folder statis untuk file HTML, CSS, dan JavaScript
app.use(express.static(path.join(__dirname)));

// Endpoint untuk melayani halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint untuk membuat nomor Virtual SIM
app.post('/api/virtualsim/create', async (req, res) => {
    try {
        const response = await axios.post('https://api.virtualsimprovider.com/create', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`, // Sertakan API Key di header
                'Content-Type': 'application/json',
            },
            data: {
                service: 'virtualSIM',  // Jenis layanan
                country: 'US',         // Negara (sesuaikan jika diperlukan)
            },
        });

        // Respons sukses, kembalikan nomor virtual SIM yang dibuat
        res.status(200).json({
            success: true,
            number: response.data.number, // Nomor virtual SIM yang dibuat
        });
    } catch (error) {
        console.error('Error creating Virtual SIM:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create Virtual SIM.',
            error: error.response ? error.response.data : error.message,
        });
    }
});

// Endpoint untuk mengirim SMS
app.post('/api/virtualsim/sendSMS', async (req, res) => {
    const { number, message } = req.body; // Dapatkan nomor dan pesan dari request body
    try {
        const response = await axios.post('https://api.virtualsimprovider.com/sendSMS', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            data: {
                to: number,
                message: message,
            },
        });

        res.status(200).json({
            success: true,
            message: 'SMS sent successfully',
            response: response.data,
        });
    } catch (error) {
        console.error('Error sending SMS:', error.response ? error.response.data : error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS.',
            error: error.response ? error.response.data : error.message,
        });
    }
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
