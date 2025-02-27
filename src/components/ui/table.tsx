// table.tsx
import React from 'react';

export interface TableProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white dark:bg-gray-800">{children}</table>
  </div>
);

export const TableHeader: React.FC<TableProps> = ({ children }) => (
  <thead className="bg-gray-200 dark:bg-gray-700">{children}</thead>
);

export const TableBody: React.FC<TableProps> = ({ children }) => (
  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>
);

export const TableRow: React.FC<TableProps> = ({ children }) => (
  <tr className="hover:bg-gray-100 dark:hover:bg-gray-600">{children}</tr>
);

export const TableHead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
    {children}
  </th>
);

export const TableCell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
    {children}
  </td>
);
