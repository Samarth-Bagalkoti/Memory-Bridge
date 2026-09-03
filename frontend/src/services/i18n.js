// Multilingual Translation Dictionary (i18n)

export const translations = {
  en: {
    appTitle: "MEMORY BRIDGE",
    tagline: "Bridging memories, people and care.",
    shortDesc: "An intelligent companion that helps people with dementia remember important people, places and routines while keeping caregivers informed and connected.",
    goodMorning: "Good Morning, Ravi 👋",
    whatShouldIDo: "WHAT SHOULD I DO NOW?",
    iTookIt: "I TOOK IT",
    todaySchedule: "TODAY",
    talkToMemoryBridge: "TALK TO MEMORY BRIDGE",
    emergencyHelp: "EMERGENCY HELP",
    memories: "Memories",
    people: "People",
    mindAndMemory: "Mind & Memory",
    assistant: "Assistant",
    help: "Help",
    home: "Home",
    patientLogin: "Patient Login",
    caregiverLogin: "Caregiver Login",
    demoPrototype: "Hackathon Prototype Demo",
    peopleMetToday: "People Met Today",
    safeStatus: "Safe",
    wanderingAlert: "Wandering Alert",
    location: "Current Location",
    medication: "Medication Management"
  },
  hi: {
    appTitle: "मेमोरी ब्रिज",
    tagline: "यादों, लोगों और देखभाल को जोड़ना।",
    shortDesc: "एक बुद्धिमान साथी जो डिमेंशिया से पीड़ित लोगों को महत्वपूर्ण लोगों, स्थानों और दिनचर्या को याद रखने में मदद करता है।",
    goodMorning: "शुभ प्रभात, रवि 👋",
    whatShouldIDo: "मुझे अभी क्या करना चाहिए?",
    iTookIt: "मैंने दवा ले ली",
    todaySchedule: "आज की दिनचर्या",
    talkToMemoryBridge: "मेमोरी ब्रिज से बात करें",
    emergencyHelp: "आपत्कालीन सहायता",
    memories: "यादें",
    people: "परिचित लोग",
    mindAndMemory: "मस्तिष्क खेल",
    assistant: "सहायक",
    help: "मदद",
    home: "मुख्य पृष्ठ",
    patientLogin: "मरीज़ लॉगिन",
    caregiverLogin: "देखभालकर्ता लॉगिन",
    demoPrototype: "हैकथॉन डेमो प्रोटोटाइप",
    peopleMetToday: "आज मिले लोग",
    safeStatus: "सुरक्षित",
    wanderingAlert: "सुरक्षा चेतावनी",
    location: "वर्तमान स्थान",
    medication: "दवा प्रबंधन"
  }
};

export const t = (key, lang = 'en') => {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || key;
};
