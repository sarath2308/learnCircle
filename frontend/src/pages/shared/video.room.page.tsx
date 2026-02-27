/* eslint-disable no-undef */
import { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getSocket } from "@/socket/socket";
import toast from "react-hot-toast";

const VideoRoom = () => {
   const { roomId } = useParams<string>();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode");
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [peerConnected, setPeerConnected] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const socketRef = useRef<any>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const pendingIceCandidates = useRef<RTCIceCandidateInit[]>([]);

  const createPeerConnection = useCallback(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    // 🔥 Proper negotiation handling
    pc.onnegotiationneeded = async () => {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socketRef.current?.emit("webrtc:offer", { roomId, offer });
      } catch (err) {
        console.error("Negotiation error:", err);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("webrtc:ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    pc.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        remoteVideoRef.current.play().catch(() => {});
        setPeerConnected(true);
      }
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        setPeerConnected(false);
      }
    };

    pcRef.current = pc;
    return pc;
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      navigate(-1);
      return;
    }

    socketRef.current = getSocket();
    const socket = socketRef.current;

    const startSession = async () => {
      try {
        // 1️⃣ Get Media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // 2️⃣ Create Peer Connection
        const pc = createPeerConnection();
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));

        // 3️⃣ Signaling Handlers

        const onOffer = async ({ offer }: any) => {
          await pc.setRemoteDescription(new RTCSessionDescription(offer));

          // Flush buffered ICE
          for (const candidate of pendingIceCandidates.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingIceCandidates.current = [];

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("webrtc:answer", { roomId, answer });
        };

        const onAnswer = async ({ answer }: any) => {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));

          // Flush buffered ICE
          for (const candidate of pendingIceCandidates.current) {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          }
          pendingIceCandidates.current = [];
        };

        const onIceCandidate = async ({ candidate }: any) => {
          if (!pc.remoteDescription) {
            pendingIceCandidates.current.push(candidate);
            return;
          }

          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate));
          } catch (err) {
            console.error("ICE error:", err);
          }
        };

        const onPeerLeft = () => {
          toast.error("Stranger left");
          setPeerConnected(false);

          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
          }
        };

        // 4️⃣ Attach Listeners
        socket.on("webrtc:offer", onOffer);
        socket.on("webrtc:answer", onAnswer);
        socket.on("webrtc:ice-candidate", onIceCandidate);
        socket.on("peer-left", onPeerLeft);

        // 5️⃣ Join Room (ONLY AFTER everything ready)
        const joinEvent = mode === "match" ? "join-match-room" : "join-room";
        socket.emit(joinEvent, { roomId });
      } catch (err: any) {
        console.error("Init error:", err);

        if (err.name === "NotAllowedError") {
          toast.error("Camera/Mic permission denied");
        } else {
          toast.error("Failed to access media devices");
        }
      }
    };

    startSession();

    return () => {
      const leaveEvent = mode === "match" ? "leave-match-room" : "leave-room";
      socket.emit(leaveEvent, { roomId });

      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off("webrtc:ice-candidate");
      socket.off("peer-left");

      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
        localStreamRef.current = null;
      }
    };
  }, [roomId, mode, navigate, createPeerConnection]);

  const toggleMute = () => {
    const newState = !isMuted;
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(
        (t) => (t.enabled = !newState)
      );
      setIsMuted(newState);
    }
  };

  const toggleVideo = () => {
    const nextEnabled = isVideoOff;
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(
        (t) => (t.enabled = nextEnabled)
      );
      setIsVideoOff(!nextEnabled);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-[#020202] font-sans overflow-hidden">
      <main className="relative flex-1 flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-black/20">
        <div className="w-full max-w-5xl flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "h-2 w-2 rounded-full",
                peerConnected ? "bg-emerald-500" : "bg-red-500 animate-pulse",
              )}
            />
            <h1 className="text-sm font-black uppercase text-slate-600 dark:text-slate-300 tracking-tighter">
              Session {roomId}
            </h1>
          </div>
          <Badge className="font-bold">{peerConnected ? "LIVE" : "WAITING"}</Badge>
        </div>

        <div className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-200 dark:border-white/5">
          {!peerConnected && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm">
              <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                Waiting for peer...
              </p>
            </div>
          )}
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />

          {/* Local Video Overlay */}
          <div className="absolute top-4 right-4 w-32 md:w-48 aspect-video rounded-xl overflow-hidden border-2 border-white/10 shadow-lg bg-slate-800">
            <div
              className={cn(
                "absolute inset-0 flex items-center justify-center bg-slate-800 transition-opacity",
                isVideoOff ? "opacity-100 z-10" : "opacity-0 -z-1",
              )}
            >
              <VideoOff size={20} className="text-slate-500" />
            </div>
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={cn("w-full h-full object-cover", isVideoOff && "invisible")}
            />
          </div>
        </div>

        <div className="mt-8 flex items-center gap-4 bg-white dark:bg-slate-900/90 p-4 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-xl">
          <ControlButton
            icon={isMuted ? <MicOff /> : <Mic />}
            active={!isMuted}
            onClick={toggleMute}
          />
          <ControlButton
            icon={isVideoOff ? <VideoOff /> : <Video />}
            active={!isVideoOff}
            onClick={toggleVideo}
          />

          <button
            onClick={() => navigate(-1)}
            className="h-11 px-6 flex items-center gap-2 bg-red-500 hover:bg-red-600 rounded-xl text-white font-bold text-sm transition-all"
          >
            <PhoneOff size={18} />
            <span>End</span>
          </button>
        </div>
      </main>
    </div>
  );
};

const ControlButton = ({ icon, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "h-11 w-11 rounded-xl flex items-center justify-center transition-all border",
      active
        ? "bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-white border-slate-200"
        : "bg-red-50 text-red-600 border-red-200",
    )}
  >
    {icon}
  </button>
);

export default VideoRoom;
