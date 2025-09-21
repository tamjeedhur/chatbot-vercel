// ** React Imports

'use client'

import { ChangeEvent } from 'react';
import React from 'react'

// ** MUI Imports
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import { SearchIcon } from '@chakra-ui/icons';
import { CloseButton, Flex } from '@chakra-ui/react';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { ServersideToolbarProps } from '@/types/interfaces';




const QuickSearchToolbar = (props: ServersideToolbarProps) => {


  return (
    <Box borderRadius="20px"
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        p: (theme) => theme.spacing(2, 5, 2, 5),
      }}>
     
        <Box display="flex" alignItems="center" justifyContent="center" height="40px">
        {props.selectedRows > 0 && (
       <Flex width="80px" border="1px solid transparent" borderRadius="20px" justifyContent="space-around" height="30px"
       boxShadow={'14px 17px 40px 4px rgba(112, 144, 176, 0.18)'} >
      
       <RefreshIcon style={{color:'green',cursor:'pointer',}} />
          <MoreVertOutlinedIcon style={{color:'grey'}} />
       <DeleteOutlineOutlinedIcon style={{color:'red',cursor:'pointer',}}/>
   
  </Flex>
      )}
        
    </Box>
      <TextField
        disabled={props.loading}
        size='small'
        value={props.value}
        onChange={props.onChange}
        placeholder='Search…'
        InputProps={{
          startAdornment: (
            <Box sx={{ mr: 2, display: 'flex' }}>
              <SearchIcon />
            </Box>
          ),
          endAdornment: <CloseButton onClick={props.clearSearch} />,
        }}
        sx={{
          width: {
            xs: 1,
            sm: 'auto',
          },
          '& .MuiInputBase-root > svg': {
            mr: 2,
          },
        }}
      />
      
   
    </Box>
  );
};

export default QuickSearchToolbar;
