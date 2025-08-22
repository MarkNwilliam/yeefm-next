// src/utils/subscriptionUtils.js

export const checkSubscriptionStatus = async (userId:string) => {
    const url = `https://yeeplatformbackend.azurewebsites.net/isSubscribed/${userId}/`;
    try {
   //   console.log('Checking subscription status for user:', userId);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }
      const data = await response.json();
  //    console.log('Received subscription status:', data);
      return data;
    } catch (error) {
//      console.error('Error checking subscription status:', error.message);
      return null;
    }
};