import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  HiCog,
  HiUser,
  HiGlobe,
  HiMail,
  HiDatabase,
  HiBell,
  HiEye,
  HiLockClosed,
  HiColorSwatch,
  HiCloud,
  HiChartBar,
  HiRefresh,
  HiCheck,
  HiX
} from "react-icons/hi";

const DashSettings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("general");
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    siteName: "ByteThoughts",
    siteDescription: "One byte, one thought",
    allowRegistration: true,
    requireEmailVerification: true,
    maintenanceMode: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: false,
    adminAlerts: true,
    userRegistrationAlert: true,
    newCommentAlert: true,
    
    // Privacy Settings
    showUserProfiles: true,
    allowAnonymousComments: false,
    dataCaching: true,
    analyticsEnabled: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // Content Settings
    autoModeration: false,
    allowGuestComments: true,
    maxPostLength: 10000,
    requirePostApproval: false
  });

  const handleSave = () => {
    // Here you would typically save to your API
    console.log("Saving settings:", settings);
    setShowSaveConfirmation(true);
    setTimeout(() => setShowSaveConfirmation(false), 3000);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const settingsTabs = [
    { id: "general", label: "General", icon: HiCog },
    { id: "notifications", label: "Notifications", icon: HiBell },
    { id: "privacy", label: "Privacy", icon: HiEye },
    { id: "security", label: "Security", icon: HiLockClosed },
    { id: "content", label: "Content", icon: HiDatabase },
  ];

  const SettingToggle = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white">{label}</h3>
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
          value 
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
            : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const SettingInput = ({ label, value, onChange, type = "text", placeholder }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
      />
    </div>
  );

  const SettingSelect = ({ label, value, onChange, options }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Settings
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Configure your blog's behavior and preferences
              </p>
            </div>
            
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <HiCheck className="w-5 h-5" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Settings Categories
              </h2>
              <nav className="space-y-2">
                {settingsTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Settings Panels */}
          <div className="lg:col-span-3">
            {activeTab === "general" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  General Settings
                </h2>
                <SettingInput
                  label="Site Name"
                  value={settings.siteName}
                  onChange={(value) => updateSetting("siteName", value)}
                />
                <SettingInput
                  label="Site Description"
                  value={settings.siteDescription}
                  onChange={(value) => updateSetting("siteDescription", value)}
                />
                <SettingToggle
                  label="Allow Registration"
                  value={settings.allowRegistration}
                  onChange={(value) => updateSetting("allowRegistration", value)}
                />
                <SettingToggle
                  label="Require Email Verification"
                  value={settings.requireEmailVerification}
                  onChange={(value) => updateSetting("requireEmailVerification", value)}
                />
                <SettingToggle
                  label="Maintenance Mode"
                  value={settings.maintenanceMode}
                  onChange={(value) => updateSetting("maintenanceMode", value)}
                />
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Notification Settings
                </h2>
                <SettingToggle
                  label="Email Notifications"
                  value={settings.emailNotifications}
                  onChange={(value) => updateSetting("emailNotifications", value)}
                />
                <SettingToggle
                  label="Push Notifications"
                  value={settings.pushNotifications}
                  onChange={(value) => updateSetting("pushNotifications", value)}
                />
                <SettingToggle
                  label="Admin Alerts"
                  value={settings.adminAlerts}
                  onChange={(value) => updateSetting("adminAlerts", value)}
                />
                <SettingToggle
                  label="User Registration Alert"
                  value={settings.userRegistrationAlert}
                  onChange={(value) => updateSetting("userRegistrationAlert", value)}
                />
                <SettingToggle
                  label="New Comment Alert"
                  value={settings.newCommentAlert}
                  onChange={(value) => updateSetting("newCommentAlert", value)}
                />
              </div>
            )}

            {activeTab === "privacy" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Privacy Settings
                </h2>
                <SettingToggle
                  label="Show User Profiles"
                  value={settings.showUserProfiles}
                  onChange={(value) => updateSetting("showUserProfiles", value)}
                />
                <SettingToggle
                  label="Allow Anonymous Comments"
                  value={settings.allowAnonymousComments}
                  onChange={(value) => updateSetting("allowAnonymousComments", value)}
                />
                <SettingToggle
                  label="Data Caching"
                  value={settings.dataCaching}
                  onChange={(value) => updateSetting("dataCaching", value)}
                />
                <SettingToggle
                  label="Analytics Enabled"
                  value={settings.analyticsEnabled}
                  onChange={(value) => updateSetting("analyticsEnabled", value)}
                />
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Security Settings
                </h2>
                <SettingToggle
                  label="Two-Factor Auth"
                  value={settings.twoFactorAuth}
                  onChange={(value) => updateSetting("twoFactorAuth", value)}
                />
                <SettingInput
                  label="Session Timeout"
                  value={settings.sessionTimeout}
                  onChange={(value) => updateSetting("sessionTimeout", value)}
                  type="number"
                />
                <SettingInput
                  label="Max Login Attempts"
                  value={settings.maxLoginAttempts}
                  onChange={(value) => updateSetting("maxLoginAttempts", value)}
                  type="number"
                />
              </div>
            )}

            {activeTab === "content" && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Content Settings
                </h2>
                <SettingToggle
                  label="Auto Moderation"
                  value={settings.autoModeration}
                  onChange={(value) => updateSetting("autoModeration", value)}
                />
                <SettingToggle
                  label="Allow Guest Comments"
                  value={settings.allowGuestComments}
                  onChange={(value) => updateSetting("allowGuestComments", value)}
                />
                <SettingInput
                  label="Max Post Length"
                  value={settings.maxPostLength}
                  onChange={(value) => updateSetting("maxPostLength", value)}
                  type="number"
                />
                <SettingToggle
                  label="Require Post Approval"
                  value={settings.requirePostApproval}
                  onChange={(value) => updateSetting("requirePostApproval", value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashSettings;