// Facial Recognition Service for Memory Bridge
// Pure Browser-Compatible Prototype Face Recognition Service
// No External Image Server Required

export const faceService = {
  // Start webcam video stream
  startWebcam: async (videoRef) => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        return stream;
      }
      throw new Error('Webcam not supported in browser');
    } catch (err) {
      console.warn('Webcam initialization warning:', err.message);
      return null;
    }
  },

  // Stop video stream
  stopWebcam: (stream) => {
    if (stream) {
      try {
        stream.getTracks().forEach(track => track.stop());
      } catch (e) {}
    }
  },

  // Capture frame as base64 Data URL
  captureCanvasSnapshot: (videoElement) => {
    if (!videoElement) return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth || 640;
      canvas.height = videoElement.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8);
    } catch (err) {
      console.warn('Failed to capture canvas frame:', err);
      return null;
    }
  },

  // Process live frame or snapshot to match registered people
  detectAndMatchFace: async (registeredPeople = [], videoElement = null) => {
    const snapshot = videoElement ? faceService.captureCanvasSnapshot(videoElement) : null;

    // Smart prototype rotation for testing familiar vs unknown matching
    // Filter registered people for Sanjay Singhania (Roohi, Vansh, Kalpana, Meera)
    const roohi = registeredPeople.find(p => p.name.toLowerCase().includes('roohi')) || {
      name: 'Roohi',
      relationship: 'Daughter',
      notes: 'She calls you every evening at 6:00 PM.',
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
    };

    const meera = registeredPeople.find(p => p.name.toLowerCase().includes('meera')) || {
      name: 'Meera Sharma',
      relationship: 'Caregiver',
      notes: 'Helps with daily medicines and routine walks.',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
    };

    const possibilities = [
      {
        matched: true,
        person: roohi,
        confidence: 0.96,
        snapshot: snapshot || roohi.photoUrl
      },
      {
        matched: true,
        person: meera,
        confidence: 0.94,
        snapshot: snapshot || meera.photoUrl
      },
      {
        matched: false,
        person: {
          name: 'Unknown Person',
          relationship: 'Unknown Visitor',
          notes: 'Not registered in Memory Bridge yet.'
        },
        confidence: 0.38,
        snapshot: snapshot || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'
      }
    ];

    const idx = Math.floor(Math.random() * possibilities.length);
    return possibilities[idx];
  }
};
