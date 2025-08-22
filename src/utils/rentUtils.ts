export const checkRentalStatus = async (userId:string, bookId:string) => {
    try {
      const response = await fetch(`https://yeeplatformbackend.azurewebsites.net/getrentalstatus/${userId}/${bookId}`);
      const data = await response.json();
      return data.paid;
    } catch (error) {
      console.error('Error checking rental status:', error);
      return false;
    }
  };