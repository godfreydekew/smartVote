
import apiClient from '@/api/config';

const kycService = {
  startVerification: async (userId: string) => {
    // Original code commented out for simulation
    const response = await apiClient.post('/kyc/start', { userId });
    return response.data;

    // --- Simulation Code ---
    console.log("Simulating KYC start verification...");
    const fakeSessionId = `simulated_${Date.now()}`;
    const fakeVerificationUrl = `/kyc-callback?sessionId=${fakeSessionId}`;

    // Return a promise that resolves with the fake URL after a short delay
    // return new Promise(resolve => {
    //     setTimeout(() => {
    //         console.log(`Simulating start verification with URL: ${fakeVerificationUrl}`);
    //         resolve({
    //             sessionId: fakeSessionId,
    //             verificationUrl: fakeVerificationUrl,
    //         });
    //     }, 1000); // 1 second delay
    // });
    // --- End Simulation Code ---
  },

  getVerificationResult: async (sessionId: string) => {
    // Original code commented out for simulation
    const response = await apiClient.get(`/kyc/result/${sessionId}`);
    return response.data;

    // --- Simulation Code ---
    console.log("Simulating KYC result fetch...");
    const statuses = ['Approved', 'Rejected', 'Pending'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    // Return a promise that resolves with a random status after a short delay
    return new Promise(resolve => {
      setTimeout(() => {
        console.log(`Simulating with status: ${randomStatus}`);
        resolve({ status: randomStatus });
      }, 1500); // 1.5 second delay to simulate network request
    });
    // --- End Simulation Code ---
  },
};

export default kycService;
