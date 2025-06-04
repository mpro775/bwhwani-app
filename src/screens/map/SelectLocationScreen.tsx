import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import MapView, { Marker, MapPressEvent, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { RootStackParamList } from "../../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const COLORS = {
  primary: "#D84315",
  primaryLight: "#FFAB91",
  primaryDark: "#BF360C",
  accent: "#FF5722",
  gray: "#666",
  lightGray: "#e0e0e0",
  white: "#fff",
  background: "#f8f9fa",
  text: "#212121",
  error: "#f44336",
  success: "#4CAF50",
};

const mapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#f5f5f5"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#bdbdbd"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#757575"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#dadada"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#616161"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e5e5e5"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c9c9c9"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#9e9e9e"
      }
    ]
  }
];

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SelectLocationScreen = () => {
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const navigation = useNavigation<Nav>();



  useEffect(() => {
    handleCurrentLocation();
  }, []);

  const handleMapPress = (e: MapPressEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ lat: latitude, lng: longitude });
    reverseGeocode(latitude, longitude);
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const address = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (address.length > 0) {
        const firstAddress = address[0];
        const addressStr = `${firstAddress.street || ''} ${firstAddress.name || ''}, ${firstAddress.city || ''}`;
        setLocation(prev => ({ ...prev!, address: addressStr }));
      }
    } catch (error) {
      console.warn("Failed to reverse geocode:", error);
    }
  };

const handleCurrentLocation = async () => {
  setLoading(true);

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("الإذن مرفوض", "يجب السماح بالوصول إلى الموقع.");
      return;
    }

    const servicesEnabled = await Location.hasServicesEnabledAsync();
    if (!servicesEnabled) {
      Alert.alert("خدمات الموقع متوقفة", "يرجى تفعيل خدمات الموقع من إعدادات الجهاز.");
      return;
    }

    // تأخير بسيط لضمان تهيئة GPS
await new Promise<void>((resolve) => setTimeout(resolve, 1000));

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
   
    });

    setLocation({
      lat: loc.coords.latitude,
      lng: loc.coords.longitude,
    });

    reverseGeocode(loc.coords.latitude, loc.coords.longitude);
  } catch (error: any) {
    console.error("❌ GPS Error:", error);

    if (error.message?.includes("Current location is unavailable")) {
      Alert.alert(
        "تعذر تحديد الموقع",
        "لم يتمكن الجهاز من تحديد موقعك الحالي. حاول الانتقال إلى مكان مفتوح أو تأكد من تشغيل GPS."
      );
    } else {
      Alert.alert("خطأ", "حدث خطأ أثناء محاولة تحديد الموقع.");
    }
  } finally {
    setLoading(false);
  }
};



const handleConfirm = async () => {
  if (location) {
    setSaving(true);
    try {
      const mode = await AsyncStorage.getItem("map_mode");

      // دعم كلا النظامين
      await AsyncStorage.multiSet([
        [`waslni_${mode}_location`, JSON.stringify(location)],
        ["temp_location", JSON.stringify(location)]
      ]);

      setTimeout(() => {
        setSaving(false);
        navigation.goBack();
      }, 300);
    } catch (error) {
      Alert.alert("خطأ", "تعذر حفظ الموقع. يرجى المحاولة مرة أخرى.");
      setSaving(false);
    }
  }
};

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsPointsOfInterest={false}
        showsBuildings={true}
        customMapStyle={mapStyle}
        onMapReady={() => setMapReady(true)}
        region={
          location
            ? {
                latitude: location.lat,
                longitude: location.lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
            : {
                latitude: 15.3694,
                longitude: 44.191,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              }
        }
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.lat,
              longitude: location.lng,
            }}
            tracksViewChanges={!mapReady}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Ionicons name="location-sharp" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.markerPointer} />
            </View>
          </Marker>
        )}
      </MapView>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تحديد الموقع</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.locationInfo}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <Text style={styles.locationText} numberOfLines={2}>
            {location?.address || 
             (location ? `إحداثيات الموقع: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 
             "اضغط على الخريطة لاختيار الموقع أو استخدم موقعك الحالي")}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.button, styles.locationButton]}
            onPress={handleCurrentLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="locate" size={18} color={COLORS.white} />
                <Text style={styles.buttonText}>موقعي الحالي</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.confirmButton,
              !location && styles.buttonDisabled,
            ]}
            onPress={handleConfirm}
            disabled={!location || saving}
          >
            {saving ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Ionicons name="checkmark" size={18} color={COLORS.white} />
                <Text style={styles.buttonText}>تأكيد الموقع</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SelectLocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontFamily: "Cairo-SemiBold",
    fontSize: 18,
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 10,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
  },
  locationText: {
    fontFamily: "Cairo-Regular",
    textAlign: 'right',
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    minWidth: width * 0.4,
  },
  locationButton: {
    backgroundColor: COLORS.gray,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: "Cairo-SemiBold",
    fontSize: 14,
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    backgroundColor: COLORS.white,
    padding: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  markerPointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.primary,
    transform: [{ rotate: '180deg' }],
    marginTop: -2,
  },
});