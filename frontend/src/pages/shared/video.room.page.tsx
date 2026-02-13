import React, { useEffect, useRef, useState } from 'react';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Send, Hand, Share2, X
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams } from 'react-router-dom';
import type { Socket } from 'socket.io-client';
import { getSocket } from '@/socket/socket';
import toast from 'react-hot-toast';

const VideoRoom = () => {
  const { roomId } = useParams<string>();
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("joining"); 
  const [peerConnected, setPeerConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null); // Track stream for hard cleanup

  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);
  const pendingOffer = useRef<RTCSessionDescriptionInit | null>(null);
  const pendingAnswer = useRef<RTCSessionDescriptionInit | null>(null);

  if (!roomId) {
    navigate(-1);
  }

  // ✅ FIXED: Toggle Mic (Correctly handles the boolean flip)
  const toggleMute = () => {
    const newMuteState = !isMuted;
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !newMuteState; // enabled=true means NOT muted
      });
      setIsMuted(newMuteState);
    }
  };

  // ✅ FIXED: Toggle Video (Correctly handles the boolean flip)
const turnCameraOff = () => {
  const stream = localStreamRef.current;
  if (!stream) return;

  const videoTrack = stream.getVideoTracks()[0];
  if (!videoTrack) return;

  // Stop hardware (kills camera light)
  videoTrack.stop();

  // Remove from stream
  stream.removeTrack(videoTrack);

  // Remove from PeerConnection
  const sender = pcRef.current
    ?.getSenders()
    .find(s => s.track?.kind === "video");

  if (sender) {
    pcRef.current?.removeTrack(sender);
  }

  setIsVideoOff(true);
};


const turnCameraOn = async () => {
  try {
    // Re-acquire camera
    const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const newVideoTrack = newStream.getVideoTracks()[0];
    if (!newVideoTrack || !localStreamRef.current) return;

    // Add to local stream
    localStreamRef.current.addTrack(newVideoTrack);

    // Update local preview
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
      await localVideoRef.current.play().catch(() => {});
    }

    // Attach to PeerConnection
    const sender = pcRef.current
      ?.getSenders()
      .find(s => s.track?.kind === "video");

    if (sender) {
      await sender.replaceTrack(newVideoTrack);
    } else {
      pcRef.current?.addTrack(newVideoTrack, localStreamRef.current);
    }

    setIsVideoOff(false);
  } catch (err) {
    console.error("Failed to turn camera on:", err);
    toast.error("Could not turn camera back on");
  }
};


