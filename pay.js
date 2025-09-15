// QR Code Generation
function generateQRCode(amount) {
    const qrContainer = document.getElementById("qrcode");
    qrContainer.innerHTML = ''; // Clear previous QR code

    const qrData = `upi://pay?pa=parkin@upi&pn=ParkIN&am=${amount}&cu=INR`;

    new QRCode(qrContainer, {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

// Generate initial QR code
generateQRCode(0);

// Duration change handler
const duration = document.getElementById('duration');
const summaryTotal = document.getElementById('summary-total');

if (duration && summaryTotal) {
    duration.addEventListener('change', function () {
        const hours = parseInt(this.value) || 0;
        const ratePerHour = 50;
        const total = hours * ratePerHour;

        // Update summary
        summaryTotal.textContent = `₹${total.toFixed(2)}`;

        // Update QR code with new amount
        generateQRCode(total);
    });
}
