'use client'
import BillingAddress from "@/app/components/BillingAddress";
import Invoice from "@/app/components/invoice/Invoice";
import AdminLayout from "@/components/adminlayout/AdminLayout";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe("your_stripe_public_key");

const BillingPage = () => {
  return (
    <AdminLayout>
      {/* <BillingAddress /> */}
      <Invoice />
    </AdminLayout>
  );
};

const WrappedBillingPage = () => (
    <Elements stripe={stripePromise}>
      <BillingPage />
    </Elements>
  );
  
  export default WrappedBillingPage;
