export interface CallerIdentityConfig {
  id: 'mom' | 'dad' | 'sibling' | 'police' | 'security';
  name: string;
  subtitle: string;
  iconName: 'heart' | 'user' | 'users' | 'shield' | 'headphones';
  number: string;
  voiceDialogue: string;
}

export const CALLER_IDENTITIES_CONFIG: CallerIdentityConfig[] = [
  {
    id: 'mom',
    name: 'Mom',
    subtitle: 'Family Contact',
    iconName: 'heart',
    number: '+1 (555) 902-1234',
    voiceDialogue: 'Hey sweetheart, I am tracking your live GPS location on the map right now. I am just 2 minutes away at the main intersection, stay on the line with me!',
  },
  {
    id: 'dad',
    name: 'Dad',
    subtitle: 'Family Contact',
    iconName: 'user',
    number: '+1 (555) 883-4920',
    voiceDialogue: 'Stay right where you are on the well-lit path. I have your live telemetry feed active and I am pulling up in 60 seconds.',
  },
  {
    id: 'sibling',
    name: 'Brother / Sis',
    subtitle: 'Family Contact',
    iconName: 'users',
    number: '+1 (555) 771-9231',
    voiceDialogue: 'Hey! I got your live GPS alert and I am heading straight to your location right now. Keep your phone out, I am almost there!',
  },
  {
    id: 'police',
    name: 'Police',
    subtitle: 'Emergency Services',
    iconName: 'shield',
    number: '+1 (911) 204-7700',
    voiceDialogue: 'Officer Williams here on Emergency Channel 4. I am currently monitoring your live GPS coordinates. Patrol units are 90 seconds away from your location. Stay calm.',
  },
  {
    id: 'security',
    name: 'Nearby Security Center',
    subtitle: 'Local Patrol Hub',
    iconName: 'headphones',
    number: '+1 (800) 555-GUARD',
    voiceDialogue: 'Suraksha Central Security Dispatch. Your live telemetry feed and acoustic sensors are active. Verified security escort is approaching your position now.',
  },
];
