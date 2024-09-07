const socket = io();

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`); // Debugging log
            socket.emit("send location", { latitude, longitude });

            if (!markers['myLocation']) {
                markers['myLocation'] = L.marker([latitude, longitude]).addTo(map);
            } else {
                markers['myLocation'].setLatLng([latitude, longitude]).update();
            }
        },
        (error) => {
            console.error("Geolocation error:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
} else {
    console.error("Geolocation is not supported by this browser.");
}

const map = L.map("map").setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'OpenStreetMap'
}).addTo(map);

const markers = {}; 

socket.on('location update', (location) => {
    const { latitude, longitude } = location;
    map.setView([latitude, longitude]);

    
    if (!markers[location.id]) {
        markers[location.id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        markers[location.id].setLatLng([latitude, longitude]).update();
    }
});

