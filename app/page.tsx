"use client";
import { LatencyChart, useFilters } from "@coval-ai/components";
import { ChangeEvent, useEffect, useState } from "react";

export default function Home() {
  const { filters, updateSearchValue, updateDateRange, updateBucketSize } =
    useFilters();

  const [customBucketSize, setCustomBucketSize] = useState<string | undefined>(
    undefined
  );

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateSearchValue(e.target.value);
  };

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateDateRange({
      start: new Date(e.target.value).toISOString(),
      end: filters.dateRange?.end || null,
    });
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateDateRange({
      start: filters.dateRange?.start || null,
      end: new Date(e.target.value).toISOString(),
    });
  };

  const handleSelectBucketSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "custom") {
      setCustomBucketSize("");
    } else {
      setCustomBucketSize(undefined);
      updateBucketSize(e.target.value);
    }
  };

  const handleCustomBucketSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomBucketSize(e.target.value);
  };

  useEffect(() => {
    if (customBucketSize) {
      const timeout = setTimeout(() => {
        updateBucketSize(customBucketSize);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [customBucketSize]);

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
          defaultValue={filters.searchValue || ""}
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
            defaultValue={filters.dateRange?.start?.split("T")[0]}
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
            defaultValue={filters.dateRange?.end?.split("T")[0]}
          />
        </div>
        <div className="flex flex-col space-y-2">
          <label htmlFor="bucketSize" className="text-sm font-medium">
            Bucket Size:
          </label>
          <select
            id="bucketSize"
            className="border rounded p-2"
            onChange={handleSelectBucketSizeChange}
            defaultValue={filters.bucketSize || ""}
          >
            <option value="">Select Bucket Size</option>
            <option value="1h">1h</option>
            <option value="15m">6h</option>
            <option value="1d">1d</option>
            <option value="1w">1w</option>
            <option value="1m">1m</option>
            <option value="custom">Custom</option>
          </select>
          {typeof customBucketSize === "string" && (
            <input
              type="text"
              className="border rounded p-2"
              value={customBucketSize}
              onChange={handleCustomBucketSizeChange}
            />
          )}
        </div>
      </div>

      <LatencyChart className="h-80 w-full" filters={filters} />
    </div>
  );
}
