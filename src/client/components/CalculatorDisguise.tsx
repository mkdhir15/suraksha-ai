import React, { useState } from 'react';

interface CalculatorDisguiseProps {
  onTriggerSos: () => void;
  standalone?: boolean;
}

export const CalculatorDisguise: React.FC<CalculatorDisguiseProps> = ({ onTriggerSos, standalone = false }) => {
  const [display, setDisplay] = useState('0');
  const [sequence, setSequence] = useState('');

  const handleKeyPress = (val: string) => {
    const newSeq = sequence + val;
    setSequence(newSeq);

    // Covert Trigger Sequence: 911=
    if (newSeq.endsWith('911=')) {
      onTriggerSos();
      setDisplay('0');
      setSequence('');
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

  const content = (
    <div className="w-full max-w-sm mx-auto bg-surface p-5 rounded-3xl border border-border shadow-2xl">
      {/* Display Screen */}
      <div className="bg-stage rounded-2xl p-4 mb-4 text-right border border-border min-h-[72px] flex flex-col justify-end">
        <span className="text-xs text-muted block font-mono overflow-hidden h-4">
          {sequence}
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
                  ? 'bg-stage text-text-primary border border-border'
                  : 'bg-stage/60 text-text-primary hover:bg-stage border border-border/50'
              }`}
            >
              {btn}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (standalone) {
    return content;
  }

  return (
    <div className="p-4 rounded-3xl bg-surface border border-border">
      {content}
    </div>
  );
};