const toggleVideo = async () => {
  if (isVideoOff) {
    await turnCameraOn();
  } else {
    turnCameraOff();
  }
};


  const setupWithStream = async (stream: MediaStream) => {
    localStreamRef.current = stream; // Store for cleanup
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    const pc = createPeerConnection();
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    // Flush buffers...
    pendingIceCandidates.current.forEach((c) => pc.addIceCandidate(new RTCIceCandidate(c)));
    pendingIceCandidates.current = [];

    if (pendingOffer.current) {
      await pc.setRemoteDescription(new RTCSessionDescription(pendingOffer.current));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current?.emit("webrtc:answer", { roomId, answer });
      pendingOffer.current = null;
    }
    if (pendingAnswer.current) {
      await pc.setRemoteDescription(new RTCSessionDescription(pendingAnswer.current));
      pendingAnswer.current = null;
    }

    socketRef.current?.emit("join-room", { roomId });
  };

  useEffect(() => {
    socketRef.current = getSocket();
    socketRef.current?.on("connect", () => {
      if (pcRef.current && roomId) socketRef.current?.emit("join-room", { roomId });
    });
    return () => { socketRef.current?.off("connect"); };
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    const onIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      const pc = pcRef.current;
      if (!pc) { pendingIceCandidates.current.push(candidate); return; }
      try { await pc.addIceCandidate(new RTCIceCandidate(candidate)); } catch (e) { console.error(e); }
    };
    const onJoinedRoom = () => setStatus("joined");
    const onPeerJoined = async () => {
      setPeerConnected(true);
      const pc = pcRef.current;
      if (!pc) return;
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      socketRef.current?.emit("webrtc:offer", { roomId, offer });
    };
    const handleOffer = async (offer: RTCSessionDescriptionInit) => {
      const pc = pcRef.current!;
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socketRef.current?.emit("webrtc:answer", { roomId, answer });
      setPeerConnected(true);
    };
    const onOffer = async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
      const pc = pcRef.current;
      if (!pc) { pendingOffer.current = offer; return; }
      await handleOffer(offer);
    };
    const onAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      const pc = pcRef.current;
      if (!pc) { pendingAnswer.current = answer; return; }
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    };

    const s = socketRef.current;
    s?.on("webrtc:ice-candidate", onIceCandidate);
    s?.on("joined-room", onJoinedRoom);
    s?.on("peer-joined", onPeerJoined);
    s?.on("webrtc:offer", onOffer);
    s?.on("webrtc:answer", onAnswer);

    return () => {
      s?.off("webrtc:ice-candidate", onIceCandidate);
      s?.off("joined-room", onJoinedRoom);
      s?.off("peer-joined", onPeerJoined);
      s?.off("webrtc:offer", onOffer);
      s?.off("webrtc:answer", onAnswer);
    };
  }, [roomId]);

  useEffect(() => {
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        await setupWithStream(stream);
      } catch (err) {
        toast.error("Media access denied.");
      }
    };
    start();

    // ✅ HARD CLEANUP: Stop tracks immediately on unmount
    return () => {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => {
            track.stop(); // This kills the hardware light
        });
        localStreamRef.current = null;
      }
    };
  }, [roomId]);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("webrtc:ice-candidate", { roomId, candidate: event.candidate });
      }
    };
    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setPeerConnected(true);
      }
    };
    pcRef.current = pc;
    return pc;
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#020202] font-sans overflow-hidden">
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-black/20">
        
        <div className="w-full max-w-5xl flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("h-2 w-2 rounded-full", peerConnected ? "bg-emerald-500" : "bg-red-500 animate-pulse")} />
            <h1 className="text-sm font-black uppercase text-slate-600 dark:text-slate-300 tracking-tighter">
              Session {roomId}
            </h1>
          </div>
          <Badge className="font-bold">{peerConnected ? "LIVE" : "WAITING"}</Badge>
        </div>

        <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/5">
          {!peerConnected && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
               <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Waiting for peer...</p>
            </div>
          )}
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
          
          <div className="absolute top-4 right-4 w-32 md:w-48 aspect-video bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-2xl border-2 border-white dark:border-white/10">
            {isVideoOff ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                <VideoOff size={20} className="text-slate-400" />
              </div>
            ) : (
              <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 bg-white dark:bg-slate-900/90 p-4 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl">
          <ControlButton icon={isMuted ? <MicOff /> : <Mic />} active={!isMuted} onClick={toggleMute} />
          <ControlButton icon={isVideoOff ? <VideoOff /> : <Video />} active={!isVideoOff} onClick={toggleVideo} />
          
          <button 
            onClick={() => navigate(-1)}
            className="h-11 px-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 rounded-xl text-white font-bold text-sm transition-all"
          >
            <PhoneOff size={18} />
            <span>End</span>
          </button>
        </div>
      </main>

      {/* Chat sidebar remains as is... */}
    </div>
  );
};

const ControlButton = ({ icon, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "h-11 w-11 rounded-xl flex items-center justify-center transition-all border",
      active ? "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white border-slate-200" : "bg-red-50 text-red-600 border-red-200"
    )}
  >
    {icon}
  </button>
);

const ChatMessage = ({ user, message, isMe }: any) => (
    <div className={cn("flex flex-col gap-1", isMe ? "items-end" : "items-start")}>
      <span className="text-[10px] font-black uppercase text-slate-400">{user}</span>
      <div className={cn("max-w-[85%] p-3 rounded-2xl text-sm", isMe ? "bg-blue-600 text-white" : "bg-slate-100 dark:bg-slate-900")}>
        {message}
      </div>
    </div>
  );

export default VideoRoom;