"use client";
import {
  useFilters,
  useMetrics,
  BarChart,
  DualAxisPercentageAreaChart,
  useRunData,
} from "@coval-ai/components";
import { ChangeEvent, useState } from "react";

export default function Bar() {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(
    // "metric_type_coval_call_resolution_success"
    null
  );
  const { filters, updateSearchValue, updateDateRange } = useFilters({
    // dateRange: {
    //   start: new Date("2025-06-19").toISOString(),
    //   end: new Date("2025-06-22").toISOString(),
    // },
    // metadataFilters: [
    //   {
    //     key: "environment",
    //     value: "DEV",
    //   },
    //   {
    //     key: "customer_id",
    //     value: "100",
    //   },
    // ],
  });

  const [runCategory, setRunCategory] = useState<string | null>(null);
  const [bucketRange, setBucketRange] = useState<{
    start: string;
    end: string;
    bucketSize: string;
  } | null>(null);

  const { data: metrics } = useMetrics({
    metric_type: "built-in",
  });

  const { data: runData, loading } = useRunData(
    selectedMetric || "",
    // "metric_type_coval_call_resolution_success",
    {
      ...filters,
      // limit: 10,
      bucketSize: "1d",
      category: "N",
      dateRange: {
        start: bucketRange?.start || null,
        end: bucketRange?.end || null,
      },
    },
    {
      enabled: !!bucketRange,
    }
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

  const handleBarClick = (
    bucketTimeRange: {
      start: string;
      end: string;
      bucketSize: string;
    },
    category: string
  ) => {
    console.log(bucketTimeRange, category);
    setBucketRange(bucketTimeRange);
    setRunCategory(category);
  };
  // console.log(filters);
  // useEffect(() => {
  //   if (filters.metadataFilters?.length === 0) {
  //     addMetadataFilter("environment", "DEV");
  //     addMetadataFilter("customer_id", "174");
  //   }
  // }, [filters]);

  return (
    <div className="space-y-4 mb-28">
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
          defaultValue={filters.searchValue || undefined}
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
      </div>

      <div className="flex flex-col space-y-2">
        <label htmlFor="metric" className="text-sm font-medium">
          Metric:
        </label>
        <select
          id="metric"
          className="border rounded p-2"
          value={selectedMetric || ""}
          onChange={(e) => setSelectedMetric(e.target.value)}
        >
          <option value="" disabled>
            Select a metric
          </option>
          {metrics &&
            metrics.map((metric) => (
              <option key={metric.metric_name} value={metric.metric_name}>
                {metric.metric_display_name}
              </option>
            ))}
        </select>
      </div>
      {selectedMetric && (
        <BarChart
          className="h-80 w-full"
          type="stacked"
          showPercentages={true}
          colors={["#AA3939", "#7A9F35", "#60D400", "#6A7897", "#AA8439"]}
          gridProps={{
            vertical: true,
            horizontal: true,
          }}
          metricName={selectedMetric}
          filters={filters}
          onBarClick={({ bucketTimeRange, category }) =>
            handleBarClick(bucketTimeRange, category)
          }
        />
      )}
      <div className="flex flex-col space-y-2">
        <pre>
          {JSON.stringify(
            {
              length: runData?.length,
              filters,
              runData,
            },
            null,
            2
          )}
        </pre>
      </div>
      {selectedMetric && (
        <DualAxisPercentageAreaChart
          className="h-80 w-full"
          colors={["#AA3939", "#7A9F35", "#60D400", "#6A7897", "#AA8439"]}
          onAreaClick={({ bucketTimeRange, category }) =>
            handleBarClick(bucketTimeRange, category)
          }
          gridProps={{
            vertical: true,
            horizontal: true,
          }}
          metricName={selectedMetric}
          filters={filters}
        />
      )}
    </div>
  );
}
