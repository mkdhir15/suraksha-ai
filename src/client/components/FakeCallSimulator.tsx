import React, { useState, useEffect, useRef } from 'react';
import { PhoneCall, Heart, User, Users, Shield, Headphones, PhoneOff, Phone, Volume2, Mic, Sparkles } from 'lucide-react';
import { Card } from './ui/Card';
import { CALLER_IDENTITIES_CONFIG, CallerIdentityConfig } from '../../shared/constants/fakeCall.constants';

export const FakeCallSimulator: React.FC = () => {
  const [selectedIdentityId, setSelectedIdentityId] = useState<CallerIdentityConfig['id']>('police');
  const [delaySeconds, setDelaySeconds] = useState<number>(0);

  // Call Lifecycle States: 'idle' | 'countdown' | 'incoming' | 'active'
  const [callState, setCallState] = useState<'idle' | 'countdown' | 'incoming' | 'active'>('idle');
  const [countdownRemaining, setCountdownRemaining] = useState<number>(0);
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);

  const selectedConfig = CALLER_IDENTITIES_CONFIG.find((c: CallerIdentityConfig) => c.id === selectedIdentityId) || CALLER_IDENTITIES_CONFIG[3];

  const renderIcon = (iconName: CallerIdentityConfig['iconName']) => {
    switch (iconName) {
      case 'heart':
        return <Heart className="w-5 h-5 text-rose-400" />;
      case 'user':
        return <User className="w-5 h-5 text-sky-400" />;
      case 'users':
        return <Users className="w-5 h-5 text-emerald-400" />;
      case 'shield':
        return <Shield className="w-5 h-5 text-indigo-400" />;
      case 'headphones':
        return <Headphones className="w-5 h-5 text-teal-400" />;
    }
  };

  // Audio Context & Ringer Reference
  const audioContextRef = useRef<AudioContext | null>(null);
  const ringIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Play Audible Connection Beep Tone (Web Audio API)
  const playBeepTone = (freq = 880, durationMs = 150) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);

      setTimeout(() => ctx.close().catch(() => {}), durationMs + 50);
    } catch {
      // Audio fallback
    }
  };

  // Web Audio Ringtone Generator (Simulates actual phone ringer)
  const startRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      audioContextRef.current = new AudioCtx();

      const playRingtonePulse = () => {
        if (!audioContextRef.current) return;
        const osc1 = audioContextRef.current.createOscillator();
        const osc2 = audioContextRef.current.createOscillator();
        const gain = audioContextRef.current.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, audioContextRef.current.currentTime); // A4
        osc2.frequency.setValueAtTime(480, audioContextRef.current.currentTime); // Dual Tone PSTN

        gain.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 1.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioContextRef.current.destination);

        osc1.start();
        osc2.start();
        osc1.stop(audioContextRef.current.currentTime + 1.2);
        osc2.stop(audioContextRef.current.currentTime + 1.2);
      };

      playRingtonePulse();
      ringIntervalRef.current = setInterval(playRingtonePulse, 2500);
    } catch {
      // Fallback
    }
  };

  const stopRingtone = () => {
    if (ringIntervalRef.current) {
      clearInterval(ringIntervalRef.current);
      ringIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // Speech Synthesis Speech Generator
  const speakDialogue = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Trigger Fake Call Action
  const handleTriggerCall = () => {
    // Play initial audible beep tone when call is triggered
    playBeepTone(1000, 180);

    if (delaySeconds === 0) {
      setCallState('incoming');
      startRingtone();
    } else {
      setCallState('countdown');
      setCountdownRemaining(delaySeconds);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'countdown' && countdownRemaining > 0) {
      timer = setInterval(() => {
        playBeepTone(600, 80); // Beep on countdown tick
        setCountdownRemaining((prev) => prev - 1);
      }, 1000);
    } else if (callState === 'countdown' && countdownRemaining === 0) {
      setCallState('incoming');
      startRingtone();
    }
    return () => clearInterval(timer);
  }, [callState, countdownRemaining]);

  // Active call duration timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState === 'active') {
      timer = setInterval(() => {
        setCallDurationSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDurationSeconds(0);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const handleAcceptCall = () => {
    stopRingtone();
    playBeepTone(1200, 150); // Audible beep tone on call accept
    setCallState('active');
    speakDialogue(selectedConfig.voiceDialogue);
  };

  const handleDeclineOrEndCall = () => {
    stopRingtone();
    stopSpeech();
    playBeepTone(400, 200); // Low hangup beep tone
    setCallState('idle');
  };

  const formattedCallDuration = `${Math.floor(callDurationSeconds / 60)
    .toString()
    .padStart(2, '0')}:${(callDurationSeconds % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-6">
      {/* Main Deterrent Card Matching User Screenshot */}
      <Card
        title="Fake Call Simulator"
        action={
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-indigo-400" /> Deterrent Tool
          </span>
        }
      >
        <div className="flex flex-col items-center text-center gap-6 py-4 max-w-xl mx-auto">
          <div>
            <h2 className="text-2xl font-extrabold text-text-primary tracking-tight">Fake Call Simulator</h2>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              Simulate a realistic incoming call with custom caller identity, phone ringtone & beep tones, active timer, and voice deterrent dialogue.
            </p>
          </div>

          {/* Select Caller Identity 5-Card Selector */}
          <div className="w-full flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted text-left">Select Caller Identity</span>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {CALLER_IDENTITIES_CONFIG.map((identity: CallerIdentityConfig) => {
                const isSelected = identity.id === selectedIdentityId;
                return (
                  <button
                    key={identity.id}
                    type="button"
                    onClick={() => {
                      playBeepTone(800, 60); // Beep on selection
                      setSelectedIdentityId(identity.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col items-center gap-2 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-500/20 text-white font-bold'
                        : 'bg-stage/80 border-border text-muted hover:text-text-primary hover:border-muted'
                    }`}
                  >
                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-indigo-500/30' : 'bg-surface'}`}>
                      {renderIcon(identity.iconName)}
                    </div>
                    <span className="text-[11px] font-bold leading-tight">{identity.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Delay Before Trigger Dropdown */}
          <div className="w-full flex flex-col gap-2">
            <span className="text-xs font-semibold text-muted text-left">Delay Before Trigger</span>
            <select
              value={delaySeconds}
              onChange={(e) => setDelaySeconds(Number(e.target.value))}
              className="w-full px-4 py-3 bg-stage border border-border rounded-2xl text-xs text-text-primary focus:outline-none focus:border-indigo-500 font-medium cursor-pointer"
            >
              <option value={0}>Immediately (0 Seconds)</option>
              <option value={5}>5 Seconds Delay</option>
              <option value={10}>10 Seconds Delay</option>
              <option value={30}>30 Seconds Delay</option>
            </select>
          </div>

          {/* Trigger Button with Glowing Gradient */}
          <button
            type="button"
            onClick={handleTriggerCall}
            disabled={callState === 'countdown'}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            <PhoneCall className="w-5 h-5" />
            {callState === 'countdown' ? `Triggering Call in ${countdownRemaining}s...` : 'Trigger Fake Incoming Call'}
          </button>
        </div>
      </Card>

      {/* FULLSCREEN REALISTIC INCOMING CALL MODAL */}
      {callState === 'incoming' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-surface border border-border p-8 shadow-2xl flex flex-col items-center justify-between min-h-[520px] text-center relative overflow-hidden">
            {/* Animated Ringing Pulse Background Glow */}
            <div className="absolute inset-0 bg-indigo-500/10 animate-pulse pointer-events-none" />

            <div className="flex flex-col items-center gap-2 pt-6 relative z-10">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 animate-bounce text-indigo-400" /> Incoming Phone Call...
              </span>
              <h3 className="text-3xl font-extrabold text-white mt-2">{selectedConfig.name}</h3>
              <span className="text-xs text-muted font-mono">{selectedConfig.number}</span>
            </div>

            {/* Avatar Icon */}
            <div className="w-28 h-28 rounded-full bg-indigo-600/20 border-2 border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-2xl relative z-10 my-6 animate-pulse">
              <div className="scale-150">{renderIcon(selectedConfig.iconName)}</div>
            </div>

            {/* Accept / Decline Action Controls */}
            <div className="w-full flex items-center justify-around pb-4 relative z-10">
              {/* Decline Button */}
              <button
                type="button"
                onClick={handleDeclineOrEndCall}
                className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/40 transition-all active:scale-95 cursor-pointer"
                title="Decline Call"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Accept Button */}
              <button
                type="button"
                onClick={handleAcceptCall}
                className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 transition-all active:scale-95 cursor-pointer animate-bounce"
                title="Accept Call"
              >
                <Phone className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULLSCREEN REALISTIC ACTIVE DETERRENT CALL MODAL */}
      {callState === 'active' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-surface border border-border p-6 shadow-2xl flex flex-col items-center justify-between min-h-[540px] text-center relative">
            <div className="flex flex-col items-center gap-1.5 pt-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Active Voice Call
              </div>
              <h3 className="text-2xl font-bold text-white mt-2">{selectedConfig.name}</h3>
              <span className="text-xs text-muted font-mono">{selectedConfig.number}</span>
              <span className="text-sm font-mono font-bold text-indigo-400 mt-1">{formattedCallDuration}</span>
            </div>

            {/* Audio Waveform Visualizer */}
            <div className="flex items-center justify-center gap-1.5 my-4 h-12 w-full">
              <span className="w-1.5 h-8 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
              <span className="w-1.5 h-12 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <span className="w-1.5 h-6 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <span className="w-1.5 h-10 bg-teal-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              <span className="w-1.5 h-7 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }} />
            </div>

            {/* Voice Deterrent Dialogue Box */}
            <div className="w-full p-4 rounded-2xl bg-stage border border-border text-xs text-text-primary text-left flex flex-col gap-2 shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-indigo-300 font-mono font-bold">
                <span className="flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-indigo-400" /> Live Deterrent Dialogue Transcript:
                </span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Audio Active
                </span>
              </div>
              <p className="text-xs text-muted leading-relaxed font-sans">{selectedConfig.voiceDialogue}</p>
            </div>

            {/* End Call Button */}
            <div className="w-full pt-4">
              <button
                type="button"
                onClick={handleDeclineOrEndCall}
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <PhoneOff className="w-5 h-5" /> End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
