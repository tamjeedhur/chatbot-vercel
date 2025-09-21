'use client';
import React from 'react';
import { Box, Button, Grid, Text, GridItem, useColorMode, useColorModeValue } from '@chakra-ui/react';
import AdminLayout from '@/components/adminlayout/AdminLayout';
// Custom components
import Banner from '@/components/profile/Banner';
import General from '@/components/profile/General';
import Notifications from '@/components/profile/Notifications';
import Projects from '@/components/profile/Projects';
import Storage from '@/components/profile/Storage';
import Upload from '@/components/profile/Upload';
// Assets - using placeholder images since the original images don't exist
const banner = '/placeholder-banner.jpg';
const avatar = '/placeholder-avatar.jpg';
import Link from 'next/link';
import ProfileBanner from '@/app/components/ProfileBanner';
import ActivityTimeline from '@/app/components/ActivityTimeline';
import DebitCards from '@/app/components/DebitCards';
import PricingPlans from '@/app/components/PricingPlans';
import CurrentPlan from '@/app/components/CurrentPlan';
import BillingAddress from '@/app/components/BillingAddress';
import Usage from '@/app/components/invoice/Usage';
// import { ProtectedRoute } from "@/components/ProtectedRoutes";

function Profile() {
  return (
    <>
      <AdminLayout>
        <ProfileBanner />
        <Grid templateColumns={{ base: '1fr', md: '1fr 2fr' }} gap={6} mt={8}>
          <GridItem display='flex' flexDirection='column'>
            {' '}
            {/* Make this a flex container */}
            <Projects banner={banner} avatar={avatar} name='Adela Parkson' job='Product Designer' posts='17' followers='9.7k' following='274' />
          </GridItem>
          <GridItem display='flex' flexDirection='column'>
            {' '}
            {/* Make this a flex container */}
            <ActivityTimeline />
            <DebitCards />
          </GridItem>
        </Grid>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} mt={6}>
          <GridItem display='flex' flexDirection='column'>
            {' '}
            {/* Make this a flex container */}
            <Storage used={25.6} total={50} />
          </GridItem>
          <GridItem display='flex' flexDirection='column'>
            {' '}
            {/* Make this a flex container */}
            <Upload minH={{ base: 'auto', lg: '420px', '2xl': '365px' }} pe='20px' pb={{ base: '100px', lg: '20px' }} />
          </GridItem>
        </Grid>
        <PricingPlans />
        <CurrentPlan />
        <BillingAddress />
        <Usage />
      </AdminLayout>
    </>
  );
}

export default Profile;
