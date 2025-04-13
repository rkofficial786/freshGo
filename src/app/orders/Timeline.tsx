// components/OrderStatusTimeline.tsx
import React from 'react';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

interface OrderStatusProps {
  status: string;
}

export const OrderStatusTimeline: React.FC<OrderStatusProps> = ({ status }) => {
  const steps = [
    { id: "pending", label: "Order Placed", icon: <Package size={18} /> },
    { id: "processing", label: "Processing", icon: <Clock size={18} /> },
    { id: "shipped", label: "Shipped", icon: <Truck size={18} /> },
    { id: "delivered", label: "Delivered", icon: <CheckCircle size={18} /> },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === status);

  return (
    <div className="mt-6 mb-4">
      <h3 className="text-lg font-semibold mb-6">Order Status</h3>
      
      {/* Desktop version */}
      <div className="relative hidden md:block">
        {/* Main horizontal line */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-200"></div>
        
        {/* Progress line */}
        <div 
          className="absolute top-5 left-0 h-[2px] bg-black"
          style={{ 
            width: `${
              currentStepIndex === 0 ? '0%' : 
              currentStepIndex === 1 ? '33%' : 
              currentStepIndex === 2 ? '66%' : 
              currentStepIndex === 3 ? '100%' : '0%'
            }`
          }}
        ></div>
        
        {/* Steps */}
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="text-center relative">
              <div 
                className={`w-10 h-10 mr-auto rounded-full flex items-center justify-center ${
                  index <= currentStepIndex ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                } z-10 relative`}
              >
                {step.icon}
              </div>
              <p 
                className={`mt-2 text-xs ${
                  index <= currentStepIndex ? "text-black font-medium" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Mobile version - vertical timeline */}
      <div className="md:hidden">
        <div className="relative">
          {/* Main vertical line */}
          <div className="absolute top-0 bottom-0 left-5 w-[2px] bg-gray-200"></div>
          
          {/* Progress line */}
          <div 
            className="absolute top-0 left-5 w-[2px] bg-black"
            style={{ 
              height: `${
                currentStepIndex === 0 ? '10%' : 
                currentStepIndex === 1 ? '38%' : 
                currentStepIndex === 2 ? '65%' : 
                currentStepIndex === 3 ? '100%' : '0%'
              }`
            }}
          ></div>
          
          {/* Steps */}
          {steps.map((step, index) => (
            <div key={step.id} className="relative mb-8 last:mb-0 flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  index <= currentStepIndex ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                } z-10`}
              >
                {step.icon}
              </div>
              <p 
                className={`ml-4 text-sm ${
                  index <= currentStepIndex ? "text-black font-medium" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};