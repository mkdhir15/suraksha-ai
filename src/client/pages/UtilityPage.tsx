import React, { useState } from 'react';
import { CalculatorDisguise } from '../components/CalculatorDisguise';
import { Toast } from '../components/ui/Toast';

export const UtilityPage: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTriggerSos = () => {
    setToastMessage('CRITICAL: SILENT EMERGENCY SOS DISPATCHED TO GUARDIANS');
  };

  return (
    <div className="flex flex-col gap-6 py-4 items-center justify-center min-h-[500px]">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-lg font-bold text-text-primary">Standard Calculator</h1>
        <p className="text-xs text-muted mt-0.5">Quick scientific arithmetic utility.</p>
      </div>

      <CalculatorDisguise onTriggerSos={handleTriggerSos} standalone />

      <Toast
        isOpen={!!toastMessage}
        message={toastMessage || ''}
        type="critical"
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
};
