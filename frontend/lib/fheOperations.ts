import { ethers } from "ethers";
import { FhevmInstance } from "@/fhevm/fhevmTypes";
import { FhevmDecryptionSignature } from "@/fhevm/FhevmDecryptionSignature";
import { GenericStringStorage } from "@/fhevm/GenericStringStorage";

function normalizeInputProofBytes(params: {
  inputProof: ethers.BytesLike;
  contractAddress: `0x${string}`;
  signerAddress: string;
}): Uint8Array {
  const bytes = ethers.getBytes(params.inputProof);

  // Expected format (InputVerifier.sol):
  // inputProof = numHandles(1) + numSigners(1) + handles(32*numHandles) + signatures(65*numSigners)
  if (bytes.length < 2) {
    throw new Error(
      `FHE_INPUT_PROOF_MALFORMED: inputProof too short (len=${bytes.length}) for ${params.contractAddress} signer=${params.signerAddress}`,
    );
  }

  const numHandles = bytes[0];
  const numSigners = bytes[1];
  const expectedLen = 2 + 32 * numHandles + 65 * numSigners;

  if (bytes.length === expectedLen) {
    return bytes;
  }

  // Known local-hardhat edge: some mock/proxy stacks return signatures as 66 bytes instead of 65.
  // In that case, trimming the last byte makes InputVerifier accept the proof.
  if (bytes.length === expectedLen + 1) {
    console.warn(
      `[FHEVM] inputProof length off-by-one (got=${bytes.length}, expected=${expectedLen}). Trimming last byte for local dev.`,
      { contractAddress: params.contractAddress, signerAddress: params.signerAddress, numHandles, numSigners },
    );
    return bytes.slice(0, expectedLen);
  }

  throw new Error(
    `FHE_INPUT_PROOF_MALFORMED: inputProof len=${bytes.length} expected=${expectedLen} (handles=${numHandles}, signers=${numSigners}) for ${params.contractAddress} signer=${params.signerAddress}`,
  );
}

/**
 * Encrypts a uint32 value using FHEVM with retry logic
 */
async function encryptWithRetry(
  input: ReturnType<FhevmInstance["createEncryptedInput"]>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): Promise<Awaited<ReturnType<typeof input.encrypt>>> {
  let lastError: Error | unknown;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await input.encrypt();
    } catch (error) {
      lastError = error;
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check if it's a relayer error that might be retryable
      const isRetryable = errorMessage.includes("Relayer didn't response") ||
                         errorMessage.includes("Bad JSON") ||
                         errorMessage.includes("relayer") ||
                         errorMessage.includes("Relayer") ||
                         errorMessage.includes("network") ||
                         errorMessage.includes("timeout");
      
      if (isRetryable && attempt < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        continue;
      }
      
      // If not retryable or last attempt, throw
      throw error;
    }
  }
  
  throw lastError;
}

export async function encryptUint32Value(
  instance: FhevmInstance | undefined,
  contractAddress: `0x${string}`,
  signerAddress: string | undefined,
  value: number,
) {
  if (!instance || !signerAddress) {
    throw new Error("Missing FHE instance or signer");
  }

  try {
    const input = instance.createEncryptedInput(contractAddress, signerAddress);
    input.add32(value);
    const out = await encryptWithRetry(input);

    // Defensive: normalize proof bytes to match on-chain InputVerifier expectations (esp. local hardhat/mocks).
    const normalizedProof = normalizeInputProofBytes({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      inputProof: (out as any).inputProof,
      contractAddress,
      signerAddress,
    });

    return {
      ...out,
      inputProof: normalizedProof,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Check if it's a relayer-specific error
    const isRelayerError = errorMessage.includes("Relayer didn't response") || 
                          errorMessage.includes("Bad JSON") ||
                          (errorMessage.toLowerCase().includes("relayer") && 
                           (errorMessage.includes("response") || 
                            errorMessage.includes("unavailable") ||
                            errorMessage.includes("error")));
    
    if (isRelayerError) {
      throw new Error("Relayer temporarily unavailable");
    }
    
    // Re-throw other errors as-is
    throw error;
  }
}

export async function decryptHandles(
  instance: FhevmInstance | undefined,
  contractAddress: `0x${string}`,
  signer: ethers.Signer | undefined,
  storage: GenericStringStorage,
  handles: string[],
) {
  if (!instance || !signer || handles.length === 0) {
    return {};
  }

  const signature = await FhevmDecryptionSignature.loadOrSign(
    instance,
    [contractAddress],
    signer,
    storage,
  );
  if (!signature) {
    throw new Error("Unable to create decryption signature");
  }

  const request = handles.map((handle) => ({
    handle,
    contractAddress,
  }));

  return instance.userDecrypt(
    request,
    signature.privateKey,
    signature.publicKey,
    signature.signature,
    signature.contractAddresses,
    signature.userAddress,
    signature.startTimestamp,
    signature.durationDays,
  );
}

