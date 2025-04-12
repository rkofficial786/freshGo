const ProductSkeleton = () => (
    <div className="animate-pulse flex flex-col lg:flex-row gap-12">
        <div className="w-full lg:w-1/2">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="mt-4 flex gap-2">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-gray-300 w-20 h-20 rounded-lg"></div>
                ))}
            </div>
        </div>
        <div className="w-full lg:w-1/2 space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-20 bg-gray-300 rounded"></div>
            <div className="flex gap-4">
                <div className="h-10 bg-gray-300 rounded w-1/3"></div>
                <div className="h-10 bg-gray-300 rounded w-1/3"></div>
            </div>
            <div className="h-40 bg-gray-300 rounded"></div>
        </div>
    </div>
);


export default ProductSkeleton