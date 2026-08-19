import React, { useState } from 'react';
import { HeartHandshake, Send, PhoneCall, Sparkles, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { classifyCrisisSignal, CrisisClassificationResult } from '../../../server/services/crisisClassifierService';

interface ChatMessage {
  id: string;
  sender: 'user' | 'system';
  text: string;
  timestamp: string;
}

export const CrisisSupportPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'system',
      text: 'Hello. I am here to provide a quiet, safe space. Whatever you are carrying right now, feel free to write it down.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [classification, setClassification] = useState<CrisisClassificationResult | null>(null);
  const [showGroundingModal, setShowGroundingModal] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const messageText = inputText;
    setInputText('');
    setIsProcessing(true);

    try {
      const result = await classifyCrisisSignal(messageText);
      setClassification(result);

      const sysMsg: ChatMessage = {
        id: `s-${Date.now()}`,
        sender: 'system',
        text: result.supportiveResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, sysMsg]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-surface border border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-text-primary">Mental Health Crisis Interception Layer</h1>
              <span className="text-[10px] font-mono text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                Supportive & Confidential
              </span>
            </div>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Provides supportive reflection space, calming grounding techniques, and instant connection to crisis professionals.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card title="Supportive Reflection Chat">
            <div className="flex flex-col h-[420px]">
              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[80%] ${
                      m.sender === 'user' ? 'self-end items-end' : 'self-start items-start'
                    }`}
                  >
                    <div
                      className={`p-4 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-accent text-white rounded-br-none'
                          : 'bg-stage border border-border text-text-primary rounded-bl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-muted font-mono mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSend} className="p-3 border-t border-border flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Share what is on your mind..."
                  className="flex-1 px-4 py-2.5 bg-stage border border-border rounded-xl text-xs text-text-primary placeholder-muted focus:outline-none focus:border-accent"
                />
                <Button type="submit" disabled={isProcessing}>
                  <Send className="w-4 h-4 mr-1" /> {isProcessing ? 'Thinking...' : 'Send'}
                </Button>
              </form>
            </div>
          </Card>
        </div>

        {/* Support Tools Panel */}
        <div className="flex flex-col gap-6">
          <Card title="Supportive Calming Tools">
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-2xl bg-stage border border-border flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>5-4-3-2-1 Grounding Exercise</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  A sensory awareness technique designed to reduce panic and bring focus back to the present moment.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowGroundingModal(true)}
                  className="mt-1 text-xs self-start"
                >
                  Start Grounding Exercise
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-bold text-teal-200">
                  <PhoneCall className="w-4 h-4 text-teal-400" />
                  <span>Confidential Crisis Lifeline</span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  24/7 free, confidential support from trained professionals.
                </p>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => alert('Dialing 988 Suicide & Crisis Lifeline...')}
                  className="mt-1 text-xs"
                >
                  Talk to Someone Now (988)
                </Button>
              </div>
            </div>
          </Card>

          {classification?.isCrisisDetected && (
            <div className="p-4 rounded-2xl bg-teal-950/30 border border-teal-500/40 text-xs text-teal-200 flex flex-col gap-2">
              <span className="font-bold">Gentle Reminder:</span>
              <p className="text-muted leading-relaxed">
                You matter, and help is always available. Take a deep breath — support is right here whenever you need it.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 5-4-3-2-1 Grounding Exercise Modal */}
      {showGroundingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stage/80 backdrop-blur-md">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="text-lg font-bold text-teal-300 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-400" /> 5-4-3-2-1 Sensory Grounding
              </h3>
              <button
                onClick={() => setShowGroundingModal(false)}
                className="p-1 rounded-full text-muted hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-text-primary leading-relaxed">
              <div className="p-3 rounded-xl bg-stage border border-border">
                <span className="font-bold text-accent block mb-1">5 THINGS YOU CAN SEE</span>
                <span className="text-muted">Look around you and notice 5 distinct objects near you.</span>
              </div>

              <div className="p-3 rounded-xl bg-stage border border-border">
                <span className="font-bold text-accent block mb-1">4 THINGS YOU CAN TOUCH</span>
                <span className="text-muted">Feel the weight of your feet on the ground or the texture of your clothing.</span>
              </div>

              <div className="p-3 rounded-xl bg-stage border border-border">
                <span className="font-bold text-accent block mb-1">3 THINGS YOU CAN HEAR</span>
                <span className="text-muted">Listen closely for 3 background sounds around you right now.</span>
              </div>

              <div className="p-3 rounded-xl bg-stage border border-border">
                <span className="font-bold text-accent block mb-1">2 THINGS YOU CAN SMELL</span>
                <span className="text-muted">Notice 2 subtle scents in the air.</span>
              </div>

              <div className="p-3 rounded-xl bg-stage border border-border">
                <span className="font-bold text-accent block mb-1">1 THING YOU CAN TASTE</span>
                <span className="text-muted">Take a sip of water or notice the current taste in your mouth.</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-border flex justify-end">
              <Button size="sm" onClick={() => setShowGroundingModal(false)}>
                Done Grounding
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
