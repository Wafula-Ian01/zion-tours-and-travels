export const convertImageToBase64 = (buffer: Buffer, mimetype: string): string => {
    return `data:${mimetype};base64,${buffer.toString('base64')}`;
  };
  
  export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };
  