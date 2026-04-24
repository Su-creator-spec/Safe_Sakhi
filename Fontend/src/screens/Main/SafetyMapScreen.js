import * as Location from 'expo-location';
import { Car, Search, Shield, ShieldAlert, Train, X } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Circle, Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Google Places API Key ───────────────────────────────────────────────────
// This is the raw API key (NOT the full URL)
const GOOGLE_PLACES_KEY = '##';

// ─── City Safety Data (from city_safety_scores.csv) ─────────────────────────
// Zone colours: Green = safe, Orange = moderate, Red = unsafe
const CITY_SAFETY_DATA = [
  { city: 'Agra', lat: 27.1767, lng: 78.0081, score: 37.62, zone: 'Orange' },
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, score: 36.76, zone: 'Red' },
  { city: 'Bangalore', lat: 12.9716, lng: 77.5946, score: 37.93, zone: 'Orange' },
  { city: 'Bhopal', lat: 23.2599, lng: 77.4126, score: 37.75, zone: 'Orange' },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707, score: 36.94, zone: 'Red' },
  { city: 'Delhi', lat: 28.7041, lng: 77.1025, score: 36.90, zone: 'Red' },
  { city: 'Faridabad', lat: 28.4089, lng: 77.3178, score: 37.46, zone: 'Orange' },
  { city: 'Ghaziabad', lat: 28.6692, lng: 77.4538, score: 38.04, zone: 'Orange' },
  { city: 'Hyderabad', lat: 17.3850, lng: 78.4867, score: 37.77, zone: 'Orange' },
  { city: 'Indore', lat: 22.7196, lng: 75.8577, score: 36.37, zone: 'Red' },
  { city: 'Jaipur', lat: 26.9124, lng: 75.7873, score: 37.82, zone: 'Orange' },
  { city: 'Kalyan', lat: 19.2403, lng: 73.1305, score: 40.85, zone: 'Orange' },
  { city: 'Kanpur', lat: 26.4499, lng: 80.3319, score: 38.83, zone: 'Orange' },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639, score: 37.69, zone: 'Orange' },
  { city: 'Lucknow', lat: 26.8467, lng: 80.9462, score: 37.62, zone: 'Orange' },
  { city: 'Ludhiana', lat: 30.9010, lng: 75.8573, score: 36.29, zone: 'Red' },
  { city: 'Meerut', lat: 28.9845, lng: 77.7064, score: 35.01, zone: 'Red' },
  { city: 'Mumbai', lat: 19.0760, lng: 72.8777, score: 37.27, zone: 'Orange' },
  { city: 'Nagpur', lat: 21.1458, lng: 79.0882, score: 38.24, zone: 'Orange' },
  { city: 'Nashik', lat: 19.9975, lng: 73.7898, score: 35.36, zone: 'Red' },
  { city: 'Patna', lat: 25.5941, lng: 85.1376, score: 37.74, zone: 'Orange' },
  { city: 'Pune', lat: 18.5204, lng: 73.8567, score: 38.65, zone: 'Orange' },
  { city: 'Rajkot', lat: 22.3039, lng: 70.8022, score: 37.22, zone: 'Orange' },
  { city: 'Srinagar', lat: 34.0837, lng: 74.7973, score: 39.25, zone: 'Orange' },
  { city: 'Surat', lat: 21.1702, lng: 72.8311, score: 38.71, zone: 'Orange' },
  { city: 'Thane', lat: 19.2183, lng: 72.9781, score: 37.17, zone: 'Orange' },
  { city: 'Varanasi', lat: 25.3176, lng: 82.9739, score: 37.86, zone: 'Orange' },
  { city: 'Vasai', lat: 19.3919, lng: 72.8397, score: 37.54, zone: 'Orange' },
  { city: 'Visakhapatnam', lat: 17.6868, lng: 83.2185, score: 37.45, zone: 'Orange' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ZONE_COLORS = {
  Green: { fill: 'rgba(16, 185, 129, 0.18)', stroke: '#10b981', badge: '#10b981', text: '🟢 Green Zone – Safe' },
  Orange: { fill: 'rgba(245, 158, 11, 0.18)', stroke: '#f59e0b', badge: '#f59e0b', text: '🟡 Orange Zone – Moderate' },
  Red: { fill: 'rgba(239, 68, 68, 0.18)', stroke: '#ef4444', badge: '#ef4444', text: '🔴 Red Zone – Caution' },
};

function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Return the nearest city entry from our dataset (within 80 km). */
function detectCityZone(lat, lng) {
  let nearest = null;
  let minDist = Infinity;
  for (const entry of CITY_SAFETY_DATA) {
    const d = haversineKm(lat, lng, entry.lat, entry.lng);
    if (d < minDist) {
      minDist = d;
      nearest = entry;
    }
  }
  return minDist <= 80 ? nearest : null;
}

/** Fetch nearest place via Google Places Nearby Search. */
async function fetchNearestPlace(lat, lng, placeType, keyword = '') {
  const radius = 3000; // 3 km
  let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${placeType}&key=${GOOGLE_PLACES_KEY}`;
  if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.status !== 'OK' || !json.results?.length) {
    throw new Error(json.status || 'No results');
  }

  const place = json.results[0];
  return {
    latitude: place.geometry.location.lat,
    longitude: place.geometry.location.lng,
    title: place.name,
    vicinity: place.vicinity,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function SafetyMapScreen() {
  const mapRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState({
    latitude: 28.6304,
    longitude: 77.2177,
  });
  const [initialRegion, setInitialRegion] = useState({
    latitude: 28.6304,
    longitude: 77.2177,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const [locationError, setLocationError] = useState(null);
  const [currentZone, setCurrentZone] = useState(null); // { city, zone, score, lat, lng }
  const [destination, setDestination] = useState(null);
  const [activeRouteType, setActiveRouteType] = useState(null);
  const [loadingType, setLoadingType] = useState(null); // which button is loading

  // ── Get user location & detect safety zone ─────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const newLoc = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setCurrentLocation(newLoc);
      setInitialRegion({ ...newLoc, latitudeDelta: 0.02, longitudeDelta: 0.02 });

      // Detect safety zone from our dataset
      const zone = detectCityZone(newLoc.latitude, newLoc.longitude);
      setCurrentZone(zone);
    })();
  }, []);

  // ── Routing handler ────────────────────────────────────────────────────────
  const handleRouting = async (type) => {
    // Police & Hospital → open native Maps app (reliable panic routing)
    if (type === 'hospital' || type === 'police') {
      const query = type === 'hospital' ? 'Hospital' : 'Police Station';
      const url = Platform.select({
        ios: `maps:0,0?q=${query}`,
        android: `geo:0,0?q=${query}`,
      });
      Linking.openURL(url).catch(() =>
        Alert.alert('Error', 'Could not open Maps app'),
      );
      return;
    }

    // Metro & Auto → real Google Places Nearby Search
    setLoadingType(type);
    setActiveRouteType(type);
    setDestination(null);

    try {
      let place;
      if (type === 'metro') {
        // Try "subway_station" type; fallback keyword search
        try {
          place = await fetchNearestPlace(
            currentLocation.latitude,
            currentLocation.longitude,
            'subway_station',
          );
        } catch (_e) {
          place = await fetchNearestPlace(
            currentLocation.latitude,
            currentLocation.longitude,
            'transit_station',
            'metro',
          );
        }
      } else if (type === 'auto') {
        // Auto stands don't have a Places type → keyword search
        place = await fetchNearestPlace(
          currentLocation.latitude,
          currentLocation.longitude,
          'taxi_stand',
          'auto rickshaw',
        );
      }

      setDestination(place);

      // Animate map to show both user + destination
      mapRef.current?.fitToCoordinates(
        [currentLocation, { latitude: place.latitude, longitude: place.longitude }],
        { edgePadding: { top: 120, right: 60, bottom: 200, left: 60 }, animated: true },
      );
    } catch (err) {
      Alert.alert(
        'Not Found',
        `Could not find a nearby ${type === 'metro' ? 'metro station' : 'auto stand'}. Make sure your Google Places API key is valid.`,
      );
      setActiveRouteType(null);
    } finally {
      setLoadingType(null);
    }
  };

  const clearRoute = () => {
    setDestination(null);
    setActiveRouteType(null);
  };

  // ── Render helpers ─────────────────────────────────────────────────────────
  const renderRouteButton = (title, type, Icon, color) => {
    const isActive = activeRouteType === type;
    const isLoading = loadingType === type;
    return (
      <TouchableOpacity
        key={type}
        onPress={() => handleRouting(type)}
        disabled={!!loadingType}
        style={[
          styles.routeBtn,
          isActive ? styles.routeBtnActive : styles.routeBtnIdle,
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={isActive ? '#fff' : color} size={18} />
        ) : (
          <Icon color={isActive ? '#fff' : color} size={20} />
        )}
        <Text style={[styles.routeBtnText, isActive && styles.routeBtnTextActive]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const zoneStyle = currentZone ? ZONE_COLORS[currentZone.zone] : null;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        provider={Platform.OS === 'android' ? undefined : PROVIDER_GOOGLE}
        showsUserLocation
      >
        {/* ── Safety Zone Circle Overlay ─────────────────────────── */}
        {currentZone && zoneStyle && (
          <Circle
            center={{ latitude: currentZone.lat, longitude: currentZone.lng }}
            radius={12000} // 12 km radius representing the city zone
            fillColor={zoneStyle.fill}
            strokeColor={zoneStyle.stroke}
            strokeWidth={2}
          />
        )}

        {/* ── User Location Marker ───────────────────────────────── */}
        <Marker
          coordinate={currentLocation}
          title="You are here"
          pinColor="#ef4444"
        />

        {/* ── Destination Marker + Route Line ───────────────────── */}
        {destination && (
          <>
            <Marker
              coordinate={{ latitude: destination.latitude, longitude: destination.longitude }}
              title={destination.title}
              description={destination.vicinity}
              pinColor="#3b82f6"
            />
            <Polyline
              coordinates={[
                currentLocation,
                { latitude: destination.latitude, longitude: destination.longitude },
              ]}
              strokeColor="#6366f1"
              strokeWidth={4}
              geodesic
              lineDashPattern={[6, 10]}
            />
          </>
        )}
      </MapView>

      {/* ── Top Search + Zone Badge ──────────────────────────────── */}
      <SafeAreaView style={styles.topOverlay} pointerEvents="box-none">
        {/* Search bar */}
        <View style={styles.searchBar}>
          <Search color="#94a3b8" size={22} />
          <TextInput
            placeholder="Search Safe Destination..."
            style={styles.searchInput}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Zone badge */}
        {zoneStyle && currentZone && (
          <View style={[styles.zoneBadge, { borderColor: zoneStyle.badge }]}>
            <Shield color={zoneStyle.badge} size={16} />
            <Text style={[styles.zoneBadgeText, { color: zoneStyle.badge }]}>
              {currentZone.city} · {zoneStyle.text.split('–')[1]?.trim() ?? currentZone.zone}
            </Text>
            <Text style={styles.zoneScore}>Score {currentZone.score}</Text>
          </View>
        )}

        {/* Active route panel */}
        {destination && (
          <View style={styles.routePanel}>
            <View style={styles.routePanelHeader}>
              <Text style={styles.routePanelLabel}>NEAREST LOCATION</Text>
              <TouchableOpacity onPress={clearRoute} style={styles.closeBtn}>
                <X color="#64748b" size={16} />
              </TouchableOpacity>
            </View>
            <Text style={styles.routePanelTitle}>{destination.title}</Text>
            {destination.vicinity ? (
              <Text style={styles.routePanelSub}>{destination.vicinity}</Text>
            ) : null}
            <Text style={styles.routePanelEta}>Real-time tracking active</Text>
          </View>
        )}
      </SafeAreaView>

      {/* ── Bottom Quick Routing Actions ─────────────────────────── */}
      <View style={styles.bottomBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bottomScroll}
        >
          {renderRouteButton('Police', 'police', ShieldAlert, '#ef4444')}
          {renderRouteButton('Safe Exit', 'hospital', ShieldAlert, '#10b981')}
          {renderRouteButton('Nearest Metro', 'metro', Train, '#3b82f6')}
          {renderRouteButton('Auto Stand', 'auto', Car, '#f59e0b')}


        </ScrollView>
      </View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { width: '100%', height: '100%' },

  // ── Top overlay
  topOverlay: {
    position: 'absolute',
    top: 0,
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Search bar
  searchBar: {
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#1e293b',
  },

  // Zone badge
  zoneBadge: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    gap: 6,
  },
  zoneBadgeText: {
    fontWeight: '700',
    fontSize: 13,
    flex: 1,
  },
  zoneScore: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },

  // Route detail panel
  routePanel: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#ede9fe',
  },
  routePanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  routePanelLabel: {
    color: '#6366f1',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  closeBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 99,
    padding: 4,
  },
  routePanelTitle: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
  },
  routePanelSub: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  routePanelEta: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },

  // Bottom route buttons
  bottomBar: {
    position: 'absolute',
    bottom: 32,
    width: '100%',
  },
  bottomScroll: {
    paddingHorizontal: 16,
    gap: 10,
  },
  routeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    gap: 8,
  },
  routeBtnIdle: {
    backgroundColor: '#fff',
    borderColor: '#e2e8f0',
  },
  routeBtnActive: {
    backgroundColor: '#1e293b',
    borderColor: '#1e293b',
  },
  routeBtnText: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1e293b',
  },
  routeBtnTextActive: {
    color: '#fff',
  },
});
