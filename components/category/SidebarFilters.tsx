"use client";

import React, { useState } from "react";
import FilterSection from "./FilterSection";

function SidebarFilters() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((item) => item !== filter)
        : [...prev, filter]
    );
  };

  return (
    <aside className="w-full lg:w-1/4 space-y-4">
      <FilterSection
        title="DELIVERY TIME"
        options={["1-2 hours"]}
        selected={selectedFilters}
        toggle={toggleFilter}
      />
      <FilterSection
        title="EXPRESS DELIVERY"
        options={["Yes", "No"]}
        selected={selectedFilters}
        toggle={toggleFilter}
      />
      <FilterSection
        title="FREE SHIPPING"
        options={["Yes", "No"]}
        selected={selectedFilters}
        toggle={toggleFilter}
      />
      <FilterSection
        title="TAG"
        options={[
          "Coffee Varieties",
          "Coffee",
          "Coffee Products",
          "Coffee Selection",
        ]}
        selected={selectedFilters}
        toggle={toggleFilter}
      />
    </aside>
  );
}

export default SidebarFilters;
