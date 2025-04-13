// utils/orderUtils.ts

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };
  
  export const sortOrders = (orders: any[], sortBy: string) => {
    return [...orders].sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "status") {
        // Priority order: processing, pending, shipped, delivered, cancelled
        const statusOrder = {
          processing: 1,
          pending: 2,
          shipped: 3,
          delivered: 4,
          cancelled: 5,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return 0;
    });
  };
  
  export const getStatusBadgeColor = (status: string): string => {
    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200", 
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      default: "bg-gray-100 text-gray-800 border-gray-200"
    };
  
    return colorMap[status] || colorMap.default;
  };