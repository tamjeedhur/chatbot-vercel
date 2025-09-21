'use client';
import { Box, Flex } from '@chakra-ui/react';
import DataTable from './TableScrap';
import SearchBarSc from './Searchbar';
import { Dispatch, SetStateAction, useState } from 'react';
import axios from 'axios';

import TableSort from '@/components/Dashboard/TableMui';
import ScrapperContentPreview from './ScrapperContentPreview';
import ScrapperpreviewDialog from './ScrapperpreviewDialog';

interface Metadata {
  url: string;
  text: string;
  loc: {
    lines: {
      from: number;
      to: number;
    };
  };
  hash: string;
}

export interface PageData {
  pageContent: string;
  metadata: Metadata;
}

function Scrapper({
  activeButton,
  searchInputText,
  loading,
  setLoading,
}: {
  activeButton: 'Sitemap' | 'URL';
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  searchInputText: string;
}) {
  const [scrapedUrls, setScrapedUrls] = useState<string[]>([]);
  const [scrapedData, setScrapedData] = useState<PageData[] | undefined>(undefined);
  const [selectedScrapedUrl, setSelectedScrapedUrl] = useState<string | undefined>(undefined);
  const [scrapedUrlsData, setScrapedUrlsData] = useState<{ [url: string]: PageData[] }>({});
  const [searchText, setSearchText] = useState<string>(searchInputText || '');
  const handleOnSearch = (value: string) => setSearchText(value);

  const handleDeleteScrapedUrl = (url: string) => {
    setScrapedUrls(scrapedUrls.filter((u) => u !== url));
  };

  const handleScrapedUrlSelection = (url: string) => {
    setSelectedScrapedUrl(url);
  };

  const handleWebsiteScrape = async (searchInputText: string, abortController?: AbortController) => {
    try {
      const response = await axios.post<{ documents: PageData[] }>(
        'http://localhost:3000/api/crawl-website',
        { urls: [searchInputText] },
        { signal: abortController?.signal }
      );
      if (response.data && Array.isArray(response.data.documents)) {
        if (activeButton === 'URL') setScrapedData(response.data.documents);
        else if (activeButton === 'Sitemap') setScrapedUrlsData((prev) => ({ ...prev, [searchInputText]: response.data.documents }));
      } else {
        setScrapedData(undefined);
        setScrapedUrlsData((prev) => ({ ...prev, [searchInputText]: [] }));
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.name === 'CanceledError') {
        console.log('Request was cancelled');
        return;
      }
      console.error('Error scraping website:', error);
      setScrapedData(undefined);
      setScrapedUrlsData((prev) => ({ ...prev, [searchInputText]: [] }));
    }
  };

  const handleClickOnSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/crawl-urls', { url: searchInputText });

      if (response.data && Array.isArray(response.data.urls)) {
        // Assuming the response structure has a 'urls' property which is an array
        setScrapedUrls(response.data.urls);
        console.log(response.data);
      } else {
        console.error('Invalid API response:', response.data);
      }
    } catch (error) {
      console.error('Error scraping URLs:', error);
    }
    setLoading(false);
  };

  return (
    <Box w='100%' h='100%' display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
      <Flex mt='50px' width='75%'>
        <SearchBarSc
          handleOnSearch={handleOnSearch}
          handleClickOnSearch={async () => {
            (() => {
              setLoading(true);
            })();
            activeButton === 'Sitemap' ? await handleClickOnSearch() : await handleWebsiteScrape(searchText);
            (() => {
              setLoading(false);
            })();
          }}
          loading={loading}
          searchText={searchText}
          activeButton={activeButton}
        />
      </Flex>
      {activeButton === 'Sitemap' ? (
        <TableSort
          scrapedUrls={scrapedUrls}
          isLoading={loading}
          handleScrapedUrlSelection={handleScrapedUrlSelection}
          handleDeleteScrapedUrl={handleDeleteScrapedUrl}
          handleWebsiteScrape={handleWebsiteScrape}
          scrapedUrlsData={scrapedUrlsData}
        />
      ) : (
        <ScrapperContentPreview isLoading={loading} data={scrapedData} />
      )}
      {/* <DataTable scrapedUrls={scrapedUrls} isLoading={loading} /> */}
      <ScrapperpreviewDialog
        isOpen={Boolean(selectedScrapedUrl)}
        onClose={() => {
          setSelectedScrapedUrl(undefined);
          setScrapedData(undefined);
        }}>
        <ScrapperContentPreview isLoading={loading} data={scrapedUrlsData[selectedScrapedUrl || '']} />
      </ScrapperpreviewDialog>
    </Box>
  );
}

export default Scrapper;
