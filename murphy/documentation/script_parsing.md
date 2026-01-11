┌─────────────────────────────────────────────────────────────────┐
│                    SCRIPT PARSING MECHANISM                      │
└─────────────────────────────────────────────────────────────────┘

INPUT: Generated Script Content
═══════════════════════════════════

Example Script Format:
┌──────────────────────────────────────────────────────────┐
│ Title: "AI in Healthcare"                                │
│                                                           │
│ Alice: Welcome to our podcast about AI in healthcare!    │
│ Today we'll explore how artificial intelligence is       │
│ revolutionizing medical diagnosis.                       │
│                                                           │
│ Bob: That's right, Alice. AI has shown remarkable        │
│ accuracy in detecting diseases from medical images.      │
│                                                           │
│ Alice: Can you give us some specific examples?           │
│                                                           │
│ Bob: Sure! For instance, AI algorithms can now detect    │
│ early-stage cancer with 95% accuracy...                  │
└──────────────────────────────────────────────────────────┘

STEP 1: CHARACTER NAME EXTRACTION
══════════════════════════════════

Input Data:
├─ characterNames: ["Alice", "Bob"]
├─ content: "full script text"
└─ names: extracted character names from AI generation

Process:
┌──────────────────────────────────────────────────────────┐
│ 1. Extract unique character names from the script       │
│    Pattern matching: "Name:" at start of lines          │
│                                                           │
│ 2. Match with user-defined characterNames array         │
│                                                           │
│ 3. Create character index mapping:                       │
│    {                                                      │
│      "Alice": 0,  // Character index 0                   │
│      "Bob": 1     // Character index 1                   │
│    }                                                      │
└──────────────────────────────────────────────────────────┘

STEP 2: LINE-BY-LINE PARSING
═════════════════════════════

┌──────────────────────────────────────────────────────────┐
│ Algorithm:                                               │
│                                                           │
│ const lines = content.split('\n');                       │
│ const dialogues = [];                                    │
│                                                           │
│ for (const line of lines) {                              │
│   // Skip empty lines                                    │
│   if (!line.trim()) continue;                            │
│                                                           │
│   // Pattern: "CharacterName: dialogue text"             │
│   const match = line.match(/^(\w+):\s*(.+)$/);          │
│                                                           │
│   if (match) {                                           │
│     const [_, speaker, text] = match;                    │
│     dialogues.push({                                     │
│       speaker: speaker,                                  │
│       text: text.trim(),                                 │
│       characterIndex: getCharacterIndex(speaker)         │
│     });                                                   │
│   }                                                       │
│ }                                                         │
└──────────────────────────────────────────────────────────┘

Parsed Output:
┌──────────────────────────────────────────────────────────┐
│ [                                                         │
│   {                                                       │
│     speaker: "Alice",                                    │
│     characterIndex: 0,                                   │
│     text: "Welcome to our podcast about AI..."          │
│   },                                                      │
│   {                                                       │
│     speaker: "Bob",                                      │
│     characterIndex: 1,                                   │
│     text: "That's right, Alice. AI has shown..."        │
│   },                                                      │
│   {                                                       │
│     speaker: "Alice",                                    │
│     characterIndex: 0,                                   │
│     text: "Can you give us some specific examples?"     │
│   },                                                      │
│   {                                                       │
│     speaker: "Bob",                                      │
│     characterIndex: 1,                                   │
│     text: "Sure! For instance, AI algorithms..."        │
│   }                                                       │
│ ]                                                         │
└──────────────────────────────────────────────────────────┘

STEP 3: VOICE MAPPING
══════════════════════

For Each Language (e.g., English, Hindi, French):

┌──────────────────────────────────────────────────────────┐
│ characterSpeakerMap Structure:                           │
│                                                           │
│ {                                                         │
│   "english": {                                           │
│     0: "voice_id_alice_en",  // Alice's English voice   │
│     1: "voice_id_bob_en"     // Bob's English voice     │
│   },                                                      │
│   "hindi": {                                             │
│     0: "voice_id_female_hi", // Alice's Hindi voice     │
│     1: "voice_id_male_hi"    // Bob's Hindi voice       │
│   },                                                      │
│   "french": {                                            │
│     0: "voice_id_female_fr", // Alice's French voice    │
│     1: "voice_id_male_fr"    // Bob's French voice      │
│   }                                                       │
│ }                                                         │
└──────────────────────────────────────────────────────────┘

