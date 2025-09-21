import useCopyFromClipboard from '@/hooks/useCopyFromClipboard'
import { Flex } from '@chakra-ui/react'
import { IconButton, Tooltip } from '@mui/material'
import { GridRenderCellParams } from '@mui/x-data-grid'
import React, { useState, useRef } from 'react'
import { MdCheck, MdClear, MdContentCopy, MdDelete, MdFileDownload, MdRemoveRedEye, MdStop } from 'react-icons/md'
import { PageData } from '../searchBar/ScrapperContent/SearchBarScrapper'
import { Loader } from 'lucide-react'

const TableAction = ({ row, handleScrapedUrlSelection, handleDeleteScrapedUrl, handleWebsiteScrape, scrapedUrlsData }: GridRenderCellParams &  { handleScrapedUrlSelection: (url: string) => void, handleDeleteScrapedUrl: (url: string) => void, handleWebsiteScrape: (url: string, abortController?: AbortController) => Promise<void>, scrapedUrlsData: {[url: string]: PageData[]}}) => {
  
  const { copyToClipboard, isCopied} = useCopyFromClipboard()
  const [isScraping, setIsScraping] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  const handleAbort = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
      setIsScraping(false)
    }
  }

  return (
      <Flex flexGrow={1} justifyContent="center" alignItems="center" columnGap="5px">
        {
          isScraping ? 
          <>
            <Tooltip title="Abort">
            <IconButton aria-label="abort" onClick={(e) => {
              e.stopPropagation()
              handleAbort()
            }}>
              <MdClear />
            </IconButton>
            </Tooltip>
            <div className='animate-spin flex justify-center items-center'><Loader /></div> 
          </> 
          :
          
            scrapedUrlsData[row.url] && scrapedUrlsData[row.url].length > 0 ?
            (
             <>
                 <IconButton aria-label="preview" onClick={(e) => {
                  e.stopPropagation()
                  handleScrapedUrlSelection(row.url)
                }}>
                  <MdRemoveRedEye />
                </IconButton>
                <IconButton aria-label="Scrape" onClick={async (e) => {
                e.stopPropagation()
                setIsScraping(true)
                abortControllerRef.current = new AbortController()
                try {
                  await handleWebsiteScrape(row.url, abortControllerRef.current)
                } catch (error) {
                  if (error instanceof Error && error.name === 'AbortError') {
                    console.log('Request aborted')
                  } else {
                    console.error('Error during scraping:', error)
                  }
                }
                setIsScraping(false)
                abortControllerRef.current = null
              }}>
                <MdFileDownload />
             </IconButton>
             </>
            )
            
            :(
             <IconButton aria-label="Scrape" onClick={async (e) => {
               e.stopPropagation()
               setIsScraping(true)
               abortControllerRef.current = new AbortController()
               try {
                 await handleWebsiteScrape(row.url, abortControllerRef.current)
               } catch (error) {
                 if (error instanceof Error && error.name === 'AbortError') {
                   console.log('Request aborted')
                 } else {
                   console.error('Error during scraping:', error)
                 }
               }
               setIsScraping(false)
               abortControllerRef.current = null
             }}>
               <MdFileDownload />
             </IconButton>
            )  
           
        }
      <IconButton aria-label="Content copy" onClick={(e) => {
        e.stopPropagation()
        copyToClipboard(row.url)
      }}>
        {isCopied ? <MdCheck /> : <MdContentCopy />}
      </IconButton>

      <IconButton aria-label="Delete" onClick={(e) => {
        e.stopPropagation()
        handleDeleteScrapedUrl(row.url)
      }}>
        <MdDelete />
      </IconButton>
    </Flex>
  )
}

export default TableAction