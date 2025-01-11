const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const port = 8080;

// API Key untuk layanan Virtual SIM
const API_KEY = '8UAkynwz2f6ION1SVGCbBTFhMDajQr'; // Ganti dengan API Key yang diberikan

// Middleware untuk menghandle JSON request
app.use(express.json());

// Middleware untuk melayani file statis
app.use(express.static(path.join(__dirname)));

// Endpoint untuk melayani halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint untuk membuat nomor Virtual SIM
app.post('/api/virtualsim/create', async (req, res) => {
    try {
        // Kirim permintaan ke API layanan virtual SIM untuk membuat nomor
        const response = await axios.post('https://api.virtualsimprovider.com/create', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`, // Sertakan API Key di header
            },
            data: {
                service: 'virtualSIM',
                country: 'US', // Atur sesuai dengan negara yang diinginkan
                // Parameter lain yang diperlukan oleh API
            }
        });

        // Jika permintaan berhasil, kembalikan nomor virtual SIM
        res.status(200).json({
            success: true,
            number: response.data.number,  // Mengambil nomor yang dibuat dari respons API
        });
    } catch (error) {
        console.error('Error creating Virtual SIM:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create Virtual SIM.',
        });
    }
});

// Endpoint untuk mengirim SMS
app.post('/api/virtualsim/sendSMS', async (req, res) => {
    const { number, message } = req.body;  // Dapatkan nomor dan pesan dari request body
    try {
        const response = await axios.post('https://api.virtualsimprovider.com/sendSMS', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`, // Sertakan API Key di header
            },
            data: {
                to: number,
                message: message,
            }
        });

        res.status(200).json({
            success: true,
            message: 'SMS sent successfully',
            response: response.data,  // Respons dari API
        });
    } catch (error) {
        console.error('Error sending SMS:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS.',
        });
    }
});

// Endpoint untuk memeriksa status SMS
app.get('/api/virtualsim/check-sms/:number', (req, res) => {
    const { number } = req.params;

    // Simulasi status SMS diterima
    setTimeout(() => {
        const smsCode = Math.floor(100000 + Math.random() * 900000); // Simulasi kode SMS
        res.status(200).json({
            success: true,
            number,
            smsReceived: true,
            smsCode,
        });
    }, 5000); // Simulasi delay
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
