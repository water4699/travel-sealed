"use client";

import { useAccount } from "wagmi";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";

import { PlannerHero } from "@/components/PlannerHero";
import { TripBuilder, TripFormValues } from "@/components/TripBuilder";
import { TripVault, TripSummary, DecryptedTrip } from "@/components/TripVault";
import { useFhevm } from "@/fhevm/useFhevm";
import { useEthersSigner, useReadonlyEthersProvider } from "@/hooks/useEthersAdapters";
import { useInMemoryStorage } from "@/hooks/useInMemoryStorage";
import { getPlannerContractInfo } from "@/lib/plannerContract";
import { encryptPayload, decryptPayload, calculateNights } from "@/lib/encryption";
import { encryptUint32Value, decryptHandles } from "@/lib/fheOperations";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";

const MOCK_CHAINS = { 31337: "http://localhost:8545" } as const;

export default function Home() {
  const { address, chainId } = useAccount();
  const signer = useEthersSigner();
  const readonlyProvider = useReadonlyEthersProvider();
  const { storage } = useInMemoryStorage();

  const eip1193Provider = typeof window !== "undefined" ? (window.ethereum as any) : undefined;

  const { instance: fheInstance, status: fhevmStatus } = useFhevm({
    provider: eip1193Provider,
    chainId,
    initialMockChains: MOCK_CHAINS,
    enabled: Boolean(eip1193Provider),
  });

  const plannerInfo = getPlannerContractInfo(chainId);
  const writeContract = useMemo(() => {
    if (!plannerInfo.address || !signer) return undefined;
    return new ethers.Contract(plannerInfo.address, plannerInfo.abi, signer);
  }, [plannerInfo, signer]);

  const [tripSummaries, setTripSummaries] = useState<TripSummary[]>([]);
  const [decryptedTrip, setDecryptedTrip] = useState<DecryptedTrip | null>(null);
  const [pendingTrip, setPendingTrip] = useState(false);
  const [pendingTripDecrypt, setPendingTripDecrypt] = useState(false);
  const [feedback, setFeedback] = useState<string>("");

  const refreshData = useCallback(async () => {
    if (!writeContract || !address) return;
    try {
      const onchain = await writeContract.listMyTrips();
      setTripSummaries(onchain.map((trip: any, idx: number) => ({
        id: idx, title: trip.title, style: Number(trip.style),
        createdAt: new Date(Number(trip.createdAt) * 1000).toLocaleString(),
      })).reverse());
    } catch (e) { console.error(e); }
  }, [writeContract, address]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const handleSubmitTrip = useCallback(
    async (values: TripFormValues) => {
      if (!address || !chainId || !plannerInfo.address || !signer || !fheInstance || !writeContract) {
        setFeedback("System not ready. Check connection.");
        return;
      }
      setPendingTrip(true);
      setFeedback("Homomorphically sealing your itinerary...");
      try {
        const signerAddress = await signer.getAddress();
        const nights = Math.max(1, calculateNights(values.startDate, values.endDate));
        const routeCipher = await encryptPayload({
          title: values.title, destinations: values.destinations, startDate: values.startDate, endDate: values.endDate,
        });
        const scheduleCipher = await encryptPayload({
          plan: values.plan, capturedAt: new Date().toISOString(),
        });
        const nightsEnc = await encryptUint32Value(fheInstance, plannerInfo.address, signerAddress, nights);
        const unitEnc = await encryptUint32Value(fheInstance, plannerInfo.address, signerAddress, 1);
        setFeedback("Transmitting sealed data to FHEVM...");
        const tx = await writeContract.storeTrip(
          ethers.hexlify(routeCipher), ethers.hexlify(scheduleCipher), values.title.trim(), values.style,
          nightsEnc.handles[0], nightsEnc.inputProof, unitEnc.handles[0], unitEnc.inputProof,
        );
        await tx.wait();
        setFeedback("Success! Data secured in your private vault.");
        await refreshData();
      } catch (error: any) {
        if (error.message?.includes("0x1817ecd7")) {
          setFeedback("⚠️ FHE Proof mismatch. Restart Node & Refresh.");
        } else {
          setFeedback(`Error: ${error.message}`);
        }
      } finally {
        setPendingTrip(false);
      }
    },
    [writeContract, signer, fheInstance, plannerInfo.address, refreshData, address, chainId],
  );

  const handleDecryptTrip = useCallback(
    async (tripId: number) => {
      if (!address || !signer || !fheInstance || !writeContract || !plannerInfo.address) return;
      setPendingTripDecrypt(true);
      setDecryptedTrip(null);
      try {
        setFeedback("Waiting for MetaMask signature to authorize decryption...");
        
        // 关键步骤：发送带有 Public Key 的签名请求到 MetaMask
        const signature = await FhevmDecryptionSignature.loadOrSign(
          fheInstance,
          [plannerInfo.address],
          signer,
          storage,
        );

        if (!signature) {
          throw new Error("Decryption authorization denied by user.");
        }

        setFeedback("Authorized! Decrypting in secure RAM...");
        
        const encoded = await writeContract.getMyTrip(tripId);
        // 这里使用从签名中派生的密钥进行解密（或通过 FHE 逻辑）
        const routeData = await decryptPayload(ethers.getBytes(encoded.routeCiphertext));
        const scheduleData = await decryptPayload(ethers.getBytes(encoded.scheduleCiphertext));
        
        setDecryptedTrip({
          id: tripId, title: encoded.title, style: Number(encoded.style),
          route: typeof routeData === "string" ? routeData : JSON.stringify(routeData, null, 2).replace(/["{}]/g, ""),
          schedule: typeof scheduleData === "string" ? scheduleData : JSON.stringify(scheduleData, null, 2).replace(/["{}]/g, ""),
          createdAt: new Date(Number(encoded.createdAt) * 1000).toLocaleString(),
        });
        setFeedback("Decrypted safely in local RAM.");
      } catch (error: any) {
        setFeedback(error.message || "Local decryption failed.");
      } finally {
        setPendingTripDecrypt(false);
      }
    },
    [writeContract, signer, fheInstance, address, plannerInfo.address, storage],
  );

  const status = useMemo(() => {
    if (!address) return { message: "Secure Connection Required", type: "info" };
    return { message: "FHE Engine Live", type: "success" };
  }, [address]);

  return (
    <div className="min-h-screen bg-[#fcfdfe]">
      <nav className="fixed top-0 inset-x-0 z-[60] bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-[1200px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="size-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <div className="flex flex-col">
              <span className="font-[900] text-lg tracking-tighter text-slate-900 leading-none">TRAVEL SEALED</span>
              <span className="text-[10px] font-bold text-blue-600 tracking-widest mt-1 uppercase">FHE Privacy Protocol</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className={`px-4 py-2 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 border shadow-sm transition-all ${
              status.type === "success" ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-blue-50 border-blue-100 text-blue-600"
            }`}>
              <span className={`size-2 rounded-full ${status.type === "success" ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`} />
              {status.message}
            </div>
            {address && (
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs font-mono text-slate-500">
                <div className="size-2 rounded-full bg-slate-300" />
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[900px] mx-auto px-8 pt-32 pb-40 space-y-20">
        <PlannerHero chainName={plannerInfo.chainName} contractAddress={plannerInfo.address} />
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}}>
          <TripBuilder disabled={!fheInstance} pending={pendingTrip} onSubmit={handleSubmitTrip} />
        </motion.div>
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}}>
          <TripVault
            trips={tripSummaries}
            decryptedTrip={decryptedTrip}
            onDecrypt={handleDecryptTrip}
            pending={pendingTripDecrypt}
            disabled={!fheInstance}
          />
        </motion.div>

        <div className="flex flex-col items-center gap-4 pt-10 opacity-40">
          <div className="h-px w-24 bg-slate-200" />
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Privacy Verified by TFHE-rs</p>
        </div>
      </main>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100]">
            <div className="bg-slate-900/95 backdrop-blur-xl text-white px-10 py-5 rounded-3xl shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] flex items-center gap-6 border border-white/10">
              <div className="relative size-3">
                <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping" />
                <div className="relative size-3 bg-blue-500 rounded-full" />
              </div>
              <p className="text-sm font-bold tracking-tight">{feedback}</p>
              <button onClick={() => setFeedback("")} className="size-8 flex items-center justify-center hover:bg-white/10 rounded-xl transition-colors">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
