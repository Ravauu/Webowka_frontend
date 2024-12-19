<script>
export default {
  data() {
    return {
      googleMapsLoaded: false,
      map: null,
    };
  },
  methods: {
    async loadGoogleMaps() {
      if (this.googleMapsLoaded) return;

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;

      window.initMap = this.initMap; // Google wywołuje tę funkcję jako callback
      document.head.appendChild(script);
    },
    initMap() {
      this.googleMapsLoaded = true;

      this.map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 52.2296756, lng: 21.0122287 }, // Przykład: Warszawa
        zoom: 10,
      });

      new google.maps.Marker({
        position: { lat: 52.2296756, lng: 21.0122287 }, // Marker na lokalizacji
        map: this.map,
        title: "Twoja dostawa!",
      });
    },
    async calculateDeliveryTime() {
      const origin = "Warszawa, Polska";
      const destination = "Kraków, Polska";

      const response = await fetch(
          `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin}&destinations=${destination}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();
      const deliveryTime = data.rows[0].elements[0].duration.text;

      alert(`Szacowany czas dostawy: ${deliveryTime}`);
    },
    handleDelivery() {
      this.loadGoogleMaps();
      this.calculateDeliveryTime();
    },
  },
};
</script>

<template>
  <div>
    <button @click="handleDelivery">Dostawa</button>
    <div id="map" style="height: 400px; width: 100%;"></div>
  </div>
</template>
