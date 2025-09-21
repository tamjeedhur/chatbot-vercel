'use client';
import React from 'react';

import axios from 'axios';
import { ChangeEvent, useEffect, useState } from 'react';
// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button, Flex } from '@chakra-ui/react';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import ServerSideToolbar from './ServerSideToolbar';

//** Custom Component
import { SkeletonText } from '@chakra-ui/react';
import { Checkbox } from '@mui/material'; // Import Checkbox component
import IconButton from '@mui/material/IconButton'; // Import IconButton component

import { MdContentCopy, MdDelete, MdEdit, MdPreview, MdRemoveRedEye, MdSwapHoriz } from 'react-icons/md';
import QuickSearchToolbar from './ServerSideToolbar';
import TableAction from './TableAction';
import { PageData } from '../searchBar/ScrapperContent/SearchBarScrapper';

const escapeRegExp = (value: string) => {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

const TableSort = ({
  isLoading,
  scrapedUrls,
  scrapedUrlsData,
  handleScrapedUrlSelection,
  handleDeleteScrapedUrl,
  handleWebsiteScrape,
}: {
  isLoading: boolean;
  scrapedUrls: string[];
  scrapedUrlsData: { [url: string]: PageData[] };
  handleScrapedUrlSelection: (url: string) => void;
  handleDeleteScrapedUrl: (url: string) => void;
  handleWebsiteScrape: (url: string, abortController?: AbortController) => Promise<void>;
}) => {
  const [isNameSortable, setIsNameSortable] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [searchText, setSearchText] = useState<string>('');
  const [filteredData, setFilteredData] = useState<{ id: number; url: string }[]>([]);
  const [loadingSkeletons, setLoadingSkeletons] = useState<React.ReactElement[]>([]);

  const [selectedRowUrls, setSelectedRowUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectionChange = (selectionModel: any) => {
    const selectedUrls = selectionModel.map((index: number) => {
      const selectedRow = modifiedScrapedUrls.find((row: any) => row.id === index);
      return selectedRow ? selectedRow.url : null;
    });

    setSelectedRowUrls(selectedUrls.filter(Boolean)); // Filter out any null values
  };

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue);
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');

    const filteredRows = modifiedScrapedUrls.filter((row) => {
      return searchRegex.test(row.url.toString());
    });

    if (searchValue.length) {
      setFilteredData(filteredRows);
    } else {
      setFilteredData([]);
    }
  };

  const modifiedScrapedUrls = scrapedUrls.map((url, index) => ({
    id: index,
    url: url,
  }));

  const scrapeWebsite = async () => {
    console.log('Scraping initiated...');

    if (selectedRowUrls.length > 0) {
      console.log('Selected URLs:', selectedRowUrls);

      try {
        setLoading(true);

        const response = await axios.post('http://localhost:3000/api/crawl-website', {
          urls: selectedRowUrls,
        });

        console.log('After POST request...');

        // Handle the API response here
        const scrapedData = response.data;

        // Process the scraped data as needed
        console.log('Scraped Data:', scrapedData);
      } catch (error) {
        console.error('Error scraping website:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Generate loading skeletons
    const skeletonRows = Array.from({ length: 2 }, (_, index) => (
      <Flex key={index} style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox disabled />
        <Box style={{ width: '80%' }}>
          <SkeletonText mt='1' noOfLines={2} spacing='2' />
        </Box>
        <Flex columnGap='5px'>
          <IconButton aria-label='Edit' disabled>
            <MdContentCopy />
          </IconButton>

          <IconButton aria-label='Delete' disabled>
            <MdDelete />
          </IconButton>
        </Flex>
      </Flex>
    ));

    setLoadingSkeletons(skeletonRows);
  }, [scrapedUrls]);

  // console.log(scrapedUrls);
  const columns: GridColDef[] = [
    {
      flex: 0.275,
      minWidth: 290,
      field: 'url',
      headerName: 'URL',
      sortable: isNameSortable,
      renderCell: (params: GridRenderCellParams) => {
        const { row } = params;

        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography
                noWrap
                variant='body2'
                sx={{
                  color: 'var(--chakra-colors-secondaryGray-900)',
                  fontWeight: 600,
                }}>
                {row.url}
              </Typography>
            </Box>
          </Box>
        );
      },
    },

    {
      flex: 0.2,
      maxWidth: 250,
      width: 150,
      field: 'Action',
      headerName: 'ACTIONS',
      sortable: isNameSortable,
      renderCell: (params: GridRenderCellParams) => {
        // const status = statusObj[params.row.status];
        return (
          <TableAction
            scrapedUrlsData={scrapedUrlsData}
            handleScrapedUrlSelection={handleScrapedUrlSelection}
            handleDeleteScrapedUrl={handleDeleteScrapedUrl}
            handleWebsiteScrape={handleWebsiteScrape}
            {...params}
          />
        );
      },
    },
  ];

  return (
    <Card style={{ borderRadius: '20px', width: '100%', marginTop: '100px' }}>
      <Box>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          // height="40px"
          position='relative'>
          {/* {selectedRows.length > 0 && ( */}
          <Button
            width='80px'
            border='1px solid transparent'
            borderRadius='20px'
            justifyContent='space-around'
            alignItems='center'
            boxShadow={'14px 17px 40px 4px rgba(112, 144, 176, 0.18)'}
            position='absolute'
            top='15px'
            right='100px'
            zIndex={1}
            background='blue'
            color='white'
            onClick={scrapeWebsite}
            disabled={loading || isLoading}>
            {/* /* <RefreshIcon style={{ color: "green", cursor: "pointer" }} />
              <MoreVertOutlinedIcon style={{ color: "grey" }} />
              <DeleteOutlineOutlinedIcon
                style={{ color: "red", cursor: "pointer" }}
              /> 
             {loading ? (
                <CircularProgress size={20} color="inherit" /> // Render the loader
              ) : (
                "Scrap"
              )} */}
            scrap
          </Button>
          {/* )} */}
        </Box>
        {isLoading ? (
          <>
            <QuickSearchToolbar
              loading={loading || isLoading}
              clearSearch={() => setSearchText('')}
              value={searchText}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
            />

            <div>{loadingSkeletons}</div>
          </>
        ) : scrapedUrls.length > 0 ? (
          <DataGrid
            style={{
              background: 'white',
              borderRadius: '20px',
              border: 'none',
              color: 'var(--chakra-colors-secondaryGray-900)',
            }}
            autoHeight
            columns={columns}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            pageSizeOptions={[7, 10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            slots={{
              toolbar: ServerSideToolbar,
            }}
            // rows={modifiedScrapedUrls}
            rows={filteredData.length ? filteredData : modifiedScrapedUrls}
            slotProps={{
              toolbar: {
                value: searchText,
                selectedRows: 'selectedRows.length',
                clearSearch: () => handleSearch(''),
                onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
              },
            }}
          />
        ) : (
          <Box>
            <QuickSearchToolbar
              loading={loading || isLoading}
              clearSearch={() => setSearchText('')}
              value={searchText}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
            />
            <Box p='16px 40px'>No data found.</Box>
          </Box>
        )}
      </Box>
    </Card>
  );
};

export default TableSort;
