import React, { useState } from 'react';
import { Shield, AlertCircle } from 'lucide-react';
import { Card } from './ui/Card';

interface CalculatorDisguiseProps {
  onTriggerSos: () => void;
}

export const CalculatorDisguise: React.FC<CalculatorDisguiseProps> = ({ onTriggerSos }) => {
  const [display, setDisplay] = useState('0');
  const [sequence, setSequence] = useState('');
  const [sosTriggered, setSosTriggered] = useState(false);

  const handleKeyPress = (val: string) => {
    const newSeq = sequence + val;
    setSequence(newSeq);

    // Covert Trigger Sequence: 911=
    if (newSeq.endsWith('911=')) {
      setSosTriggered(true);
      onTriggerSos();
      setDisplay('0');
      return;
    }

    if (val === 'C') {
      setDisplay('0');
      setSequence('');
    } else if (val === '=') {
      try {
        const sanitized = display.replace(/×/g, '*').replace(/÷/g, '/');
        const result = new Function(`return ${sanitized}`)();
        setDisplay(String(result));
      } catch {
        setDisplay('Error');
      }
    } else {
      setDisplay((prev) => (prev === '0' || prev === 'Error' ? val : prev + val));
    }
  };

  const buttons = [
    'C', '( )', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '±', '=',
  ];

  return (
    <Card title="Covert Calculator Disguise" subtitle="Fully operational utility with covert emergency trigger sequence (911=)">
      <div className="w-full max-w-sm mx-auto bg-stage p-5 rounded-3xl border border-border shadow-2xl">
        {sosTriggered && (
          <div className="mb-3 p-3 rounded-xl bg-critical text-white text-xs flex items-center gap-2 font-bold animate-pulse" role="alert">
            <Shield className="w-4 h-4 text-white" />
            <span>Silent Emergency SOS Dispatched via Key Code!</span>
          </div>
        )}

        {/* Display Screen */}
        <div className="bg-surface rounded-2xl p-4 mb-4 text-right border border-border">
          <span className="text-xs text-muted block h-4 mb-1 font-mono overflow-hidden">
            {sequence || 'System Utility Mode'}
          </span>
          <div className="text-3xl font-mono font-light text-text-primary tracking-wider truncate">
            {display}
          </div>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-4 gap-2.5">
          {buttons.map((btn) => {
            const isOp = ['÷', '×', '-', '+', '='].includes(btn);
            const isSpecial = ['C', '( )', '%'].includes(btn);
            return (
              <button
                key={btn}
                type="button"
                onClick={() => handleKeyPress(btn)}
                className={`h-12 rounded-xl text-base font-medium transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
                  isOp
                    ? 'bg-accent text-white hover:bg-sky-500 font-bold'
                    : isSpecial
                    ? 'bg-surface-hover text-text-primary border border-border'
                    : 'bg-surface text-text-primary hover:bg-surface-hover border border-border/50'
                }`}
              >
                {btn}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-accent" /> Covert Disguise Active
          </span>
          <span className="font-mono">Trigger Code: 911=</span>
        </div>
      </div>
    </Card>
  );
};
