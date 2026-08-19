import React, { useState } from 'react';
import { Shield, KeyRound, Bell, UserPlus, Save } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const SettingsPage: React.FC = () => {
  const [pin, setPin] = useState('9999');
  const [contactName, setContactName] = useState('Sarah Jenkins (Guardian)');
  const [contactPhone, setContactPhone] = useState('+1 (555) 902-1234');
  const [sensitivity, setSensitivity] = useState('high');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      <div className="p-6 rounded-3xl bg-surface border border-border">
        <h1 className="text-xl font-bold text-text-primary">Guardian System Settings</h1>
        <p className="text-xs text-muted mt-1 leading-relaxed">
          Configure confidential safety PINs, primary emergency contacts, and sensor fusion sensitivity thresholds.
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-8">
        <Card title="Emergency PIN & Covert Trigger Codes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-muted block mb-2 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-accent" /> Dead-Man Renewal PIN (4 Digits)
              </label>
              <input
                type="text"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-2.5 bg-stage border border-border rounded-xl font-mono text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-2 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-accent" /> Sensor Fusion Sensitivity
              </label>
              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                className="w-full px-4 py-2.5 bg-stage border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent"
              >
                <option value="high">High Sensitivity (Aggressive Guardian Alerts)</option>
                <option value="medium">Balanced (Recommended)</option>
                <option value="low">Conservative (High Threshold)</option>
              </select>
            </div>
          </div>
        </Card>

        <Card title="Primary Emergency Guardians">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-semibold text-muted block mb-2 flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-accent" /> Guardian Name
              </label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full px-4 py-2.5 bg-stage border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-2 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-accent" /> Mobile Number for Silent SMS
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-stage border border-border rounded-xl text-text-primary focus:outline-none focus:border-accent font-mono"
              />
            </div>
          </div>
        </Card>

        <Card title="Quick System Utilities">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="text-xs text-muted leading-relaxed">
              <span className="font-semibold text-text-primary block mb-0.5">Standard Arithmetic Utility</span>
              Standard desktop calculator utility tool for rapid calculations.
            </div>
            <a
              href="#/utility"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = '/utility';
              }}
              className="px-4 py-2 rounded-xl bg-stage border border-border text-xs font-semibold text-text-primary hover:border-accent transition-colors"
            >
              Open Calculator Tool
            </a>
          </div>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg">
            <Save className="w-4 h-4 mr-2" /> {saved ? 'Configuration Saved!' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};