STEP 4: AUDIO SEGMENT GENERATION
═════════════════════════════════

For Each Language:
┌──────────────────────────────────────────────────────────┐
│                                                           │
│ FOR dialogue IN dialogues:                               │
│                                                           │
│   ┌─────────────────────────────────────┐               │
│   │ 1. Get character index              │               │
│   │    idx = dialogue.characterIndex    │               │
│   │                                      │               │
│   │ 2. Get voice ID for this language   │               │
│   │    voiceId = characterSpeakerMap    │               │
│   │              [language][idx]        │               │
│   │                                      │               │
│   │ 3. Generate TTS audio segment       │               │
│   │    audioSegment = tts.generate(     │               │
│   │      text: dialogue.text,           │               │
│   │      voiceId: voiceId,              │               │
│   │      language: language             │               │
│   │    )                                 │               │
│   │                                      │               │
│   │ 4. Add to audio segments array      │               │
│   │    segments.push(audioSegment)      │               │
│   └─────────────────────────────────────┘               │
│                                                           │
└──────────────────────────────────────────────────────────┘

Example Processing:
┌──────────────────────────────────────────────────────────┐
│ English Audio Generation:                                │
│                                                           │
│ Segment 1: "Welcome to our podcast..."                   │
│   → Voice: Alice's English voice (voice_id_alice_en)     │
│   → Duration: ~5 seconds                                 │
│                                                           │
│ Segment 2: "That's right, Alice..."                      │
│   → Voice: Bob's English voice (voice_id_bob_en)         │
│   → Duration: ~4 seconds                                 │
│                                                           │
│ Segment 3: "Can you give us some..."                     │
│   → Voice: Alice's English voice (voice_id_alice_en)     │
│   → Duration: ~2 seconds                                 │
│                                                           │
│ Segment 4: "Sure! For instance..."                       │
│   → Voice: Bob's English voice (voice_id_bob_en)         │
│   → Duration: ~6 seconds                                 │
└──────────────────────────────────────────────────────────┘

STEP 5: AUDIO CONCATENATION
════════════════════════════

┌──────────────────────────────────────────────────────────┐
│ Combine all segments into single audio file:            │
│                                                           │
│ [Segment 1] → [Segment 2] → [Segment 3] → [Segment 4]   │
│                                                           │
│ Optional Processing:                                     │
│ • Add silence/pause between segments (0.5s)              │
│ • Normalize audio levels                                 │
│ • Apply audio effects (optional)                         │
│ • Compress to MP3 format                                 │
│                                                           │
│ Output: Complete podcast audio file per language         │
└──────────────────────────────────────────────────────────┘

STEP 6: MULTI-LANGUAGE OUTPUT
══════════════════════════════

Final Result:
┌──────────────────────────────────────────────────────────┐
│ {                                                         │
│   "english": {                                           │
│     audio: "base64_encoded_mp3_data",                    │
│     fileName: "podcast_ai_healthcare_en.mp3",            │
│     mimeType: "audio/mpeg",                              │
│     duration: "17 seconds"                               │
│   },                                                      │
│   "hindi": {                                             │
│     audio: "base64_encoded_mp3_data",                    │
│     fileName: "podcast_ai_healthcare_hi.mp3",            │
│     mimeType: "audio/mpeg",                              │
│     duration: "18 seconds"                               │
│   },                                                      │
│   "french": {                                            │
│     audio: "base64_encoded_mp3_data",                    │
│     fileName: "podcast_ai_healthcare_fr.mp3",            │
│     mimeType: "audio/mpeg",                              │
│     duration: "19 seconds"                               │
│   }                                                       │
│ }                                                         │
└──────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════

PARSING RULES & PATTERNS
─────────────────────────

✓ Standard Format: "CharacterName: Dialogue text"
✓ Case-sensitive character name matching
✓ Trim whitespace from dialogue text
✓ Skip empty lines and non-dialogue content
✓ Preserve punctuation and formatting in dialogue
✓ Handle multi-line dialogue (concatenate if needed)

ERROR HANDLING
──────────────

❌ Unknown character names → Use default voice
❌ Missing voice mapping → Error notification
❌ Empty dialogue → Skip segment
❌ Invalid format → Log warning, attempt parsing

OPTIMIZATIONS
─────────────

⚡ Parallel TTS generation for multiple segments
⚡ Caching frequently used voice models
⚡ Batch processing for efficiency
⚡ Streaming audio generation for long scripts