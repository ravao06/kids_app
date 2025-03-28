class VoiceService {
    private voices: SpeechSynthesisVoice[] = [];
    private synth: SpeechSynthesis;
    
    constructor() {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      
      // Voice list might load asynchronously
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
      }
    }
    
    private loadVoices() {
      this.voices = this.synth.getVoices();
    }
    
    // Speaks the recognized drawing type
    speak(text: string, language: string = 'fr-FR') {
      // Cancel any ongoing speech
      this.synth.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a voice for the specified language
      const langVoices = this.voices.filter(voice => voice.lang.includes(language));
      if (langVoices.length > 0) {
        utterance.voice = langVoices[0];
      }
      
      utterance.lang = language;
      utterance.pitch = 1;
      utterance.rate = 1;
      
      this.synth.speak(utterance);
    }
    
    // Announce the recognized drawing
    announceRecognition(drawingType: string) {
      let message = '';
      
      // French message
      if (drawingType) {
        message = `Ce que tu as dessiné, c'est un ${drawingType} , c'est très joli !`;
      } else {
        message = "Je ne reconnais pas ce dessin.";
      }
      
      this.speak(message);
    }
  }
  
  export default new VoiceService();
  