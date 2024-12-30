<script>
export default {
  data() {
    return {
      googleMapsLoaded: false,
      map: null,
      directionsRenderer: null,
      deliveryTime: null, // Czas dostawy
      deliveryTimeString: null, // Przewidywana godzina dostawy
      senderAddress: "Jastrzębie-Zdrój, ul. Niepodległości 266", // Adres nadawcy
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

      window.initMap = this.initMap.bind(this);
      document.head.appendChild(script);
    },

    initMap() {
      console.log("Inicjalizacja mapy...");
      this.googleMapsLoaded = true;

      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 52.2296756, lng: 21.0122287 }, // Domyślny punkt (np. Warszawa)
        zoom: 10,
      });

      this.directionsRenderer = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers: false, // Wyświetl markery
      });
    },

    async fetchUserAddress() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/address`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Nie udało się pobrać adresu użytkownika.");
        }

        const data = await response.json();
        return data.address; // Zwróć adres użytkownika
      } catch (error) {
        console.error("Błąd podczas pobierania adresu użytkownika:", error);
        alert("Nie udało się pobrać adresu użytkownika.");
        return null;
      }
    },

    async calculateDeliveryRoute() {
      try {
        const destination = await this.fetchUserAddress(); // Pobierz adres użytkownika
        if (!destination) return;

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/distance-matrix`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            origins: [this.senderAddress],
            destinations: [destination],
          }),
        });

        const data = await response.json();
        if (data.delivery_time) {
          console.log(`Czas dostawy: ${data.delivery_time}`);
          this.deliveryTime = data.delivery_time; // Zapisz czas dostawy

          // Oblicz przewidywaną godzinę dostawy
          const now = new Date();
          const deliveryDuration = data.delivery_time.match(/(\d+)\s*hours?|(\d+)\s*mins?/g);
          let estimatedDeliveryTime = new Date(now);

          if (deliveryDuration) {
            deliveryDuration.forEach((duration) => {
              if (duration.includes("hour")) {
                const hours = parseInt(duration);
                estimatedDeliveryTime.setHours(estimatedDeliveryTime.getHours() + hours);
              } else if (duration.includes("min")) {
                const minutes = parseInt(duration);
                estimatedDeliveryTime.setMinutes(estimatedDeliveryTime.getMinutes() + minutes);
              }
            });
          }

          const deliveryTimeString = estimatedDeliveryTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          console.log(`Przewidywana godzina dostawy: ${deliveryTimeString}`);
          this.deliveryTimeString = deliveryTimeString; // Zapisz przewidywaną godzinę dostawy

          this.displayRouteOnMap(this.senderAddress, destination, {
            time: data.delivery_time,
            estimatedTime: deliveryTimeString,
          });
        } else {
          console.error("Błąd w odpowiedzi API:", data);
          alert("Nie można obliczyć czasu dostawy.");
        }
      } catch (error) {
        console.error("Błąd podczas wywołania API:", error);
        alert("Wystąpił błąd podczas obliczania trasy dostawy.");
      }
    },

    displayRouteOnMap(origin, destination, deliveryInfo) {
      const directionsService = new google.maps.DirectionsService();

      directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (response, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
              this.directionsRenderer.setDirections(response);

              // Dodaj info o czasie dostawy na mapie
              const leg = response.routes[0].legs[0];
              const infoWindow = new google.maps.InfoWindow({
                content: `
                <p><strong>Czas dostawy:</strong> ${deliveryInfo.time}</p>
                <p><strong>Przewidywana godzina dostawy:</strong> ${deliveryInfo.estimatedTime}</p>
              `,
                position: leg.end_location,
              });
              infoWindow.open(this.map);
            } else {
              console.error("Directions request failed due to " + status);
              alert("Nie udało się obliczyć trasy na mapie.");
            }
          }
      );
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
    <button @click="calculateDeliveryRoute">Oblicz trasę dostawy</button>
    <p v-if="deliveryTime" style="margin-top: 10px;">
      <strong>Szacowany czas dostawy:</strong> {{ deliveryTime }}<br/>
      <strong>Przewidywana godzina dostawy:</strong> {{ deliveryTimeString }}
    </p>
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
