'use client';

import { FaTrashAlt, FaEye, FaFilePdf, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import { useEffect, useState } from 'react';
// import Loading from "@/app/loading";
import axiosInstance from '@/lib/axiosInstance';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { Invoice } from '@/types/interfaces';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

interface ExtendedSession extends Session {
  accessToken?: string;
  refreshToken?: string;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    accessToken?: string;
    refreshToken?: string;
  };
}

const Invoices = () => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [subscriptionId, setSubscriptionId] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchInvoices = async () => {
    try {
      const accessToken = session?.accessToken || session?.user?.accessToken;

      if (!accessToken) {
        showToast('No access token found', 'error');
        setLoading(false);
        return;
      }

      const response = await axiosInstance.get('/api/invoices', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setInvoices(response.data.data);
      setFilteredInvoices(response.data.data);
      setLoading(false);
    } catch (error) {
      showToast('Error fetching invoices', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Search & Filter logic
  useEffect(() => {
    let filtered = invoices;

    if (search) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.account_name.toLowerCase().includes(search.toLowerCase()) ||
          invoice.customer_email.toLowerCase().includes(search.toLowerCase()) ||
          invoice.customer_name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((invoice) => invoice.status.toLowerCase() === statusFilter);
    }

    setFilteredInvoices(filtered);
  }, [search, statusFilter, invoices]);

  const paginatedInvoices = filteredInvoices.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalPages = Math.ceil(filteredInvoices.length / rowsPerPage);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const renderStatusBadge = (status: string) => {
    const badgeClasses = status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200';
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${badgeClasses}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleCreateInvoice = async () => {
    try {
      const accessToken = session?.accessToken || session?.user?.accessToken;

      if (!accessToken) {
        showToast('No access token found', 'error');
        return;
      }

      const response = await axiosInstance.post(
        '/api/invoices',
        {
          customerId,
          subscriptionId,
          amount: parseFloat(amount),
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      showToast('Invoice created successfully', 'success');
      setIsModalOpen(false);
      setCustomerId('');
      setSubscriptionId('');
      setAmount('');
      setDescription('');
      fetchInvoices();
    } catch (error) {
      showToast('Error creating invoice', 'error');
    }
  };

  // if (loading) {
  //   return <Loading />;
  // }

  return (
    <AdminLayout>
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
            toast.type === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white'
              : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
          }`}>
          <div className='flex items-center gap-3'>
            <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-white' : 'bg-white'}`}></div>
            <span className='font-medium'>{toast.message}</span>
          </div>
        </div>
      )}

      <div className='min-h-screen bg-background p-6'>
        <div className='max-w-7xl mx-auto'>
          {/* Header Section */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-slate-900 dark:text-white mb-2'>Invoice Management</h1>
            <p className='text-slate-600 dark:text-slate-400'>Manage and track all your invoices in one place</p>
          </div>

          {/* Main Content Card */}
          <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden'>
            {/* Controls Section */}
            <div className='p-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700'>
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
                <button
                  className='inline-flex items-center gap-3 bg-primary text-white dark:text-black font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200'
                  onClick={() => setIsModalOpen(true)}>
                  <FaPlus className='w-4 h-4' />
                  Create Invoice
                </button>

                <div className='flex flex-col sm:flex-row gap-3'>
                  <div className='relative'>
                    <FaSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                    <input
                      type='text'
                      placeholder='Search invoices...'
                      className='w-full sm:w-64 pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>

                  <div className='relative'>
                    <FaFilter className='absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4' />
                    <select
                      className='w-full sm:w-48 pl-10 pr-4 py-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm appearance-none'
                      onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value=''>All Status</option>
                      <option value='paid'>Paid</option>
                      <option value='open'>Open</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section with proper overflow handling */}
            <div className='overflow-hidden'>
              <div className='overflow-x-auto'>
                <div className='inline-block min-w-full align-middle'>
                  <table className='min-w-full'>
                    <thead>
                      <tr className='bg-slate-50 dark:bg-slate-700/50'>
                        {['Account Name', 'Amount Due', 'Amount Paid', 'Currency', 'Customer Name', 'Customer Email', 'Status', 'Actions'].map(
                          (heading) => (
                            <th
                              key={heading}
                              className='px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider whitespace-nowrap'>
                              {heading}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-slate-200 dark:divide-slate-700'>
                      {paginatedInvoices.length > 0 ? (
                        paginatedInvoices.map((invoice, index) => (
                          <tr key={index} className='hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors duration-150'>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm font-medium text-slate-900 dark:text-white'>{invoice.account_name}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm font-semibold text-slate-900 dark:text-white'>${(invoice.amount_due / 100).toFixed(2)}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-slate-600 dark:text-slate-300'>${(invoice.amount_paid / 100).toFixed(2)}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-slate-600 dark:text-slate-300'>{invoice.currency.toUpperCase()}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm font-medium text-slate-900 dark:text-white'>{invoice.customer_name}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='text-sm text-slate-600 dark:text-slate-300 max-w-[200px] truncate'>{invoice.customer_email}</div>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap'>{renderStatusBadge(invoice.status)}</td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <div className='flex items-center gap-2'>
                                <button
                                  className='p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors duration-200'
                                  onClick={() => window.open(invoice.hosted_invoice_url, '_blank')}
                                  title='View Invoice'>
                                  <FaEye className='w-4 h-4' />
                                </button>
                                <button
                                  className='p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200'
                                  onClick={() => window.open(invoice.invoice_pdf, '_blank')}
                                  title='Download PDF'>
                                  <FaFilePdf className='w-4 h-4' />
                                </button>
                                <button
                                  className='p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200'
                                  title='Delete Invoice'>
                                  <FaTrashAlt className='w-4 h-4' />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className='px-6 py-12 text-center'>
                            <div className='flex flex-col items-center gap-4'>
                              <div className='w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center'>
                                <FaFilePdf className='w-8 h-8 text-slate-400' />
                              </div>
                              <div>
                                <h3 className='text-lg font-semibold text-slate-900 dark:text-white mb-2'>No invoices found</h3>
                                <p className='text-slate-600 dark:text-slate-400'>
                                  {search || statusFilter
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Get started by creating your first invoice.'}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination Section */}
            <div className='px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50'>
              <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div className='flex items-center gap-3'>
                  <span className='text-sm text-slate-600 dark:text-slate-400'>Show:</span>
                  <select
                    className='px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm'
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                  </select>
                  <span className='text-sm text-slate-600 dark:text-slate-400'>entries</span>
                </div>

                <div className='flex items-center gap-4'>
                  <span className='text-sm text-slate-600 dark:text-slate-400'>
                    {`${(currentPage - 1) * rowsPerPage + 1} - ${Math.min(currentPage * rowsPerPage, filteredInvoices.length)} of ${
                      filteredInvoices.length
                    } invoices`}
                  </span>

                  <div className='flex gap-2'>
                    <button
                      onClick={handlePrevious}
                      disabled={currentPage === 1}
                      className='px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'>
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentPage === totalPages}
                      className='px-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'>
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Invoice Modal */}
        {isModalOpen && (
          <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300'>
              <div className='flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700'>
                <h3 className='text-xl font-semibold text-slate-900 dark:text-white'>Create New Invoice</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200'>
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                  </svg>
                </button>
              </div>
              <div className='p-6 space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>Customer ID</label>
                  <input
                    type='text'
                    placeholder='Enter customer ID'
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className='w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>Subscription ID</label>
                  <input
                    type='text'
                    placeholder='Enter subscription ID'
                    value={subscriptionId}
                    onChange={(e) => setSubscriptionId(e.target.value)}
                    className='w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>Amount</label>
                  <input
                    type='number'
                    placeholder='Enter amount'
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className='w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2'>Description</label>
                  <input
                    type='text'
                    placeholder='Enter description'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white'
                  />
                </div>
              </div>
              <div className='flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700'>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className='px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 font-medium'>
                  Cancel
                </button>
                <button
                  onClick={handleCreateInvoice}
                  className='px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl'>
                  Create Invoice
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Invoices;
