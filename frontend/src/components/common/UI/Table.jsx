import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

const Table = ({
  columns = [],
  data = [],
  onRowClick,
  sortable = false,
  onSort,
  sortColumn,
  sortDirection = 'asc',
  loading = false,
  emptyMessage = 'No data available',
  rowClassName = '',
  headerClassName = '',
  className = '',
  striped = true,
  hoverable = true,
  ...props
}) => {
  const handleSort = (column) => {
    if (!sortable || !column.sortable || !onSort) return;
    onSort(column.key);
  };

  const getSortIcon = (column) => {
    if (!sortable || !column.sortable || sortColumn !== column.key) {
      return null;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4 ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 ml-1" />
    );
  };

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item);
    }
    
    if (column.format) {
      return column.format(item[column.key]);
    }
    
    return item[column.key] || '-';
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className={`min-w-full divide-y divide-gray-200 dark:divide-gray-700 ${className}`} {...props}>
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`
                  px-6 py-3 text-left text-xs font-medium uppercase tracking-wider
                  ${sortable && column.sortable ? 'cursor-pointer select-none' : ''}
                  ${headerClassName}
                `}
                onClick={() => handleSort(column)}
                style={{ width: column.width }}
              >
                <div className="flex items-center">
                  <span className="text-gray-500 dark:text-gray-400">
                    {column.header}
                  </span>
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center">
                <div className="text-gray-500 dark:text-gray-400">
                  {emptyMessage}
                </div>
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={item.id || rowIndex}
                onClick={() => onRowClick && onRowClick(item)}
                className={`
                  ${hoverable && onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800' : ''}
                  ${striped && rowIndex % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-800/50' : ''}
                  ${rowClassName}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;