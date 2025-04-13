// components/StatusBadge.tsx
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { getStatusBadgeColor } from './utils';


interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <Badge 
      variant="outline" 
      className={`${getStatusBadgeColor(status)} capitalize`}
    >
      {status}
    </Badge>
  );
};