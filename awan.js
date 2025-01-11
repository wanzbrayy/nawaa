document.addEventListener('DOMContentLoaded', () => {
    const createSimBtn = document.getElementById('createSimBtn');
    const simInfo = document.getElementById('simInfo');
    const simNumber = document.getElementById('simNumber');
    const historyContainer = document.getElementById('historyContainer');
    const loading = document.getElementById('loading');

    // Event: Buat nomor virtual SIM
    createSimBtn.addEventListener('click', () => {
        loading.style.display = 'block';
        simInfo.style.display = 'none';

        fetch('/create-sim', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            loading.style.display = 'none';
            simInfo.style.display = 'block';
            simNumber.textContent = data.number;

            // Tambahkan nomor ke history
            addHistory(data.number, 'Waiting for SMS...');

            // Panggil API untuk memantau SMS
            checkForSms(data.number);
        })
        .catch(error => {
            loading.style.display = 'none';
            alert('Failed to create SIM. Please try again.');
        });
    });

    // Tambahkan ke history
    function addHistory(number, status) {
        const item = document.createElement('div');
        item.className = 'historyItem';
        item.textContent = `Number: ${number} - Status: ${status}`;
        historyContainer.appendChild(item);
    }

    // Periksa SMS untuk nomor tersebut
    function checkForSms(number) {
        const interval = setInterval(() => {
            fetch(`/check-sms/${number}`)
                .then(response => response.json())
                .then(data => {
                    if (data.smsReceived) {
                        clearInterval(interval);
                        alert(`Verification Code: ${data.smsCode}`);

                        // Navigasi ke halaman SMS
                        window.location.href = `/sms/${number}`;
                    }
                });
        }, 3000);
    }
});
