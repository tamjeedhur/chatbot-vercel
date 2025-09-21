import useCopyFromClipboard from '@/hooks/useCopyFromClipboard';
import React, { useMemo } from 'react'
import { PageData } from './SearchBarScrapper';
import { Textarea, useColorModeValue } from '@chakra-ui/react';

const ScrapperContentPreview = ({data, isLoading}:{data: PageData[] | undefined, isLoading: boolean}) => {
  const {isCopied, copyToClipboard} = useCopyFromClipboard();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const bgColor = useColorModeValue("white", "navy.800");
  const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");
  
  const scrapperContent = useMemo(() => {
    if(data){
      return data?.map((item) => item.pageContent + "\n" + item.metadata.text).join("\n")
    }
    return ""
  }, [data])
  const noData = useMemo(() => {
    if(data){
      return data.length === 0
    }
    return false
  }, [data])
  return (
    <div className={`border border-gray-300 rounded-lg shadow-md p-6 w-full bg-white my-5 mx-3 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
    {/* Copy to Clipboard Button */}
    {
      !noData && data && data.length > 0 && (
        <div className="flex justify-between items-center mb-2">
      <a
        href={isLoading ? "" : data[0].metadata.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-blue-500 hover:underline text-sm ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        Source
      </a>
      <button
        onClick={() => copyToClipboard(scrapperContent)}
        disabled={isLoading || isCopied}
        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCopied ? "Copied!" : "Copy"}
      </button>
    </div>
      )
    }

    {
    <Textarea
      disabled={isLoading}
      value={isLoading ? "Loading..." : scrapperContent || "No Data Found"}
      rows={15}
      variant="main"
      color={textColor}
      bg={bgColor}
      borderColor={borderColor}
      resize="vertical"
      readOnly
     />
    }
  </div>
  )
}

export default ScrapperContentPreview