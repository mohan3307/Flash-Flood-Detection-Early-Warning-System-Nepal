
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { ZoneState } from '../../types';
import {
  MapPin,
  Layers,
  Shield,
  Radio,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Info,
  Waves,
  Mountain,
  Compass,
  Key,
  CheckCircle2,
  X,
} from 'lucide-react';
import { GoogleMapsApiKeyModal } from './GoogleMapsApiKeyModal';

interface FloodRiskMapProps {
  zones: ZoneState[];
  selectedZoneCode?: string;
  onSelectZone?: (zoneCode: string) => void;
  scenario?: string;
}

export type BasemapType =
  | 'google_hybrid'
  | 'google_satellite'
  | 'google_terrain'
  | 'google_roadmap'
  | 'tactical'
  | 'satellite'
  | 'topo'
  | 'osm';

interface EvacuationShelter {
  id: string;
  name: string;
  type: 'shelter' | 'bridge' | 'command';
  lat: number;
  lng: number;
  elevation_m: number;
  safe_clearance_m: number;
  capacity?: number;
  description: string;
  contact: string;
}

// Critical infrastructure & safe highlands evacuation sites in Melamchi Basin
const CRITICAL_INFRASTRUCTURE: EvacuationShelter[] = [
  {
    id: 'shelter-melamchi-hs',
    name: 'Melamchi Higher Sec. School (High Ground)',
    type: 'shelter',
    lat: 27.8385,
    lng: 85.5862,
    elevation_m: 935,
    safe_clearance_m: 65,
    capacity: 450,
    description: 'Designated High-Ground Assembly Zone. Equipped with emergency water filtration and trauma medical kit.',
    contact: 'Ward 11 Evac Officer: +977-1-692-011',
  },
  {
    id: 'shelter-bahunepati-helipad',
    name: 'Bahunepati Emergency Helipad & Health Post',
    type: 'shelter',
    lat: 27.7690,
    lng: 85.5995,
    elevation_m: 785,
    safe_clearance_m: 65,
    capacity: 320,
    description: 'Elevated terrace safe from debris surge. Nepal Army medical casualty clearing point.',
    contact: 'Bahunepati Health Desk: +977-1-692-024',
  },
  {
    id: 'deoc-chautara-outpost',
    name: 'Sindhupalchok DEOC Forward Outpost',
    type: 'command',
    lat: 27.7780,
    lng: 85.6420,
    elevation_m: 1120,
    safe_clearance_m: 400,
    capacity: 80,
    description: 'District Emergency Operations Center radio repeater and incident command dispatch.',
    contact: 'DEOC Hotline: 1155 / +977-1-692-100',
  },
  {
    id: 'bridge-melamchi-bailey',
    name: 'Melamchi Pul (Bailey Bridge Crossing)',
    type: 'bridge',
    lat: 27.8330,
    lng: 85.5822,
    elevation_m: 870,
    safe_clearance_m: 0,
    description: 'Critical vehicular link. Historically submerged in 2021 debris flood. Automated barrier closes at 3.5m stage.',
    contact: 'Traffic Control: +977-1-692-005',
  },
  {
    id: 'bridge-bahunepati-suspension',
    name: 'Bahunepati Pedestrian Suspension Bridge',
    type: 'bridge',
    lat: 27.7658,
    lng: 85.5945,
    elevation_m: 722,
    safe_clearance_m: 2,
    description: 'Emergency foot crossing for upstream evacuation to eastern ridge.',
    contact: 'Local Disaster Mgmt Comm.',
  },
];

// Inundation hazard corridors along the Melamchi-Indrawati river channel
const HAZARD_CORRIDORS: { [zoneCode: string]: [number, number][] } = {
  // Upper Melamchi Gorge debris chute
  'ZONE-A': [
    [27.9920, 85.5680],
    [27.9780, 85.5850],
    [27.9550, 85.5830],
    [27.9400, 85.5740],
    [27.9550, 85.5680],
    [27.9850, 85.5620],
  ],
  // Melamchi Pul Bazaar flood plain & market sandbanks
  'ZONE-B': [
    [27.8480, 85.5720],
    [27.8450, 85.5900],
    [27.8280, 85.5920],
    [27.8200, 85.5780],
    [27.8290, 85.5690],
    [27.8410, 85.5700],
  ],
  // Bahunepati lowlands & agricultural terraces
  'ZONE-C': [
    [27.7850, 85.5850],
    [27.7800, 85.6050],
    [27.7550, 85.6060],
    [27.7500, 85.5880],
    [27.7650, 85.5820],
  ],
  // Indrawati River Confluence delta buffer
  'ZONE-D': [
    [27.7280, 85.5920],
    [27.7250, 85.6150],
    [27.6980, 85.6180],
    [27.6960, 85.5940],
    [27.7120, 85.5880],
  ],
};

interface SettlementPoint {
  id: string;
  name: string;
  type: 'city' | 'village' | 'town';
  lat: number;
  lng: number;
  population?: string;
  district: string;
  elevation_m: number;
}

