import {
  getTotalInfo,
  getCatergoryWiseDownloadCounts,
  getDatewiseDownloads,
  getTopIcons,
} from "@/api/dashboard";
import React, { useState, useEffect } from "react";

function useDashboardStats() {
  const [stats, setStats] = useState({});
  const [topDownloaded, setTopDownloaded] = useState([]);
  const [downloadTrends, setDownloadTrends] = useState([]);
  const [categoryStats, setCategoryStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStats = async () => {
    setIsLoading(true);

    const promise1 = getTotalInfo();
    const promise2 = getCatergoryWiseDownloadCounts();
    const promise3 = getTopIcons();
    const promise4 = getDatewiseDownloads();

    // Wait for all the promises to resolve :
    const [
      totalInfoResponse,
      categoryWiseDownloadsResponse,
      topIconsResponse,
      dateTrendsResponse,
    ] = await Promise.all([promise1, promise2, promise3, promise4]);

    // check if any of the responses have an error :
    if (
      totalInfoResponse.error ||
      categoryWiseDownloadsResponse.error ||
      topIconsResponse.error ||
      dateTrendsResponse.error
    ) {
      console.error("Error fetching dashboard stats");
      setIsLoading(false);
      return;
    }

    // set the stats :

    // set the total info :
    const totalInfo = totalInfoResponse.data;
    setStats({
      totalIcons: totalInfo.total_icons,
      totalDownloads: totalInfo.total_downloads,
      activeUsers: totalInfo.total_users,
      publishedIcons: totalInfo.total_published_icons,
    });

    // set the category wise downloads :
    const categoryWiseDownloads = categoryWiseDownloadsResponse.data;
    setCategoryStats(
      Object.keys(categoryWiseDownloads).map((category) => ({
        category,
        icons: categoryWiseDownloads[category],
      }))
    );

    // set the top icons :
    const topIcons = topIconsResponse.data;
    setTopDownloaded(
      Object.keys(topIcons)
        .map((icon, index) => ({
          id: index,
          name: icon,
          downloads: topIcons[icon],
          category: "Category 1",
        }))
        .sort((a, b) => b.downloads - a.downloads)
    );

    // set the download trends :
    const dateTrends = dateTrendsResponse.data;
    setDownloadTrends(
      Object.keys(dateTrends).map((date) => ({
        date,
        downloads: dateTrends[date],
      }))
    );

    setIsLoading(false);
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  return { stats, topDownloaded, downloadTrends, categoryStats, isLoading };
}

export default useDashboardStats;
