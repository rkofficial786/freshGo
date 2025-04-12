import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonLoader = () => {
  return (
    <div className="container mx-auto mt-10">
      <div className="p-4 pt-2">
        <h2 className="text-4xl font-bold text-center mb-12">
          <Skeleton width={200} />
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton height={200} />
              <Skeleton count={2} />
              <Skeleton width={80} />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Skeleton width={120} height={40} />
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoader;