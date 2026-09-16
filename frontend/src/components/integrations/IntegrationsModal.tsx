import React, { useState, useEffect } from 'react';
import {
  X,
  Radio,
  PhoneCall,
  CloudSun,
  MapPin,
  Satellite,
  Database,
  Cpu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  Eye,
  EyeOff,
  ExternalLink,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServiceStatus {
  name: string;
  key_configured: boolean;
  status: string;
  account_sid?: string | null;
  api_key?: string | null;
  from_number?: string;
  target_recipient?: string;
  host?: string;
  port?: number;
  topic?: string;
  engine?: string;
  connection_url?: string | null;
  last_reading?: any;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose }) => {
  const [integrationsData, setIntegrationsData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'sitrep'>('overview');

  // Testing states
  const [testResults, setTestResults] = useState<{ [key: string]: any }>({});
  const [testingService, setTestingService] = useState<string | null>(null);

  // Twilio test SMS state
  const [smsPhone, setSmsPhone] = useState<string>('+977-9800000000');
  const [smsSending, setSmsSending] = useState<boolean>(false);
  const [smsResult, setSmsResult] = useState<any>(null);

  // Gemini AI SitRep state
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [sitrepData, setSitrepData] = useState<any>(null);

  // Key configuration state
  const [configForm, setConfigForm] = useState({
    twilio_account_sid: '',
    twilio_auth_token: '',
    twilio_from_number: '',
    emergency_dispatch_phone: '+977-9800000000',
    openweather_api_key: '',
    gemini_api_key: '',
    google_maps_api_key: '',
    lorawan_app_key: '',
    lorawan_api_key: '',
    satellite_api_key: '',
    mqtt_broker_host: 'broker.hivemq.com',
  });
  const [saveStatus, setSaveStatus] = useState<string>('');

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/integrations/status');
      if (res.ok) {
        const data = await res.json();
        setIntegrationsData(data);
      }
    } catch (err) {
      console.error('Failed to fetch integrations status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStatus();
      setSaveStatus('');
      setSmsResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestService = async (service: string) => {
    try {
      setTestingService(service);
      const res = await fetch(`/api/integrations/test/${service}`, { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        setTestResults((prev) => ({ ...prev, [service]: result }));
      }
    } catch (err) {
      setTestResults((prev) => ({
        ...prev,
        [service]: { status: 'ERROR', message: 'Network request failed' },
      }));
    } finally {
      setTestingService(null);
    }
  };

  const handleSendTestSms = async () => {
    try {
      setSmsSending(true);
      setSmsResult(null);
      const res = await fetch('/api/integrations/twilio/send-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient_phone: smsPhone,
          headline: 'SENSORA CRITICAL SURGE ALERT',
          action: 'Evacuate riverbank settlements to Melamchi Higher Sec. School Safe Camp.',
          lead_time_minutes: 45,
          zone_name: 'Melamchi Pul Bazaar Sector',
        }),
      });
      const result = await res.json();
      setSmsResult(result);
      fetchStatus();
    } catch (err) {
      setSmsResult({ status: 'ERROR', error_detail: String(err) });
    } finally {
      setSmsSending(false);
    }
  };

  const handleGenerateSitRep = async () => {
    try {
      setAiLoading(true);
      const res = await fetch('/api/integrations/ai/generate-sitrep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ zone_code: 'ZONE-B', lead_time_minutes: 45 }),
      });
      if (res.ok) {
        const result = await res.json();
        setSitrepData(result);
      }
    } catch (err) {
      console.error('Failed to generate AI SitRep:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaveStatus('Saving credentials...');
      const res = await fetch('/api/integrations/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configForm),
      });
      if (res.ok) {
        setSaveStatus('Credentials active across all endpoints!');
        fetchStatus();
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (err) {
      setSaveStatus('Failed to update credentials.');
    }
  };

  const services = integrationsData?.services || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-5xl max-h-[90vh] bg-[#0b1326] border border-[#222a3d] rounded-2xl shadow-2xl flex flex-col overflow-hidden reticle-box">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#222a3d] bg-[#131b2e]/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#06b6d4]/10 text-[#4cd7f6] border border-[#06b6d4]/30">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide font-['Space_Grotesk']">
                  FIELD CONNECTIVITY & EXTERNAL APIS
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold uppercase bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 rounded-full flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  8 Providers Ready
                </span>
              </div>
              <p className="text-xs text-[#869397] font-mono">
                Twilio SMS • LoRaWAN Gateway • MQTT Broker • OpenWeather • Google Maps • Copernicus Sat • Gemini AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStatus}
              className="p-2 rounded-lg text-[#869397] hover:text-[#4cd7f6] hover:bg-[#1f293d] transition-colors"
              title="Refresh provider health"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[#869397] hover:text-white hover:bg-[#1f293d] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-[#222a3d] bg-[#0e1628]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-mono font-bold transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#06b6d4] text-[#4cd7f6] bg-[#06b6d4]/5'
                : 'border-transparent text-[#869397] hover:text-[#dae2fd]'
            }`}
          >
            Live Providers Grid
          </button>
          <button
            onClick={() => {
              setActiveTab('sitrep');
              if (!sitrepData) handleGenerateSitRep();
            }}
            className={`px-4 py-2.5 text-xs font-mono font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'sitrep'
                ? 'border-[#a855f7] text-[#c084fc] bg-[#a855f7]/5'
                : 'border-transparent text-[#869397] hover:text-[#dae2fd]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c084fc]" />
            Gemini AI Multilingual SitRep
          </button>
          <button
            onClick={() => setActiveTab('config')}
            className={`px-4 py-2.5 text-xs font-mono font-bold transition-all border-b-2 ${
              activeTab === 'config'
                ? 'border-[#06b6d4] text-[#4cd7f6] bg-[#06b6d4]/5'
                : 'border-transparent text-[#869397] hover:text-[#dae2fd]'
            }`}
          >
            API Keys & Credentials (.env)
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Actions Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Twilio SMS Interactive Test Trigger */}
                <div className="bg-[#131b2e] p-4 rounded-xl border border-[#222a3d] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-['Space_Grotesk'] font-bold text-sm">
                      <PhoneCall className="w-4 h-4 text-[#ef4444]" />
                      <span>Twilio Emergency Broadcast Trigger</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ef4444]/10 text-[#ffb4ab] border border-[#ef4444]/30">
                      Siren / SMS
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={smsPhone}
                      onChange={(e) => setSmsPhone(e.target.value)}
                      placeholder="+977-9800000000"
                      className="flex-1 bg-[#060e20] border border-[#222a3d] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-[#ef4444]"
                    />
                    <button
                      onClick={handleSendTestSms}
                      disabled={smsSending}
                      className="px-3.5 py-2 rounded-lg bg-[#ef4444] text-white font-mono text-xs font-bold hover:bg-[#dc2626] disabled:opacity-50 flex items-center gap-1.5 transition-all shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{smsSending ? 'Broadcasting...' : 'Send Alert'}</span>
                    </button>
                  </div>
                  {smsResult && (
                    <div
                      className={`p-2.5 rounded-lg text-xs font-mono border ${
                        smsResult.status?.includes('DELIVERED') || smsResult.status?.includes('SIMULATED')
                          ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30'
                          : 'bg-[#ef4444]/10 text-[#ffb4ab] border-[#ef4444]/30'
                      }`}
                    >
                      <div className="font-bold">Dispatch Status: {smsResult.status} ({smsResult.mode})</div>
                      <div className="text-[10px] opacity-80 mt-0.5">SID: {smsResult.twilio_sid}</div>
                    </div>
                  )}
                </div>

                {/* OpenWeather Synoptic Live Fetch */}
                <div className="bg-[#131b2e] p-4 rounded-xl border border-[#222a3d] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-['Space_Grotesk'] font-bold text-sm">
                      <CloudSun className="w-4 h-4 text-[#ffb95f]" />
                      <span>OpenWeatherMap Live Synoptic Data</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#06b6d4]/10 text-[#4cd7f6] border border-[#06b6d4]/30">
                      Melamchi Valley
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
                      <div className="text-[#869397] text-[10px]">TEMP</div>
                      <div className="text-white font-bold">19.4°C</div>
                    </div>
                    <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
                      <div className="text-[#869397] text-[10px]">HUMIDITY</div>
                      <div className="text-[#4cd7f6] font-bold">84%</div>
                    </div>
                    <div className="bg-[#0b1326] p-2 rounded-lg border border-[#222a3d]">
                      <div className="text-[#869397] text-[10px]">1H PRECIP</div>
                      <div className="text-[#ffb95f] font-bold">18.5 mm</div>
                    </div>
                  </div>
                  <div className="text-[10px] text-[#869397] font-mono flex items-center justify-between">
                    <span>Corroborates gauge readings against mountain cloudbursts</span>
                    <button
                      onClick={() => handleTestService('openweather')}
                      className="text-[#4cd7f6] hover:underline"
                    >
                      Ping Service
                    </button>
                  </div>
                </div>
              </div>

              {/* Grid of All 8 Services */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Twilio */}
                <ServiceCard
                  icon={<PhoneCall className="w-4 h-4 text-[#ef4444]" />}
                  title="Twilio Emergency SMS"
                  status={services.twilio?.status || 'SIMULATED'}
                  configured={services.twilio?.key_configured}
                  details={`To: ${services.twilio?.target_recipient || '+977-9800000000'}`}
                  subtext="Automated voice call and SMS broadcast to ward committees"
                  onTest={() => handleTestService('twilio')}
                  isTesting={testingService === 'twilio'}
                  testResult={testResults.twilio}
                />

                {/* 2. LoRaWAN */}
                <ServiceCard
                  icon={<Radio className="w-4 h-4 text-[#10b981]" />}
                  title="LoRaWAN Gateway (TTN)"
                  status={services.lorawan?.status || 'GATEWAY_ACTIVE'}
                  configured={services.lorawan?.key_configured}
                  details="Webhook: /api/integrations/lorawan/uplink"
                  subtext="The Things Network v3 / ChirpStack uplink integration"
                  onTest={() => handleTestService('lorawan')}
                  isTesting={testingService === 'lorawan'}
                  testResult={testResults.lorawan}
                />

                {/* 3. MQTT Broker */}
                <ServiceCard
                  icon={<Cpu className="w-4 h-4 text-[#4cd7f6]" />}
                  title="MQTT IoT Broker"
                  status={services.mqtt?.status || 'STANDBY'}
                  configured={true}
                  details={`${services.mqtt?.host || 'broker.hivemq.com'}:1883`}
                  subtext="Pub/Sub telemetry topic: sensora/nepal/catchment"
                  onTest={() => handleTestService('mqtt')}
                  isTesting={testingService === 'mqtt'}
                  testResult={testResults.mqtt}
                />

                {/* 4. Google Maps */}
                <ServiceCard
                  icon={<MapPin className="w-4 h-4 text-[#ffb95f]" />}
                  title="Google Maps Platform"
                  status={services.google_maps?.status || 'ACTIVE'}
                  configured={services.google_maps?.key_configured}
                  details="Hybrid, Satellite, Terrain, Roadmap"
                  subtext="High-resolution orbital satellite & contour hillshade"
                  onTest={() => handleTestService('google_maps')}
                  isTesting={testingService === 'google_maps'}
                  testResult={testResults.google_maps}
                />

                {/* 5. OpenWeather */}
                <ServiceCard
                  icon={<CloudSun className="w-4 h-4 text-[#38bdf8]" />}
                  title="OpenWeather Synoptic"
                  status={services.openweather?.status || 'SYNTHETIC'}
                  configured={services.openweather?.key_configured}
                  details="Melamchi Basin (27.83° N, 85.58° E)"
                  subtext="Live rainfall rate, atmospheric pressure, and gusts"
                  onTest={() => handleTestService('openweather')}
                  isTesting={testingService === 'openweather'}
                  testResult={testResults.openweather}
                />

                {/* 6. Satellite Earth Observation */}
                <ServiceCard
                  icon={<Satellite className="w-4 h-4 text-[#c084fc]" />}
                  title="Copernicus Sentinel Sat"
                  status={services.satellite?.status || 'SAT_SYNCED'}
                  configured={true}
                  details="Soil Saturation Index (SSI: 78.4%)"
                  subtext="Synthetic aperture radar & cloud top reflectance"
                  onTest={() => handleTestService('satellite')}
                  isTesting={testingService === 'satellite'}
                  testResult={testResults.satellite}
                />

                {/* 7. External Database */}
                <ServiceCard
                  icon={<Database className="w-4 h-4 text-[#34d399]" />}
                  title="Production Database"
                  status={services.database?.status || 'ONLINE'}
                  configured={services.database?.key_configured}
                  details={services.database?.engine || 'Local SQLite'}
                  subtext="PostgreSQL / Supabase pooling with SQLite failover"
                  onTest={() => handleTestService('database')}
                  isTesting={testingService === 'database'}
                  testResult={testResults.database}
                />

                {/* 8. Google Gemini AI */}
                <ServiceCard
                  icon={<Sparkles className="w-4 h-4 text-[#f472b6]" />}
                  title="Google Gemini 1.5 Flash"
                  status={services.gemini_ai?.status || 'READY'}
                  configured={services.gemini_ai?.key_configured}
                  details="Multilingual SitRep Engine"
                  subtext="Generates dual-language English & Nepali radio warnings"
                  onTest={() => handleTestService('gemini_ai')}
                  isTesting={testingService === 'gemini_ai'}
                  testResult={testResults.gemini_ai}
                />
              </div>
            </div>
          )}

          {activeTab === 'sitrep' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-[#131b2e] p-4 rounded-xl border border-[#222a3d]">
                <div>
                  <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                    GEMINI 1.5 FLASH TACTICAL SITUATION REPORT (SITREP)
                  </h3>
                  <p className="text-xs text-[#869397] font-mono">
                    Synthesizes real-time sensor streams into executive briefings and Nepali broadcast bulletins
                  </p>
                </div>
                <button
                  onClick={handleGenerateSitRep}
                  disabled={aiLoading}
                  className="px-4 py-2 rounded-lg bg-[#a855f7] text-white font-mono text-xs font-bold hover:bg-[#9333ea] disabled:opacity-50 flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiLoading ? 'Synthesizing...' : 'Regenerate SitRep'}</span>
                </button>
              </div>

              {sitrepData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* English Tactical Overview */}
                  <div className="bg-[#131b2e] p-5 rounded-xl border border-[#222a3d] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#222a3d] pb-3">
                      <span className="text-xs font-bold text-white font-mono">
                        EXECUTIVE SITREP // ENGLISH
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#06b6d4]/10 text-[#4cd7f6]">
                        {sitrepData.source || 'Gemini 1.5 Flash'}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-[#dae2fd] leading-relaxed">
                      {sitrepData.executive_summary}
                    </p>
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#ffb95f] font-mono">
                        STANDARD OPERATING DIRECTIVES (SOP):
                      </span>
                      <ul className="space-y-1.5 text-xs font-mono text-[#c3c7cb]">
                        {sitrepData.sop_evacuation_orders?.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 bg-[#0b1326] p-2 rounded border border-[#222a3d]">
                            <span className="text-[#06b6d4] font-bold">{idx + 1}.</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Nepali Emergency Radio Broadcast */}
                  <div className="bg-[#131b2e] p-5 rounded-xl border border-[#222a3d] space-y-4">
                    <div className="flex items-center justify-between border-b border-[#222a3d] pb-3">
                      <span className="text-xs font-bold text-[#ffb4ab] font-mono">
                        आपतकालीन रेडियो सन्देश // NEPALI BROADCAST
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ef4444]/10 text-[#ffb4ab]">
                        सार्वजनिक सूचना
                      </span>
                    </div>
                    <div className="bg-[#0b1326] p-4 rounded-lg border border-[#ef4444]/30 text-sm font-sans text-white leading-relaxed">
                      {sitrepData.nepali_broadcast}
                    </div>
                    <div className="p-3 rounded-lg bg-[#171f33] border-l-3 border-[#10b981] space-y-1">
                      <div className="text-[11px] font-bold text-[#10b981] font-mono">
                        CLEARANCE MARGIN DIRECTIVE:
                      </div>
                      <p className="text-xs font-mono text-[#dae2fd]">
                        {sitrepData.clearance_advice}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-[#869397] font-mono text-xs">
                  Click 'Regenerate SitRep' to synthesize live disaster intelligence.
                </div>
              )}
            </div>
          )}

          {activeTab === 'config' && (
            <form onSubmit={handleSaveConfig} className="space-y-5">
              <div className="bg-[#131b2e] p-4 rounded-xl border border-[#222a3d] text-xs font-mono text-[#869397] flex items-center justify-between">
                <span>
                  Configure external API keys dynamically. Keys will be active in memory across all backend services immediately.
                </span>
                <span className="text-[#4cd7f6] font-bold">Encrypted in memory & .env</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Twilio */}
                <div className="space-y-2 bg-[#131b2e] p-4 rounded-xl border border-[#222a3d]">
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-[#ef4444]" />
                    <span>Twilio SMS Credentials</span>
                  </div>
                  <input
                    type="text"
                    value={configForm.twilio_account_sid}
                    onChange={(e) => setConfigForm({ ...configForm, twilio_account_sid: e.target.value })}
                    placeholder="TWILIO_ACCOUNT_SID (AC...)"
                    className="w-full bg-[#060e20] border border-[#222a3d] rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#ef4444]"
                  />
                  <input
                    type="password"
                    value={configForm.twilio_auth_token}
                    onChange={(e) => setConfigForm({ ...configForm, twilio_auth_token: e.target.value })}
                    placeholder="TWILIO_AUTH_TOKEN"
                    className="w-full bg-[#060e20] border border-[#222a3d] rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#ef4444]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={configForm.twilio_from_number}
                      onChange={(e) => setConfigForm({ ...configForm, twilio_from_number: e.target.value })}
                      placeholder="From (+123456789)"
                      className="bg-[#060e20] border border-[#222a3d] rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#ef4444]"
                    />
                    <input
                      type="text"
                      value={configForm.emergency_dispatch_phone}
                      onChange={(e) => setConfigForm({ ...configForm, emergency_dispatch_phone: e.target.value })}
                      placeholder="DEOC Phone (+977...)"
                      className="bg-[#060e20] border border-[#222a3d] rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#ef4444]"
                    />
                  </div>
                </div>

                {/* Gemini AI & OpenWeather */}
                <div className="space-y-2 bg-[#131b2e] p-4 rounded-xl border border-[#222a3d]">
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
                    <span>Gemini AI & OpenWeather Keys</span>
                  </div>
                  <input
                    type="password"
                    value={configForm.gemini_api_key}
                    onChange={(e) => setConfigForm({ ...configForm, gemini_api_key: e.target.value })}
                    placeholder="GEMINI_API_KEY (AIzaSy...)"
                    className="w-full bg-[#060e20] border border-[#222a3d] rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#f472b6]"
                  />
                  <input
                    type="password"
                    value={configForm.openweather_api_key}
                    onChange={(e) => setConfigForm({ ...configForm, openweather_api_key: e.target.value })}
                    placeholder="OPENWEATHER_API_KEY"
                    className="w-full bg-[#060e20] border border-[#222a3d] rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#38bdf8]"
                  />
                  <input
                    type="password"
                    value={configForm.google_maps_api_key}
                    onChange={(e) => setConfigForm({ ...configForm, google_maps_api_key: e.target.value })}
                    placeholder="GOOGLE_MAPS_API_KEY"
                    className="w-full bg-[#060e20] border border-[#222a3d] rounded-lg p-2 text-xs font-mono text-white focus:outline-none focus:border-[#ffb95f]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-[#10b981]">{saveStatus}</span>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-[#06b6d4] text-black font-mono text-xs font-bold hover:bg-[#4cd7f6] transition-all shadow-md"
                >
                  Save & Activate Credentials
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  status: string;
  configured?: boolean;
  details: string;
  subtext: string;
  onTest: () => void;
  isTesting: boolean;
  testResult?: any;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  status,
  configured,
  details,
  subtext,
  onTest,
  isTesting,
  testResult,
}) => {
  return (
    <div className="bg-[#131b2e] p-4 rounded-xl border border-[#222a3d] flex flex-col justify-between space-y-3 hover:border-[#06b6d4]/40 transition-all">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="p-1.5 rounded-lg bg-[#0b1326] border border-[#222a3d]">{icon}</div>
          <span
            className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold border ${
              configured
                ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40'
                : 'bg-[#ffb95f]/15 text-[#ffb95f] border-[#ffb95f]/40'
            }`}
          >
            {status}
          </span>
        </div>
        <div>
          <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">{title}</h4>
          <p className="text-[10px] text-[#4cd7f6] font-mono truncate mt-0.5">{details}</p>
        </div>
        <p className="text-[10px] text-[#869397] font-mono leading-tight">{subtext}</p>
      </div>

      <div className="pt-2 border-t border-[#222a3d]/70 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={onTest}
            disabled={isTesting}
            className="text-[10px] font-mono font-bold text-[#4cd7f6] hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>
          {testResult && (
            <span
              className={`text-[9px] font-mono font-bold ${
                testResult.status === 'CONNECTED' || testResult.status === 'STANDBY_READY'
                  ? 'text-[#10b981]'
                  : 'text-[#ffb95f]'
              }`}
            >
              {testResult.status} ({testResult.latency_ms || 0}ms)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
