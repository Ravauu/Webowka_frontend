<script>
export default {
  data() {
    return {
      googleMapsLoaded: false,
      map: null,
      senderAddress: "Jastrzębie-Zdrój, ul. Niepodległości 266", // Adres nadawczy
    };
  },
  methods: {
    async loadGoogleMaps() {
      if (this.googleMapsLoaded || document.querySelector("script[src*='maps.googleapis.com']")) {
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=places&v=weekly`;
      script.async = true;
      script.defer = true;
      script.setAttribute("loading", "async");

      window.initMap = this.initMap.bind(this);
      document.head.appendChild(script);
    },

    initMap() {
      console.log("Inicjalizacja mapy...");
      this.googleMapsLoaded = true;

      this.map = new google.maps.Map(document.getElementById("map"), {
        center: {lat: 52.2296756, lng: 21.0122287}, // Domyślny punkt (np. Warszawa)
        zoom: 10,
      });

      const marker = new google.maps.Marker({
        position: {lat: 52.2296756, lng: 21.0122287},
        map: this.map,
        title: "Twoja dostawa!",
      });
    },

    async calculateDeliveryTime(destination) {
      const origin = this.senderAddress; // Adres nadawczy
      try {
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/distance-matrix`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                origins: origin,
                destinations: destination
              })
            }
        );

        const data = await response.json();
        if (data.delivery_time) {
          alert(`Szacowany czas dostawy: ${data.delivery_time}`);
        } else {
          console.error("Błąd w odpowiedzi API:", data);
          alert("Nie można obliczyć czasu dostawy.");
        }
      } catch (error) {
        console.error("Błąd podczas wywołania API:", error);
        alert("Wystąpił błąd podczas obliczania czasu dostawy.");
      }
    },

    async testDeliveryTime() {
      const destination = "Opole, Polska"; // Adres docelowy
      this.calculateDeliveryTime(destination);
    },
  },

  mounted() {
    this.loadGoogleMaps();
  },
};
</script>

<template>
  <div>
    <h1>Mapa Dostawy</h1>
    <div id="map" style="height: 400px; width: 100%;"></div>
    <button @click="testDeliveryTime">Testuj czas dostawy</button>
  </div>
</template>

<style scoped>
#map {
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>
