let map = null;

export async function showLocationInfo(city, lat, lon) {
    const knowMoreBtn = document.getElementById('knowMoreBtn');
    knowMoreBtn.classList.remove('d-none');
    
    knowMoreBtn.onclick = async () => {
        const modal = new bootstrap.Modal(document.getElementById('locationModal'));
        modal.show();
        
        try {
            // Fetch location details using OpenStreetMap Nominatim API
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await response.json();
            
            displayLocationDetails(data);
            initializeMap(lat, lon, city);
            
        } catch (error) {
            console.error('Error fetching location info:', error);
            showError('Failed to load location information');
        }
    };
}

function displayLocationDetails(data) {
    const infoList = document.getElementById('location-info-list');
    const address = data.address;
    
    infoList.innerHTML = `
        ${address.country ? `<div class="list-group-item"><i class="fas fa-globe"></i> Country: ${address.country}</div>` : ''}
        ${address.state ? `<div class="list-group-item"><i class="fas fa-map"></i> State: ${address.state}</div>` : ''}
        ${address.city || address.town ? `<div class="list-group-item"><i class="fas fa-city"></i> City: ${address.city || address.town}</div>` : ''}
        ${address.postcode ? `<div class="list-group-item"><i class="fas fa-mail-bulk"></i> Postal Code: ${address.postcode}</div>` : ''}
        ${data.lat && data.lon ? `<div class="list-group-item"><i class="fas fa-location-arrow"></i> Coordinates: ${Number(data.lat).toFixed(4)}, ${Number(data.lon).toFixed(4)}</div>` : ''}
    `;
}

function initializeMap(lat, lon, city) {
    const mapContainer = document.getElementById('map');
    
    if (!map) {
        map = L.map('map');
    }
    
    map.setView([lat, lon], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    L.marker([lat, lon])
        .addTo(map)
        .bindPopup(city)
        .openPopup();
        
    // Force map refresh
    setTimeout(() => map.invalidateSize(), 250);
}

function showError(message) {
    const infoList = document.getElementById('location-info-list');
    infoList.innerHTML = `<div class="alert alert-danger">${message}</div>`;
}
