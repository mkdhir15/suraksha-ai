export const ESCALATION_LEVELS = {
    LEVEL_1: {
        level: 1,
        name: 'Warning & Low-Priority Alert',
        description: 'Triggers subtle haptic feedback, logs ping, and notifies trusted guardians via in-app banner.',
    },
    LEVEL_2: {
        level: 2,
        name: 'Silent Contact & Guardian Beacon',
        description: 'Sends covert SMS/push notifications with live location link to emergency contacts.',
    },
    LEVEL_3: {
        level: 3,
        name: 'Emergency SOS & Dispatch',
        description: 'Initiates immediate 911/emergency authority signal, broadcasts audio distress beacon.',
    },
};
export const HIGH_THREAT_KEYWORDS = [
    'help',
    'follow',
    'following me',
    'stalking',
    'danger',
    'attack',
    'emergency',
    'sos',
    'gun',
    'knife',
    'threat',
    'force',
    'scared',
    'trapped',
];
