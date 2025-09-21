import { useState } from "react";

const useCopyFromClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setIsCopied(false);
    }
  };

  return { isCopied, copyToClipboard };
};

export default useCopyFromClipboard;
