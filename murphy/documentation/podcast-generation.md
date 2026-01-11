┌─────────────────────────────────────────────────────────────────┐
│              MURPHY PODCAST GENERATION WORKFLOW                  │
└─────────────────────────────────────────────────────────────────┘

PHASE 1: CONTENT SETUP
═══════════════════════
┌──────────────────────────────────────────────────────────┐
│  User Inputs:                                            │
│  1. ✍️  Podcast Idea (text description)                  │
│  2. 👥 Character Names (up to 10 characters)            │
│  3. 🎭 Theme Selection (8 theme options)                 │
│     - Casual & Friendly                                  │
│     - Professional                                       │
│     - Educational                                        │
│     - Entertaining                                       │
│     - Storytelling                                       │
│     - Interview Style                                    │
│     - News/Current Events                                │
│     - Motivational                                       │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
PHASE 2: AI CONTENT GENERATION
═══════════════════════════════
┌──────────────────────────────────────────────────────────┐
│  Function: generateContentFromIdea()                     │
│  Service: Gemini AI (Google)                             │
│                                                           │
│  Input Parameters:                                       │
│  • podcastIdea: string                                   │
│  • selectedTheme: string                                 │
│  • characterNames: string[]                              │
│                                                           │
│  AI Processing:                                          │
│  ┌────────────────────────────────────────┐             │
│  │ Gemini AI analyzes input and generates:│             │
│  │ • Title                                 │             │
│  │ • Description                           │             │
│  │ • Full Script/Content                   │             │
│  │ • Character Dialogue                    │             │
│  └────────────────────────────────────────┘             │
│                                                           │
│  Output: PodcastContent {                                │
│    title: string                                         │
│    description: string                                   │
│    content: string (full script)                         │
│    names: string[] (character names)                     │
│  }                                                        │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
PHASE 3: CONTENT EDITING (Optional)
════════════════════════════════════
┌──────────────────────────────────────────────────────────┐
│  Two Content Versions Maintained:                        │
│                                                           │
│  1. generatedContent (Original AI output)                │
│     └─ Read-only in "AI Generated" tab                   │
│                                                           │
│  2. editedContent (User modifications)                   │
│     └─ Editable in "Edited Version" tab                  │
│                                                           │
│  Features:                                               │
│  • Real-time word count tracking                         │
│  • Enable/disable editing mode                           │
│  • Reset to original generated content                   │
│  • Copy to clipboard functionality                       │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
PHASE 4: VOICE MAPPING & CONFIGURATION
═══════════════════════════════════════
┌──────────────────────────────────────────────────────────┐
│  Multi-Language Support:                                 │
│  • English, Hindi, Bengali, French, German,              │
│    Italian, Tamil                                        │
│                                                           │
│  Voice Assignment Process:                               │
│  ┌────────────────────────────────────────────┐         │
│  │ For Each Language:                         │         │
│  │  1. Select language from dropdown          │         │
│  │  2. Map each character to a voice:         │         │
│  │     Character 1 → Voice ID (e.g., "alice") │         │
│  │     Character 2 → Voice ID (e.g., "bob")   │         │
│  │     ...                                     │         │
│  │  3. Store in characterSpeakerMap          │         │
│  └────────────────────────────────────────────┘         │
│                                                           │
│  Data Structure:                                         │
│  characterSpeakerMap = {                                 │
│    "english": { 0: "voice_id_1", 1: "voice_id_2" }      │
│    "hindi": { 0: "voice_id_3", 1: "voice_id_4" }        │
│    "french": { 0: "voice_id_5", 1: "voice_id_6" }       │
│  }                                                        │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
PHASE 5: AUDIO GENERATION
══════════════════════════
┌──────────────────────────────────────────────────────────┐
│  Function: generateAudio()                               │
│                                                           │
│  Step 1: Build langVoiceMap                              │
│  ────────────────────────────                            │
│  const langVoiceMap = buildLangVoiceMap()                │
│  • Maps each language to array of voice IDs              │
│  • Only includes languages with assigned voices          │
│                                                           │
│  Step 2: API Request                                     │
│  ───────────────────                                     │
│  POST /api/generate-audio                                │
│  {                                                        │
│    content: string,        // Full script                │
│    names: string[],        // Character names            │
│    langVoiceMap: {         // Voice mapping              │
│      "english": ["voice1", "voice2"],                    │
│      "hindi": ["voice3", "voice4"]                       │
│    },                                                     │
│    description: string,                                  │
│    title: string                                         │
│  }                                                        │
│                                                           │
│  Step 3: Backend Processing                              │
│  ──────────────────────                                  │
│  ┌──────────────────────────────────────┐               │
│  │ For Each Language:                   │               │
│  │  1. Parse script by character        │               │
│  │  2. Generate TTS audio per speaker   │               │
│  │  3. Combine audio segments           │               │
│  │  4. Export as MP3/audio file         │               │
│  │  5. Return base64 encoded audio      │               │
│  └──────────────────────────────────────┘               │
│                                                           │
│  Step 4: Response Handling                               │
│  ─────────────────────                                   │
│  Response: {                                             │
│    files: {                                              │
│      "english": {                                        │
│        audio: "base64_string",                           │
│        fileName: "podcast_en.mp3",                       │
│        mimeType: "audio/mpeg"                            │
│      },                                                   │
│      "hindi": { ... }                                    │
│    }                                                      │
│  }                                                        │
│                                                           │
│  Step 5: Audio Blob Creation                             │
│  ───────────────────────                                 │
│  • Decode base64 audio                                   │
│  • Create Blob objects                                   │
│  • Generate object URLs for playback                     │
│  • Store in audioFiles state                             │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
PHASE 6: AUDIO PLAYBACK & MANAGEMENT
═════════════════════════════════════
┌──────────────────────────────────────────────────────────┐
│  Audio File Storage:                                     │
│  audioFiles = {                                          │
│    "english": {                                          │
│      url: "blob:http://...",                             │
│      fileName: "podcast_en.mp3"                          │
│    },                                                     │
│    "hindi": { ... }                                      │
│  }                                                        │
│                                                           │
│  Playback Features:                                      │
│  ┌────────────────────────────────────────┐             │
│  │ • Play/Pause controls per language     │             │
│  │ • HTML5 <audio> element integration    │             │
│  │ • Progress bar & time display          │             │
│  │ • Auto-pause other languages on play   │             │
│  │ • Download audio file button           │             │
│  │ • Visual language identification       │             │
│  └────────────────────────────────────────┘             │
│                                                           │
│  Audio Reference Management:                             │
│  • audioRefs: Map of HTMLAudioElement per language       │
│  • isPlayingAudio: Tracks play state per language        │
└──────────────────────────────────────────────────────────┘
                         │
                         ▼
PHASE 7: FINALIZATION
═════════════════════
┌──────────────────────────────────────────────────────────┐
│  finalizeContent() function:                             │
│                                                           │
│  Actions:                                                │
│  • Save to backend/database                              │
│  • Generate metadata                                     │
│  • Create success notification                           │
│  • Log content details (word count, theme, etc.)         │
│                                                           │
│  Options:                                                │
│  1. Finalize Generated (original AI content)             │
│  2. Finalize Edited (user-modified content)              │
│                                                           │
│  Additional Features:                                    │
│  • Copy content to clipboard                             │
│  • Discard/reset functionality                           │
│  • Toast notifications for user feedback                 │
└──────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

KEY DATA FLOW:
──────────────

User Input → Gemini AI → Generated Content → Voice Mapping
                                    ↓
                            Audio Generation API
                                    ↓
                        Multiple Language Audio Files
                                    ↓
                    Playback/Download/Finalize

═══════════════════════════════════════════════════════════════

UNIQUE FEATURES:
────────────────

✨ Multi-Language Audio: Generate same content in 7 languages
👥 Character-Based TTS: Map different voices to characters
🎭 Theme-Driven Content: 8 predefined podcast themes
✏️  Dual Content System: Original + Editable versions
🎧 Integrated Playback: Built-in audio player with controls
📊 Analytics: Real-time word count tracking
🔄 State Management: React hooks for complex state handling