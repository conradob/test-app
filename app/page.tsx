"use client";
import { CovalProvider, LatencyChart, useFilters } from "@coval-ai/components";
import { ChangeEvent } from "react";

const token = process.env.NEXT_PUBLIC_COVAL_TOKEN || "";
const apiUrl = process.env.NEXT_PUBLIC_COVAL_API_URL || undefined;

const Component = () => {
  const { filters, updateSearchValue, updateDateRange } = useFilters();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateSearchValue(e.target.value);
  };

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateDateRange({
      start: new Date(e.target.value),
      end: filters.dateRange?.end || null,
    });
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateDateRange({
      start: filters.dateRange?.start || null,
      end: new Date(e.target.value),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label htmlFor="search" className="text-sm font-medium">
          Search:
        </label>
        <input
          id="search"
          type="text"
          className="border rounded p-2"
          placeholder="Search value..."
          onChange={handleSearchChange}
          defaultValue={filters.searchValue}
        />
      </div>

      <div className="flex space-x-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="startDate" className="text-sm font-medium">
            Start Date:
          </label>
          <input
            id="startDate"
            type="date"
            className="border rounded p-2"
            onChange={handleStartDateChange}
            defaultValue={filters.dateRange?.start?.toISOString().split("T")[0]}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label htmlFor="endDate" className="text-sm font-medium">
            End Date:
          </label>
          <input
            id="endDate"
            type="date"
            className="border rounded p-2"
            onChange={handleEndDateChange}
            defaultValue={filters.dateRange?.end?.toISOString().split("T")[0]}
          />
        </div>
      </div>

      <LatencyChart className="h-80 w-full" filters={filters} />
    </div>
  );
};

export default function Home() {
  return (
    <CovalProvider token={token} apiUrl={apiUrl}>
      <Component />
    </CovalProvider>
  );
}
