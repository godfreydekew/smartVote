import { Identity } from "@semaphore-protocol/identity";

/**
 * Creates a new Semaphore identity for anonymous voting
 * @returns The identity commitment (public value to send to backend)
 */
export const createSemaphoreIdentity = (): string => {
  // This creates the trapdoor and nullifier secrets and derives the commitment
  const identity = new Identity();
  

  // TODO: Store this PRIVATELY. This is their key to anonymous voting.
  localStorage.setItem("semaphoreIdentity", identity.toString());
  
  const identityCommitment = identity.commitment.toString();
  console.log("User's Identity Commitment:", identityCommitment);
  
  return identityCommitment;
};

/**
 * Retrieves the stored Semaphore identity from localStorage
 * @returns The stored identity string or null if not found
 */
export const getStoredSemaphoreIdentity = (): string | null => {
  return localStorage.getItem("semaphoreIdentity");
};

/**
 * Gets the identity commitment from stored identity
 * @returns The identity commitment or null if no identity is stored
 */
export const getIdentityCommitment = (): string | null => {
  const storedIdentity = getStoredSemaphoreIdentity();
  if (!storedIdentity) {
    return null;
  }
  
  try {
    const identity = new Identity(storedIdentity);
    return identity.commitment.toString();
  } catch (error) {
    console.error("Error generating commitment from stored identity:", error);
    return null;
  }
};
