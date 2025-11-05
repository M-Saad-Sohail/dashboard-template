import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "./index";
import Pagination from "../../tables/Pagination";
import { ChevronUpIcon, ChevronDownIcon } from "@/icons";

export interface Column<T> {
  header: string;
  accessor: keyof T | string;
  cell?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  containerClassName?: string;
  // Selection props
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T) => string;
}

function getNestedProperty(obj: any, path: string) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  pageSize = 10,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch,
  loading = false,
  emptyMessage = "No data available",
  className = "",
  containerClassName = "",
  selectable = false,
  selectedRows = [],
  onRowSelectionChange,
  getRowId = (row: T) => row.id as string,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    
    return data.filter((row) => {
      return columns.some((column) => {
        const value = getNestedProperty(row, column.accessor as string);
        return value?.toString().toLowerCase().includes(searchQuery.toLowerCase());
      });
    });
  }, [data, searchQuery, columns]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getNestedProperty(a, sortConfig.key);
      const bValue = getNestedProperty(b, sortConfig.key);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (accessor: string) => {
    setSortConfig((prevConfig) => {
      if (!prevConfig || prevConfig.key !== accessor) {
        return { key: accessor, direction: "asc" };
      }
      if (prevConfig.direction === "asc") {
        return { key: accessor, direction: "desc" };
      }
      return null;
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setCurrentPage(1);
    onSearch?.(query);
  };

  const handleSelectAll = () => {
    if (!onRowSelectionChange) return;
    
    const currentPageIds = paginatedData.map(row => getRowId(row));
    const allSelected = currentPageIds.every(id => selectedRows.includes(id));
    
    if (allSelected) {
      // Deselect all on current page
      onRowSelectionChange(selectedRows.filter(id => !currentPageIds.includes(id)));
    } else {
      // Select all on current page
      const newSelection = [...new Set([...selectedRows, ...currentPageIds])];
      onRowSelectionChange(newSelection);
    }
  };

  const handleSelectRow = (rowId: string) => {
    if (!onRowSelectionChange) return;
    
    if (selectedRows.includes(rowId)) {
      onRowSelectionChange(selectedRows.filter(id => id !== rowId));
    } else {
      onRowSelectionChange([...selectedRows, rowId]);
    }
  };

  const isAllCurrentPageSelected = paginatedData.length > 0 && 
    paginatedData.every(row => selectedRows.includes(getRowId(row)));
  const isSomeCurrentPageSelected = paginatedData.some(row => selectedRows.includes(getRowId(row))) && 
    !isAllCurrentPageSelected;

  return (
    <div className={`space-y-4 dark:bg-gray-900 ${containerClassName}`}> 
      {searchable && (
        <div className="flex justify-between items-center pt-4 pl-4">
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={handleSearch}
            className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:focus:border-primary placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      )}

      <div className="border border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-900 overflow-visible">
        <div className="max-w-full overflow-x-auto dark:bg-gray-900 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-6 pr-6">
          <Table className={`dark:bg-gray-900 ${className}`}>
            <TableHeader className="border-b border-gray-200 dark:border-gray-600 dark:bg-gray-900">
              <TableRow>
                {selectable && (
                  <TableCell
                    isHeader
                    className="px-3 py-2 w-10"
                  >
                    <input
                      type="checkbox"
                      checked={isAllCurrentPageSelected}
                      onChange={handleSelectAll}
                      className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      style={{ textIndent: isSomeCurrentPageSelected ? '0' : undefined }}
                      ref={(el) => {
                        if (el) el.indeterminate = isSomeCurrentPageSelected;
                      }}
                    />
                  </TableCell>
                )}
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    isHeader
                    className={`px-3 py-2 font-medium text-gray-500 text-start text-xs dark:text-gray-400 ${
                      column.headerClassName || ""
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {column.header}
                      {column.sortable && (
                        <button
                          onClick={() => handleSort(column.accessor as string)}
                          className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {sortConfig?.key === column.accessor ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUpIcon className="w-3 h-3" />
                            ) : (
                              <ChevronDownIcon className="w-3 h-3" />
                            )
                          ) : (
                            <div className="w-3 h-3 opacity-30">
                              <ChevronUpIcon className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-200 dark:divide-gray-600 dark:bg-gray-900">
              {loading ? (
                <TableRow className="dark:bg-gray-900">
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400 dark:bg-gray-900"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : paginatedData.length === 0 ? (
                <TableRow className="dark:bg-gray-900">
                  <TableCell
                    colSpan={columns.length + (selectable ? 1 : 0)}
                    className="px-3 py-6 text-center text-sm text-gray-500 dark:text-gray-400 dark:bg-gray-900"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => {
                  const rowId = getRowId(row);
                  const isSelected = selectedRows.includes(rowId);
                  return (
                    <TableRow key={rowIndex} className={isSelected ? 'bg-gray-2 dark:bg-meta-4' : 'dark:bg-gray-900'}>
                      {selectable && (
                        <TableCell className="px-3 py-2 w-10 dark:bg-gray-900">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(rowId)}
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </TableCell>
                      )}
                      {columns.map((column, colIndex) => {
                        const value = getNestedProperty(row, column.accessor as string);
                        return (
                          <TableCell
                            key={colIndex}
                            className={`px-3 py-2 text-sm text-start dark:bg-gray-900 dark:text-white whitespace-nowrap ${
                              column.className || ""
                            }`}
                          >
                            {column.cell ? column.cell(value, row) : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {!loading && totalPages > 1 && (
        <div className="flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;
