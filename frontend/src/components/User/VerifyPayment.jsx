import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { confirmPayment } from '../../services/orderService';
import { toast } from 'sonner';

const VerifyPayment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await confirmPayment(success, orderId);
        
        if (response.success) {
          toast.success('Payment successful! Your tickets are ready.');
          navigate('/user/tickets');
        } else {
          toast.error('Payment was not successful');
          navigate('/events');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        if (error.response?.status === 401) {
          toast.error('Session expired. Please login again');
          navigate('/login');
        } else {
          toast.error('There was an error processing your payment');
          navigate('/events');
        }
      }
    };

    verifyPayment();
  }, [success, orderId, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Verifying your payment...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default VerifyPayment;
