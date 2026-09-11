// OpenRouteService API Anahtarınız (Eklenmiş Hali)
const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImYzMTU3MGQ5YWU1NDQzYzRiYjBmZWNiYWYwNzAyZWZjIiwiaCI6Im11cm11cjY0In0=";

// 1. Haritayı Başlat (Varsayılan: İstanbul)
const map = L.map("map").setView([41.0082, 28.9784], 11);

// Yandex Tarzı Koyu/Açık Katman Yapısı (CartoDB / OpenStreetMap)
L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19
}).addTo(map);

let startPoint = null;
let endPoint = null;
let startMarker = null;
let endMarker = null;
let routeLayer = null;

// 2. Harita Tıklama Olayı
map.on("click", function (e) {
  if (!startPoint) {
    startPoint = e.latlng;
    startMarker = L.marker(startPoint).addTo(map).bindPopup("Başlangıç").openPopup();
  } else if (!endPoint) {
    endPoint = e.latlng;
    endMarker = L.marker(endPoint).addTo(map).bindPopup("Varış").openPopup();
    fetchHeavyVehicleRoute();
  }
});

// 3. Rota Hesabı Servisi (Ağır Vasıta Yasaklarını Uygular)
async function fetchHeavyVehicleRoute() {
  const profile = document.getElementById("vehicleType").value;
  const height = parseFloat(document.getElementById("maxHeight").value);
  const weight = parseFloat(document.getElementById("maxWeight").value);
  const width = parseFloat(document.getElementById("maxWidth").value);

  // Yeni güncel servis adresi (api.heigit.org)
  const url = `https://api.heigit.org/v2/directions/${profile}/geojson`;

  const bodyData = {
    coordinates: [
      [startPoint.lng, startPoint.lat],
      [endPoint.lng, endPoint.lat]
    ],
    options: {
      profile_params: {
        weight_restrictions: {
          length: 12,
          weight: weight,
          height: height,
          width: width
        }
      },
      // Feribot engelleme opsiyonu
      avoid_features: ["ferries"]
    }
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json; charset=utf-8"
      },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (data.features && data.features.length > 0) {
      if (routeLayer) map.removeLayer(routeLayer);

      routeLayer = L.geoJSON(data.features[0], {
        style: {
          color: "#ff3300",
          weight: 6,
          opacity: 0.8
        }
      }).addTo(map);

      map.fitBounds(routeLayer.getBounds(), { padding: [50, 50] });

      const summary = data.features[0].properties.summary;
      const distance = (summary.distance / 1000).toFixed(2);
      const duration = Math.round(summary.duration / 60);

      document.getElementById("routeInfo").innerHTML = `
        <strong>Mesafe:</strong> ${distance} km<br>
        <strong>Tahmini Süre:</strong> ${duration} dk<br>
        <span style="color:green; font-size:11px;">✓ Dar sokaklar ve tonaj kısıtlamaları engellendi.</span>
      `;
    } else {
      alert("Seçilen araç boyutlarına uygun geçiş noktası bulunamadı!");
    }
  } catch (error) {
    console.error("Rota hatası:", error);
    alert("Rota hesaplanırken bir sorun oluştu.");
  }
}

// 4. Temizleme Butonu
document.getElementById("clearBtn").addEventListener("click", () => {
  if (startMarker) map.removeLayer(startMarker);
  if (endMarker) map.removeLayer(endMarker);
  if (routeLayer) map.removeLayer(routeLayer);
  startPoint = null;
  endPoint = null;
  document.getElementById("routeInfo").innerHTML = "";
});

