const express = require('express');
const axios = require('axios');
const app = express();
const port = 5000;

// API Key untuk layanan Virtual SIM
const API_KEY = '8UAkynwz2f6ION1SVGCbBTFhMDajQr'; // Ganti dengan API Key yang diberikan

// Middleware untuk menghandle JSON request
app.use(express.json());


app.post('/api/virtualsim/create', async (req, res) => {
    try {
        // Kirim permintaan ke API layanan virtual SIM untuk membuat nomor
        const response = await axios.post('https://api.virtualsimprovider.com/create', {
            headers: {
                'Authorization': `Bearer ${API_KEY}`, // Sertakan API Key di header
            },
            data: {
                // Parameter lainnya yang diperlukan untuk membuat nomor virtual
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
        console.error('Error creating Virtual SIM:', error);
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
        console.error('Error sending SMS:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send SMS.',
        });
    }
});
app.post('/check-sms/:number', (req, res) => {
    const { number } = req.params;

    // Simulasikan status SMS diterima
    setTimeout(() => {
        const smsCode = Math.floor(100000 + Math.random() * 900000);
        res.json({ smsReceived: true, smsCode });
    }, 5000);app.post('/check-sms/:number', (req, res) => {
    const { number } = req.params;

    // Simulasikan status SMS diterima
    setTimeout(() => {
        const smsCode = Math.floor(100000 + Math.random() * 900000);
        res.json({ smsReceived: true, smsCode });
    }, 5000);
});
// Jalankan server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