// Villages and Cities marked by Dark Green Circles
const VILLAGES_AND_CITIES: SettlementPoint[] = [
  {
    id: 'city-chautara',
    name: 'Chautara Municipal City',
    type: 'city',
    lat: 27.7720,
    lng: 85.7100,
    population: '51,000+',
    district: 'Sindhupalchok HQ',
    elevation_m: 1450,
  },
  {
    id: 'town-melamchi',
    name: 'Melamchi Bazaar Town',
    type: 'town',
    lat: 27.8335,
    lng: 85.5830,
    population: '28,000+',
    district: 'Melamchi Municipality',
    elevation_m: 870,
  },
  {
    id: 'village-helambu',
    name: 'Helambu Himalayan Village',
    type: 'village',
    lat: 27.9750,
    lng: 85.5800,
    population: '7,200',
    district: 'Helambu Rural Municipality',
    elevation_m: 2480,
  },
  {
    id: 'village-talamarang',
    name: 'Talamarang Riverside Village',
    type: 'village',
    lat: 27.8820,
    lng: 85.5780,
    population: '4,500',
    district: 'Melamchi Catchment',
    elevation_m: 1150,
  },
  {
    id: 'village-bahunepati',
    name: 'Bahunepati Plains Village',
    type: 'village',
    lat: 27.7680,
    lng: 85.5970,
    population: '6,100',
    district: 'Indrawati Basin',
    elevation_m: 720,
  },
  {
    id: 'village-tipeni',
    name: 'Tipeni Gorge Village',
    type: 'village',
    lat: 27.9150,
    lng: 85.5720,
    population: '2,800',
    district: 'Upper Valley Sector',
    elevation_m: 1620,
  },
  {
    id: 'village-indrawati',
    name: 'Indrawati Delta Settlement',
    type: 'village',
    lat: 27.7150,
    lng: 85.6050,
    population: '8,400',
    district: 'Confluence Sector',
    elevation_m: 640,
  },
];

// Dark Blue Flowing Water River Trajectory (Melamchi to Indrawati River bed)
const MELAMCHI_RIVER_COURSE: [number, number][] = [
  [28.0050, 85.5650], // Langtang Glacier Source
  [27.9880, 85.5720], // Helambu Headwaters Gorge
  [27.9620, 85.5810], // Upper Melamchi Gorge (Zone A)
  [27.9350, 85.5760], // Tipeni Gorge Passage
  [27.9010, 85.5740], // Sermathang Bridge Stream
  [27.8720, 85.5790], // Talamarang Valley Reach
  [27.8480, 85.5800], // Pul Bazaar Approach
  [27.8329, 85.5818], // Melamchi Pul Bazaar Bridge (Zone B)
  [27.8100, 85.5870], // Lower Floodplain Beds
  [27.7850, 85.5910], // Mahadevsthan Reach
  [27.7654, 85.5942], // Bahunepati Plains (Zone C)
  [27.7400, 85.5980], // Lower Terraces
  [27.7121, 85.6025], // Indrawati River Confluence (Zone D)
  [27.6850, 85.6180], // Downstream Sunkoshi Trunk River
];

export const FloodRiskMap: React.FC<FloodRiskMapProps> = ({
  zones,
  selectedZoneCode,
  onSelectZone,
  scenario = 'normal',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer references for dynamic toggles
  const markersRef = useRef<{ [key: string]: L.CircleMarker }>({});
  const hazardPolygonsRef = useRef<{ [key: string]: L.Polygon }>({});
  const infrastructureLayerRef = useRef<L.LayerGroup | null>(null);
  const villagesLayerRef = useRef<L.LayerGroup | null>(null);
  const riverLayerRef = useRef<L.LayerGroup | null>(null);
  const radarLayerRef = useRef<L.LayerGroup | null>(null);

  // Google Maps API Key State
  const [googleApiKey, setGoogleApiKey] = useState<string>(() => {
    return (
      localStorage.getItem('sensora_google_maps_api_key') ||
      (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) ||
      ''
    );
  });
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  // UI state toggles: Default to satellite (Esri World Imagery) for immediate high-resolution Himalayan satellite view
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('satellite');
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showVillages, setShowVillages] = useState<boolean>(true);
  const [showRiverFlow, setShowRiverFlow] = useState<boolean>(true);
  const [showInundation, setShowInundation] = useState<boolean>(true);
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Basemap Tile Configurations (High-availability GIS providers)
  const getBasemapConfig = (type: BasemapType, key: string) => {
    switch (type) {
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          subdomains: 'abc',
          maxZoom: 18,
          attr: 'Esri World Imagery (Satellite)',
          isGoogle: false,
        };
      case 'tactical':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          subdomains: 'abc',
          maxZoom: 16,
          attr: 'Esri Tactical Dark Canvas',
          isGoogle: false,
        };
      case 'topo':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          subdomains: 'abc',
          maxZoom: 17,
          attr: 'OpenTopoMap (Himalayan Topo)',
          isGoogle: false,
        };
      case 'osm':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          subdomains: 'abc',
          maxZoom: 19,
          attr: 'OpenStreetMap (Valley Roadways)',
          isGoogle: false,
        };
      case 'google_hybrid':
      case 'google_satellite':
      case 'google_terrain':
      case 'google_roadmap':
        if (!key) {
          return {
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            subdomains: 'abc',
            maxZoom: 18,
            attr: 'Esri World Imagery (Satellite)',
            isGoogle: false,
          };
        }
        return {
          url: `https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&key=${key}`,
          subdomains: '0123',
          maxZoom: 20,
          attr: 'Google Maps Platform (Hybrid)',
          isGoogle: true,
        };
      default:
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          subdomains: 'abc',
          maxZoom: 18,
          attr: 'Esri World Imagery (Satellite)',
          isGoogle: false,
        };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center over Melamchi/Indrawati Basin, Sindhupalchok, Nepal
    const map = L.map(mapContainerRef.current, {
      center: [27.84, 85.58],
      zoom: 11,
      minZoom: 9,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    // Add zoom control in top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Initial tile layer
    const initialConfig = getBasemapConfig(activeBasemap, googleApiKey);
    const tileLayer = L.tileLayer(initialConfig.url, {
      maxZoom: initialConfig.maxZoom,
      subdomains: initialConfig.subdomains || 'abc',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Layer groups for toggling
    const infraGroup = L.layerGroup().addTo(map);
    infrastructureLayerRef.current = infraGroup;

    const villagesGroup = L.layerGroup().addTo(map);
    villagesLayerRef.current = villagesGroup;

    const riverGroup = L.layerGroup().addTo(map);
    riverLayerRef.current = riverGroup;

    const radarGroup = L.layerGroup().addTo(map);
    radarLayerRef.current = radarGroup;

    // Create Inundation Hazard Polygons
    Object.entries(HAZARD_CORRIDORS).forEach(([code, polygonCoords]) => {
      const poly = L.polygon(polygonCoords, {
        color: '#4cd7f6',
        fillColor: '#003640',
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: '4, 4',
      }).addTo(map);

      poly.bindTooltip(
        `<div style="font-family: 'JetBrains Mono', monospace; font-size: 10px;">
          <strong>${code} INUNDATION CORRIDOR</strong><br/>
          Riparian Flood Fringe & Alluvial Fan
        </div>`,
        { sticky: true }
      );

      hazardPolygonsRef.current[code] = poly;
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Basemap Switch or API Key Update
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const config = getBasemapConfig(activeBasemap, googleApiKey);

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      subdomains: config.subdomains || 'abc',
    }).addTo(map);

    tileLayerRef.current = newTileLayer;
  }, [activeBasemap, googleApiKey]);

  // Handle Inundation Layer Toggle
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    Object.values(hazardPolygonsRef.current).forEach((poly) => {
      if (showInundation) {
        if (!map.hasLayer(poly)) poly.addTo(map);
      } else {
        if (map.hasLayer(poly)) map.removeLayer(poly);
      }
    });
  }, [showInundation]);

  // Handle Shelters & Infrastructure Layer
  useEffect(() => {
    if (!infrastructureLayerRef.current) return;
    const group = infrastructureLayerRef.current;
    group.clearLayers();

    if (!showShelters) return;

    CRITICAL_INFRASTRUCTURE.forEach((item) => {
      const isShelter = item.type === 'shelter';
      const isBridge = item.type === 'bridge';

      const color = isShelter ? '#10b981' : isBridge ? '#f59e0b' : '#a855f7';
      const iconChar = isShelter ? '▲' : isBridge ? '☲' : '★';

      const customIcon = L.divIcon({
        className: 'custom-infra-icon',
        html: `
          <div style="
            background: ${color}25;
            border: 1.5px solid ${color};
            color: ${color};
            width: 24px;
            height: 24px;
            border-radius: ${isShelter ? '6px' : isBridge ? '4px' : '50%'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 0 10px ${color}40;
            cursor: pointer;
          ">
            ${iconChar}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.4; color: #dae2fd; min-width: 240px;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: ${color}; font-size: 12px; font-family: 'Space Grotesk', sans-serif;">
              ${item.name}
            </strong>
          </div>
          <div style="display: flex; gap: 8px; font-size: 10px; color: #869397; margin-bottom: 6px;">
            <span>Elev: <strong style="color: #ffffff;">${item.elevation_m}m</strong></span>
            <span>Clearance: <strong style="color: #10b981;">+${item.safe_clearance_m}m</strong></span>
            ${item.capacity ? `<span>Cap: <strong style="color: #4cd7f6;">${item.capacity}</strong></span>` : ''}
          </div>
          <div style="font-size: 10px; color: #c3c7cb; margin-bottom: 6px; background: #0b1326; padding: 6px; border-radius: 4px; border: 1px solid #222a3d;">
            ${item.description}
          </div>
          <div style="font-size: 9px; color: #869397;">
            ${item.contact}
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      group.addLayer(marker);
    });
  }, [showShelters]);

  // Handle Villages & Cities Layer (Dark Green Circle Markers)
  useEffect(() => {
    if (!villagesLayerRef.current) return;
    const group = villagesLayerRef.current;
    group.clearLayers();

    if (!showVillages) return;

    VILLAGES_AND_CITIES.forEach((v) => {
      const isCity = v.type === 'city';
      const isTown = v.type === 'town';
      const radius = isCity ? 10 : isTown ? 8 : 7;

      // Dark Green Circle Marker
      const circleMarker = L.circleMarker([v.lat, v.lng], {
        radius: radius,
        color: '#064e3b', // Dark Green Stroke
        fillColor: '#047857', // Dark Green Fill
        fillOpacity: 0.95,
        weight: 2.5,
      });

      // Dark Green Custom Label Icon
      const customDivIcon = L.divIcon({
        className: 'leaflet-village-icon',
        html: `
          <div style="
            display: flex;
            align-items: center;
            gap: 5px;
            cursor: pointer;
            white-space: nowrap;
          ">
            <div style="
              width: ${radius * 2}px;
              height: ${radius * 2}px;
              border-radius: 50%;
              background: #047857;
              border: 2px solid #10b981;
              box-shadow: 0 0 10px rgba(4, 120, 87, 0.8);
            "></div>
            <span style="
              background: rgba(4, 40, 25, 0.92);
              color: #a7f3d0;
              border: 1.5px solid #059669;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 10px;
              font-family: 'Space Grotesk', sans-serif;
              font-weight: 700;
              box-shadow: 0 2px 8px rgba(0,0,0,0.6);
            ">
              ${isCity ? '🏛️' : isTown ? '🏘️' : '🏡'} ${v.name}
            </span>
          </div>
        `,
        iconSize: [120, 20],
        iconAnchor: [radius, radius],
      });

      const labelMarker = L.marker([v.lat, v.lng], { icon: customDivIcon });

      const popupHtml = `
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #dae2fd; min-width: 220px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px; border-bottom: 1px solid #059669; padding-bottom: 4px;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #047857; border: 1.5px solid #10b981;"></span>
            <strong style="color: #a7f3d0; font-size: 12px; font-family: 'Space Grotesk', sans-serif;">${v.name}</strong>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px;">
            Settlement Type: <strong style="color: #ffffff; text-transform: uppercase;">${v.type}</strong>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px;">
            Jurisdiction: <strong style="color: #dae2fd;">${v.district}</strong>
          </div>
          <div style="font-size: 10px; color: #94a3b8; margin-bottom: 4px;">
            Elevation: <strong style="color: #4cd7f6;">${v.elevation_m}m MSL</strong>
          </div>
          ${v.population ? `<div style="font-size: 10px; color: #94a3b8;">Population: <strong style="color: #ffb95f;">${v.population}</strong></div>` : ''}
        </div>
      `;

      labelMarker.bindPopup(popupHtml);
      circleMarker.bindPopup(popupHtml);

      group.addLayer(circleMarker);
      group.addLayer(labelMarker);
    });
  }, [showVillages]);

  // Handle Dark Blue Flowing Water River Layer
  useEffect(() => {
    if (!riverLayerRef.current) return;
    const group = riverLayerRef.current;
    group.clearLayers();

    if (!showRiverFlow) return;

    // 1. Dark Blue River Channel Casing
    const riverCasing = L.polyline(MELAMCHI_RIVER_COURSE, {
      color: '#0f172a',
      weight: 8,
      opacity: 0.85,
    });
    group.addLayer(riverCasing);

    // 2. Main Dark Blue Water Channel Line
    const riverMain = L.polyline(MELAMCHI_RIVER_COURSE, {
      color: '#1d4ed8', // Dark Blue
      weight: 5.5,
      opacity: 0.95,
    });
    group.addLayer(riverMain);

    // 3. Dark Blue Flowing Water Animation Overlay Line
    const riverFlowLine = L.polyline(MELAMCHI_RIVER_COURSE, {
      color: '#38bdf8', // Water flow highlight dash
      weight: 2.5,
      opacity: 0.9,
      className: 'leaflet-flowing-river',
    });
    group.addLayer(riverFlowLine);

    riverMain.bindTooltip(
      `<div style="font-family: 'Space Grotesk', sans-serif; font-size: 11px;">
        <strong style="color: #38bdf8;">🌊 MELAMCHI-INDRAWATI RIVER CHANNEL</strong><br/>
        <span style="font-size: 10px; color: #94a3b8;">Flowing Water (Dark Blue Stream: 2,480m → 640m MSL)</span>
      </div>`,
      { sticky: true }
    );
  }, [showRiverFlow]);

  // Update Radar Layer based on Scenario and Rainfall
  useEffect(() => {
    if (!radarLayerRef.current) return;
    const radarGroup = radarLayerRef.current;
    radarGroup.clearLayers();

    if (!showRadar) return;

    // Determine radar storm intensity based on scenario / upper gorge rain
    const upperGorge = zones.find((z) => z.zone_code === 'ZONE-A');
    const rain = upperGorge ? upperGorge.rainfall_intensity : 10;
    const isCloudburst = scenario === 'flash_flood' || rain > 70;
    const isHeavy = scenario === 'heavy_rain' || (rain > 30 && !isCloudburst);

    // Center of storm cell over Langtang/Helambu Himalayan ridge
    const stormCenter: [number, number] = [27.9750, 85.5750];

    // Multi-ring Doppler reflectivity gradient
    const ringRadii = isCloudburst ? [1800, 3200, 5200, 7500] : isHeavy ? [1200, 2400, 4000] : [1000, 2000];
    const ringColors = isCloudburst
      ? ['#a855f7', '#ef4444', '#f97316', '#eab308'] // Extreme Cloudburst (55-65 dBZ)
      : isHeavy
      ? ['#ef4444', '#f97316', '#3b82f6'] // Heavy Rain (40-50 dBZ)
      : ['#06b6d4', '#10b981']; // Light Convective (25-35 dBZ)

    ringRadii.forEach((radius, idx) => {
      const color = ringColors[idx] || '#06b6d4';
      const circle = L.circle(stormCenter, {
        radius: radius,
        color: color,
        fillColor: color,
        fillOpacity: isCloudburst ? 0.28 - idx * 0.05 : 0.18 - idx * 0.04,
        weight: 1.5,
        dashArray: isCloudburst ? '3, 6' : undefined,
      });

      circle.bindTooltip(
        `<div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; line-height: 1.3;">
          <strong style="color: #4cd7f6;">DOPPLER RADAR REFLECTIVITY</strong><br/>
          ${isCloudburst ? '<span style="color: #ef4444; font-weight: bold;">55-65 dBZ (Cloudburst Core)</span>' : isHeavy ? '<span style="color: #ffb95f; font-weight: bold;">40-50 dBZ (Heavy Rain)</span>' : '<span style="color: #10b981;">25-35 dBZ (Scattered)</span>'}
        </div>`,
        { sticky: false, direction: 'top' }
      );

      radarGroup.addLayer(circle);
    });

    // Outer radar sweep circle marker
    const pulseMarker = L.circleMarker(stormCenter, {
      radius: 8,
      color: isCloudburst ? '#ef4444' : '#06b6d4',
      fillColor: isCloudburst ? '#ef4444' : '#06b6d4',
      fillOpacity: 0.9,
      weight: 2,
    });
    radarGroup.addLayer(pulseMarker);
  }, [showRadar, scenario, zones]);

  // Update Zone Stations & Inundation Polygon Styling when Telemetry Changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    zones.forEach((zone) => {
      const isHigh = zone.risk_level === 'HIGH';
      const isMedium = zone.risk_level === 'MEDIUM';

      const color = isHigh ? '#ef4444' : isMedium ? '#ffb95f' : '#10b981';
      const fillColor = isHigh ? '#93000a' : isMedium ? '#e79400' : '#003640';

      // Update Hazard Polygon style for this zone
      if (hazardPolygonsRef.current[zone.zone_code]) {
        const poly = hazardPolygonsRef.current[zone.zone_code];
        poly.setStyle({
          color: color,
          fillColor: fillColor,
          fillOpacity: isHigh ? 0.45 : isMedium ? 0.28 : 0.14,
          weight: isHigh ? 3 : isMedium ? 2 : 1.5,
          dashArray: isHigh ? '3, 4' : '4, 4',
        });
      }

      const popupContent = `
        <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; line-height: 1.4; color: #dae2fd; min-width: 250px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; border-bottom: 1px solid #334155; padding-bottom: 4px;">
            <strong style="color: #ffffff; font-size: 12px; font-family: 'Space Grotesk', sans-serif;">${zone.name}</strong>
            <span style="font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${color}25; color: ${color}; border: 1px solid ${color};">
              ${zone.risk_level} (${zone.probability.toFixed(0)}%)
            </span>
          </div>
          <div style="font-size: 10px; color: #869397; margin-bottom: 8px;">
            ${zone.subtext} • Elevation: <strong style="color: #dae2fd;">${zone.elevation_m}m MSL</strong>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; background: #0b1326; padding: 6px; border-radius: 4px; margin-bottom: 8px; border: 1px solid #222a3d;">
            <div>Rain: <strong style="color: #4cd7f6;">${zone.rainfall_intensity.toFixed(1)} mm/h</strong></div>
            <div>Stage: <strong style="color: #ffb95f;">${zone.water_level.toFixed(2)} m</strong></div>
            <div>Surge: <strong style="color: ${zone.rate_of_rise > 0 ? '#ef4444' : '#10b981'};">${zone.rate_of_rise > 0 ? '+' : ''}${zone.rate_of_rise.toFixed(2)} m/h</strong></div>
            <div>Status: <strong style="color: ${zone.status === 'ONLINE' ? '#10b981' : '#f59e0b'};">${zone.status}</strong></div>
          </div>
          ${
            zone.is_false_alarm
              ? `<div style="font-size: 10px; color: #38bdf8; background: #082f49; padding: 5px 8px; border-radius: 4px; margin-bottom: 6px; border: 1px solid #0284c7;">
                  🛡️ Multi-Signal: Suppressed False Alarm (${zone.false_alarm_message || 'Stage stagnant'})
                </div>`
              : ''
          }
          <div style="font-size: 10px; color: #dae2fd; background: #171f33; padding: 6px; border-radius: 4px; border-left: 3px solid ${color}; margin-bottom: 8px;">
            <strong style="color: ${color};">SOP Directive:</strong> ${zone.recommended_action}
          </div>
          <button
            onclick="window.__selectZone && window.__selectZone('${zone.zone_code}')"
            style="width: 100%; background: #06b6d4; color: #000000; font-weight: bold; border: none; padding: 5px; border-radius: 4px; cursor: pointer; font-size: 10px; text-transform: uppercase; font-family: 'Space Grotesk', sans-serif;"
          >
            Target Telemetry HUD
          </button>
        </div>
      `;

      if (markersRef.current[zone.zone_code]) {
        const marker = markersRef.current[zone.zone_code];
        marker.setStyle({
          color: color,
          fillColor: fillColor,
          radius: isHigh ? 16 : isMedium ? 12 : 10,
          weight: isHigh ? 3.5 : 2,
        });
        marker.setPopupContent(popupContent);
      } else {
        const marker = L.circleMarker([zone.latitude, zone.longitude], {
          radius: isHigh ? 16 : isMedium ? 12 : 10,
          color: color,
          fillColor: fillColor,
          fillOpacity: 0.85,
          weight: isHigh ? 3.5 : 2,
        }).addTo(map);

        marker.bindPopup(popupContent);

        marker.on('click', () => {
          if (onSelectZone) onSelectZone(zone.zone_code);
        });

        markersRef.current[zone.zone_code] = marker;
      }
    });

    (window as unknown as { __selectZone?: (code: string) => void }).__selectZone = (code: string) => {
      if (onSelectZone) onSelectZone(code);
    };
  }, [zones, onSelectZone]);

  // Center on selectedZoneCode if it changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedZoneCode) return;
    const target = zones.find((z) => z.zone_code === selectedZoneCode);
    if (target) {
      mapInstanceRef.current.flyTo([target.latitude, target.longitude], 13, {
        duration: 1.2,
      });
      if (markersRef.current[target.zone_code]) {
        markersRef.current[target.zone_code].openPopup();
      }
    }
  }, [selectedZoneCode]);

  // Handle Fullscreen Escape key & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isExpanded]);

  // Multi-stage Invalidate map size and ResizeObserver when expanded / restored
  useEffect(() => {
    if (!mapContainerRef.current || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Trigger instant recalculation
    map.invalidateSize();

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });
    observer.observe(mapContainerRef.current);

    const t1 = setTimeout(() => map.invalidateSize(), 50);
    const t2 = setTimeout(() => map.invalidateSize(), 150);
    const t3 = setTimeout(() => map.invalidateSize(), 300);

    return () => {
      observer.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isExpanded]);

  // Navigation handlers
  const handleResetBasinView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([27.84, 85.58], 11, { duration: 1.0 });
  };

  const handleFocusHighRisk = () => {
    if (!mapInstanceRef.current) return;
    const highRiskZone =
      zones.find((z) => z.risk_level === 'HIGH') ||
      zones.slice().sort((a, b) => b.probability - a.probability)[0];

    if (highRiskZone) {
      if (onSelectZone) onSelectZone(highRiskZone.zone_code);
      mapInstanceRef.current.flyTo([highRiskZone.latitude, highRiskZone.longitude], 13, {
        duration: 1.2,
      });
      if (markersRef.current[highRiskZone.zone_code]) {
        markersRef.current[highRiskZone.zone_code].openPopup();
      }
    }
  };

  // Google API Key Persistence
  const handleSaveApiKey = (key: string) => {
    setGoogleApiKey(key);
    if (key) {
      localStorage.setItem('sensora_google_maps_api_key', key);
      setActiveBasemap('google_hybrid');
    } else {
      localStorage.removeItem('sensora_google_maps_api_key');
      setActiveBasemap('satellite');
    }
  };

  const currentConfig = getBasemapConfig(activeBasemap, googleApiKey);

  return (
    <div
      className={`rounded-xl transition-all duration-300 ${
        isExpanded
          ? 'fixed inset-0 z-[9999] bg-[#070e1b] p-3 sm:p-4 md:p-5 flex flex-col h-screen w-screen overflow-hidden backdrop-blur-2xl shadow-2xl'
          : 'relative bg-[#131b2e]/90 border border-[#222a3d] p-4 flex flex-col justify-between overflow-hidden reticle-box'
      }`}
    >
      {/* Top Controls Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 mb-2.5">
        {/* Title and Catchment Identifier */}
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#06b6d4]/10 text-[#4cd7f6] border border-[#06b6d4]/30 shadow-md shadow-cyan-500/10">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide font-['Space_Grotesk']">
                {isExpanded ? 'SENSORA // FULL TACTICAL GIS SURVEILLANCE MATRIX' : 'TACTICAL GIS CATCHMENT MAP'}
              </h3>
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#06b6d4]/10 text-[#4cd7f6] border border-[#06b6d4]/30 rounded">
                Sindhupalchok, Nepal
              </span>
              {isExpanded && (
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 rounded font-bold">
                  FULL SIZE VIEW
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#869397] font-mono">
              Melamchi-Indrawati Basin Corridor // 26km Catchment (2,480m MSL → 640m MSL)
            </p>
          </div>
        </div>

        {/* Action Controls & Layer Switcher */}
        <div className="flex flex-wrap items-center gap-2 font-mono">
          {/* Google Maps API Key Config Button */}
          <button
            onClick={() => setIsKeyModalOpen(true)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded flex items-center gap-1.5 transition-all cursor-pointer ${
              googleApiKey
                ? 'bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/40 hover:bg-[#10b981]/25'
                : 'bg-[#ffb95f]/15 text-[#ffb95f] border border-[#ffb95f]/40 hover:bg-[#ffb95f]/25 animate-pulse'
            }`}
            title="Configure Google Maps API Key"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="font-bold">
              {googleApiKey ? 'Google Maps [Active]' : 'Google Key'}
            </span>
            {googleApiKey && <CheckCircle2 className="w-3 h-3" />}
          </button>

          {/* Direct 1-Click GIS Basemap Switcher */}
          <div className="flex items-center bg-[#0b1326] p-0.5 rounded-lg border border-[#222a3d]">
            {[
              { id: 'satellite' as BasemapType, label: '🛰️ Satellite' },
              { id: 'tactical' as BasemapType, label: '🌑 Tactical Dark' },
              { id: 'topo' as BasemapType, label: '⛰️ Topo' },
              { id: 'osm' as BasemapType, label: '🗺️ Streets' },
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveBasemap(b.id)}
                className={`px-2.5 py-1 text-[10px] font-mono font-medium rounded transition-all cursor-pointer ${
                  activeBasemap === b.id
                    ? 'bg-[#06b6d4] text-[#000000] font-bold shadow-md'
                    : 'text-[#869397] hover:text-[#dae2fd]'
                }`}
                title={`Switch GIS layer to ${b.label}`}
              >
                {b.label}
              </button>
            ))}
          </div>

          {/* Overlays Toggles */}
          <div className="flex items-center gap-1 bg-[#0b1326] p-1 rounded-lg border border-[#222a3d]">
            <button
              onClick={() => setShowVillages(!showVillages)}
              className={`p-1.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                showVillages
                  ? 'bg-[#047857]/25 text-[#a7f3d0] border border-[#059669]'
                  : 'text-[#869397] hover:text-white'
              }`}
              title="Toggle Villages & Cities Marking Points (Dark Green Circles)"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#047857] border border-[#10b981]" />
              <span className="hidden sm:inline">Villages & Cities</span>
            </button>

            <button
              onClick={() => setShowRiverFlow(!showRiverFlow)}
              className={`p-1.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                showRiverFlow
                  ? 'bg-[#1d4ed8]/25 text-[#60a5fa] border border-[#2563eb]'
                  : 'text-[#869397] hover:text-white'
              }`}
              title="Toggle Dark Blue Flowing Water River Line"
            >
              <span className="w-3 h-1 bg-[#1d4ed8] rounded" />
              <span className="hidden sm:inline">Dark Blue River</span>
            </button>

            <button
              onClick={() => setShowInundation(!showInundation)}
              className={`p-1.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                showInundation
                  ? 'bg-[#06b6d4]/20 text-[#4cd7f6] border border-[#06b6d4]/40'
                  : 'text-[#869397] hover:text-white'
              }`}
              title="Toggle Flood Inundation Hazard Corridor"
            >
              <Waves className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Corridor</span>
            </button>

            <button
              onClick={() => setShowShelters(!showShelters)}
              className={`p-1.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                showShelters
                  ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40'
                  : 'text-[#869397] hover:text-white'
              }`}
              title="Toggle Highlands Evacuation Shelters & Infrastructure"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shelters</span>
            </button>

            <button
              onClick={() => setShowRadar(!showRadar)}
              className={`p-1.5 rounded text-[10px] font-mono flex items-center gap-1 transition-all cursor-pointer ${
                showRadar
                  ? 'bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/40'
                  : 'text-[#869397] hover:text-white'
              }`}
              title="Toggle Doppler Precipitation Radar"
            >
              <Radio className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Radar</span>
            </button>
          </div>

          {/* Quick Navigation & Full Size Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFocusHighRisk}
              className="px-2.5 py-1 text-[11px] font-mono rounded bg-[#ef4444]/20 text-[#ffb4ab] border border-[#ef4444]/40 hover:bg-[#ef4444]/30 flex items-center gap-1 transition-all cursor-pointer"
              title="Fly directly to highest risk sector"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444]" />
              <span className="font-bold">Focus Alert</span>
            </button>

            <button
              onClick={handleResetBasinView}
              className="p-1.5 rounded bg-[#0b1326] text-[#869397] hover:text-[#4cd7f6] border border-[#222a3d] cursor-pointer"
              title="Reset view to whole basin"
            >
              <Compass className="w-4 h-4" />
            </button>

            {/* FULL SIZE / MINIMIZE BUTTON */}
            {isExpanded ? (
              <button
                onClick={() => setIsExpanded(false)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold rounded-lg bg-[#ef4444]/20 hover:bg-[#ef4444]/35 text-[#ffb4ab] border border-[#ef4444]/60 shadow-lg shadow-red-950/40 cursor-pointer transition-all hover:scale-105 active:scale-95"
                title="Exit full size mode (or press ESC)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                <span>EXIT FULL SIZE (ESC)</span>
              </button>
            ) : (
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold rounded-lg bg-[#06b6d4]/15 hover:bg-[#06b6d4]/30 text-[#4cd7f6] border border-[#06b6d4]/50 shadow-md shadow-cyan-500/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
                title="Expand map to full size"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>FULL SIZE</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className={`relative w-full overflow-hidden rounded-xl border border-[#222a3d] shadow-inner ${isExpanded ? 'flex-1 min-h-[450px] my-1.5' : 'h-96'}`}>
        <div
          ref={mapContainerRef}
          className="w-full h-full absolute inset-0 z-0 bg-[#070e1b]"
        />

        {/* Google Maps API Key Missing Prompt Overlay */}
        {!googleApiKey && activeBasemap.startsWith('google') && (
          <div
            onClick={() => setIsKeyModalOpen(true)}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] cursor-pointer bg-[#0b1326]/95 hover:bg-[#131b2e] border border-[#ffb95f]/60 text-[#ffb95f] px-3.5 py-1.5 rounded-lg shadow-lg backdrop-blur-md flex items-center gap-2 transition-all"
          >
            <Key className="w-4 h-4 text-[#ffb95f] animate-bounce" />
            <span className="text-[11px] font-mono">
              Click to insert Google Maps API Key to unlock high-res Google Platform tiles
            </span>
          </div>
        )}

        {/* Google Maps Active Authorized Indicator Badge */}
        {googleApiKey && activeBasemap.startsWith('google') && (
          <div className="absolute top-3 right-3 z-[1000] bg-[#0b1326]/90 px-2.5 py-1 rounded border border-[#10b981]/40 backdrop-blur-sm flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-[9px] font-mono font-bold text-[#10b981]">
              GOOGLE MAPS PLATFORM // AUTHORIZED API KEY
            </span>
          </div>
        )}

        {/* Quick Station Jump Bar (Overlayed on bottom left of map) */}
        <div className="absolute bottom-3 left-3 z-[1000] flex flex-wrap gap-1.5 bg-[#0b1326]/90 p-1.5 rounded-lg border border-[#222a3d] backdrop-blur-sm">
          <span className="text-[10px] font-mono text-[#869397] flex items-center px-1">
            Stations:
          </span>
          {zones.map((z) => {
            const isSelected = z.zone_code === selectedZoneCode;
            const isHigh = z.risk_level === 'HIGH';
            const isMedium = z.risk_level === 'MEDIUM';
            const badgeColor = isHigh ? 'bg-[#ef4444]' : isMedium ? 'bg-[#ffb95f]' : 'bg-[#10b981]';

            return (
              <button
                key={z.zone_code}
                onClick={() => onSelectZone && onSelectZone(z.zone_code)}
                className={`px-2 py-1 text-[10px] font-mono rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#06b6d4] text-[#000000] font-bold shadow-md'
                    : 'bg-[#131b2e] text-[#dae2fd] hover:bg-[#1e293b] border border-[#222a3d]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${badgeColor}`} />
                <span>{z.zone_code.replace('ZONE-', 'Z')}</span>
                {isExpanded && (
                  <span className="text-[9px] opacity-80">({z.water_level.toFixed(1)}m)</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Active Scenario / Radar Indicator Badge (Overlayed on top left of map) */}
        {showRadar && (
          <div className="absolute top-3 left-3 z-[1000] bg-[#0b1326]/90 px-2.5 py-1.5 rounded-lg border border-[#222a3d] backdrop-blur-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#a855f7] animate-ping" />
            <div className="text-[10px] font-mono leading-tight">
              <span className="text-[#c084fc] font-bold">LANGTANG RADAR (SIMULATED): </span>
              <span className="text-[#dae2fd]">
                {scenario === 'flash_flood'
                  ? 'Cloudburst Core (58 dBZ) Detected'
                  : scenario === 'heavy_rain'
                  ? 'Convective Front (45 dBZ)'
                  : 'Clear / Scattered (<25 dBZ)'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Elevation Profile Cross-Section Bar */}
      <div className="mt-2 bg-[#0b1326] p-2 sm:p-2.5 rounded-lg border border-[#222a3d]">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#869397] mb-1.5 flex-wrap gap-1">
          <div className="flex items-center gap-1">
            <Mountain className="w-3.5 h-3.5 text-[#4cd7f6]" />
            <span className="font-bold text-[#dae2fd]">BASIN ELEVATION GRADIENT (TOTAL DROP: 1,840m / 7.1% SLOPE)</span>
          </div>
          <span>Surge Travel Time: ~45 mins from Gorge to Bazaar</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[10px] font-mono">
          <div className="bg-[#131b2e] p-1.5 rounded border border-[#222a3d]">
            <div className="text-[#869397] text-[9px]">GORGE HEADWATERS</div>
            <div className="text-[#4cd7f6] font-bold">2,480m MSL</div>
            <div className="text-[9px] text-[#869397]">Zone A (Debris Chute)</div>
          </div>
          <div className="bg-[#131b2e] p-1.5 rounded border border-[#222a3d]">
            <div className="text-[#869397] text-[9px]">PUL BAZAAR</div>
            <div className="text-[#ffb95f] font-bold">870m MSL</div>
            <div className="text-[9px] text-[#869397]">Zone B (Floodplain)</div>
          </div>
          <div className="bg-[#131b2e] p-1.5 rounded border border-[#222a3d]">
            <div className="text-[#869397] text-[9px]">BAHUNEPATI</div>
            <div className="text-[#dae2fd] font-bold">720m MSL</div>
            <div className="text-[9px] text-[#869397]">Zone C (Terraces)</div>
          </div>
          <div className="bg-[#131b2e] p-1.5 rounded border border-[#222a3d]">
            <div className="text-[#869397] text-[9px]">CONFLUENCE</div>
            <div className="text-[#10b981] font-bold">640m MSL</div>
            <div className="text-[9px] text-[#869397]">Zone D (Indrawati)</div>
          </div>
        </div>
      </div>

      {/* Footer / Legend */}
      <div className="mt-2 pt-1.5 border-t border-[#222a3d] flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] font-mono text-[#869397] gap-2">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#4cd7f6]" />
          <span>Click stations for sensor telemetry HUD or shelters for evacuation routes</span>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ffb95f]" /> Medium
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" /> High Alert
          </span>
          <span className="flex items-center gap-1 text-[#4cd7f6]">
            <Layers className="w-3 h-3" /> {currentConfig.attr}
          </span>
        </div>
      </div>

      {/* Google Maps API Key Modal */}
      <GoogleMapsApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaveKey={handleSaveApiKey}
        currentKey={googleApiKey}
      />
    </div>
  );
};
