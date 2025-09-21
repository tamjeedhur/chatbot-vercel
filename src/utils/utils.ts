export const extractErrorMessage = (error: any): string => {
    if (error?.response?.data?.error?.message) {
      return error.response.data.error.message;
    }
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  };