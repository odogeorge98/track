// Change the navbar color on scroll
$(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
        $('.navbar').addClass('scrolled');
    } else {
        $('.navbar').removeClass('scrolled');
    }
});

// Event listener for the tracking button
document.getElementById('trackButton').addEventListener('click', () => {
    const trackingId = document.getElementById('trackingId').value;

    if (!trackingId) {
        alert('Please enter a tracking ID.');
        return;
    }

    fetch('http://localhost:8080/track-parcel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tracking_code: trackingId })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Display the receipt info with additional details
                document.getElementById('receiptInfo').innerHTML = `
                <div style="text-align:center; padding: 20px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); background-color: #fff; border-radius: 10px; position: relative;">
                    <div style="background-color: #f55f5f; color: #fff; padding: 15px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                        <h2 style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0;">Tracking Details</h2>
                    </div>
                    <img src="../resources/plane.svg" alt="Parcel Image" style="width:150px; height:auto; border-radius:8px; margin: 15px 0;" />
                    <div style="text-align: left; margin: 0 auto; max-width: 600px; position: relative; padding: 20px;">
                        <!-- Watermark -->
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('../resources/plane.svg'); background-size: 200px; opacity: 0.1; pointer-events: none;"></div>
            
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Tracking ID:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; font-weight: bold; display: inline; margin-left: 10px;">${trackingId}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Customer Name:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.customer}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Address:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.address}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Parcel Info:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.parcel_info}</p>
                        </div>
            
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Contents:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.contents || 'No content specified.'}</p>
                        </div>
            
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Status:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.status}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Estimated Delivery:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.estimated_delivery}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Last Location:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.last_location}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Notes:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.notes || 'No additional notes available.'}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Amount to be Paid:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #D9534F; font-weight: bold; display: inline; margin-left: 10px;">
                                $${data.amount_to_be_paid != null ? data.amount_to_be_paid : '0.00'}
                            </p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Agent to Contact:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.payment_agent || 'N/A'}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <h5 style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #555; font-weight: bold; font-size: 18px; display: inline;">Reason for Payment:</h5>
                            <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; display: inline; margin-left: 10px;">${data.payment_reason || 'Service fee'}</p>
                        </div>
                    </div>
                    <div style="margin-top: 20px; font-size: 14px; color: #777; text-align: center;">
                        <p style="margin: 0;">Thank you for choosing our service!</p>
                        <p style="margin: 0;">For further inquiries, please contact our customer service.</p>
                    </div>
                </div>
            `;
            

            

                openModal(); // Open modal
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to track the parcel. Please try again.');
        });
});

// Function to open the modal
function openModal() {
    document.getElementById('receiptModal').style.display = 'block';
}

// Function to close the modal
function closeModal() {
    document.getElementById('receiptModal').style.display = 'none';
}

// Function to print the receipt
function printReceipt() {
    const printContent = document.getElementById('receiptInfo').innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload page to restore original content after printing
}

// Close the modal when the user clicks anywhere outside of it
window.onclick = function (event) {
    const modal = document.getElementById('receiptModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13); // Set the initial view (latitude, longitude, zoom level)

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Add a marker at a specific location
const marker = L.marker([51.5, -0.09]).addTo(map);
marker.bindPopup('<b>Hello!</b><br>Your items are in the airport now.').openPopup();




// Function to animate the counter
function animateCounter(counter) {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 100; // Adjust the divisor to change the speed

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => animateCounter(counter), 20); // 20ms delay
    } else {
        counter.innerText = target;
    }
}

// Function to check if an element is in the viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
           rect.bottom >= 0;
}

// Function to start the counter animations
function checkCounters() {
    const counters = document.querySelectorAll('.count');
    counters.forEach(counter => {
        const parent = counter.closest('.single-counter-item');
        if (isInViewport(parent)) {
            if (!counter.classList.contains('started')) { // Prevent multiple triggers
                counter.classList.add('started');
                animateCounter(counter);
            }
        }
    });
}

// Event listeners for scrolling and loading
window.addEventListener('scroll', checkCounters);
window.addEventListener('load', checkCounters);