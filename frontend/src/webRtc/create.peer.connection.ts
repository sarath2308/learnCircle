import { useRef } from "react";

export const createPeerConnection = () => {
     const pcRef = useRef<RTCPeerConnection | null>(null);
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("🧊 ICE candidate generated:", event.candidate);
    }
  };

  pc.ontrack = (event) => {
    console.log("🎥 Remote track received (not used yet)", event.streams);
  };

  pcRef.current = pc;
  console.log("✅ PeerConnection created");
  return pc;
};
