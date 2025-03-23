"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface BookingChartProps {
  data: any[]
}

export function BookingChart({ data }: BookingChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    // Prepare data for the chart
    const labels = data.map((item) => item.label)
    const bookingCounts = data.map((item) => item.count)
    const statusCounts = {
      pending: data.map((item) => item.statusBreakdown?.pending || 0),
      confirmed: data.map((item) => item.statusBreakdown?.confirmed || 0),
      approved: data.map((item) => item.statusBreakdown?.approved || 0),
      cancelled: data.map((item) => item.statusBreakdown?.cancelled || 0),
      completed: data.map((item) => item.statusBreakdown?.completed || 0),
    }

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Total Bookings",
              data: bookingCounts,
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 1,
            },
            {
              label: "Pending",
              data: statusCounts.pending,
              backgroundColor: "rgba(245, 158, 11, 0.5)",
              borderColor: "rgba(245, 158, 11, 1)",
              borderWidth: 1,
              stack: "stack1",
              hidden: true,
            },
            {
              label: "Confirmed",
              data: statusCounts.confirmed,
              backgroundColor: "rgba(37, 99, 235, 0.5)",
              borderColor: "rgba(37, 99, 235, 1)",
              borderWidth: 1,
              stack: "stack1",
              hidden: true,
            },
            {
              label: "Approved",
              data: statusCounts.approved,
              backgroundColor: "rgba(16, 185, 129, 0.5)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 1,
              stack: "stack1",
              hidden: true,
            },
            {
              label: "Cancelled",
              data: statusCounts.cancelled,
              backgroundColor: "rgba(239, 68, 68, 0.5)",
              borderColor: "rgba(239, 68, 68, 1)",
              borderWidth: 1,
              stack: "stack1",
              hidden: true,
            },
            {
              label: "Completed",
              data: statusCounts.completed,
              backgroundColor: "rgba(139, 92, 246, 0.5)",
              borderColor: "rgba(139, 92, 246, 1)",
              borderWidth: 1,
              stack: "stack1",
              hidden: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Number of Bookings",
              },
              ticks: {
                precision: 0,
              },
            },
            x: {
              title: {
                display: true,
                text: "Time Period",
              },
            },
          },
          plugins: {
            tooltip: {
              mode: "index",
              intersect: false,
            },
            legend: {
              position: "top",
              onClick: (e, legendItem, legend) => {
                const index = legendItem.datasetIndex
                const ci = legend.chart

                if (index === 0) {
                  // Toggle all status datasets when clicking "Total Bookings"
                  const statusDatasets = [1, 2, 3, 4, 5] // Indices of status datasets
                  const allHidden = statusDatasets.every((i) => ci.isDatasetHidden(i))

                  statusDatasets.forEach((i) => {
                    ci.setDatasetVisibility(i, allHidden)
                  })
                  ci.setDatasetVisibility(0, !allHidden)
                } else {
                  // Default toggle behavior for status datasets
                  ci.setDatasetVisibility(index, !ci.isDatasetHidden(index))

                  // If any status dataset is visible, hide the total dataset
                  const anyStatusVisible = [1, 2, 3, 4, 5].some((i) => !ci.isDatasetHidden(i))
                  ci.setDatasetVisibility(0, !anyStatusVisible)
                }
                ci.update()
              },
            },
          },
        },
      })
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data])

  return <canvas ref={chartRef} />
}

