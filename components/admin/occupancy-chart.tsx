"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

// Register Chart.js components
Chart.register(...registerables)

interface OccupancyChartProps {
  data: any[]
}

export function OccupancyChart({ data }: OccupancyChartProps) {
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
    const occupancyRates = data.map((item) => item.occupancyRate)
    const roomTypeData = {
      standard: data.map((item) => item.roomTypeBreakdown?.standard || 0),
      deluxe: data.map((item) => item.roomTypeBreakdown?.deluxe || 0),
      executive: data.map((item) => item.roomTypeBreakdown?.executive || 0),
      family: data.map((item) => item.roomTypeBreakdown?.family || 0),
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
              label: "Overall Occupancy",
              data: occupancyRates,
              backgroundColor: "rgba(99, 102, 241, 0.5)",
              borderColor: "rgba(99, 102, 241, 1)",
              borderWidth: 1,
              type: "line",
              fill: false,
              tension: 0.4,
              yAxisID: "y-percentage",
            },
            {
              label: "Standard Rooms",
              data: roomTypeData.standard,
              backgroundColor: "rgba(16, 185, 129, 0.5)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 1,
              stack: "stack1",
            },
            {
              label: "Deluxe Rooms",
              data: roomTypeData.deluxe,
              backgroundColor: "rgba(245, 158, 11, 0.5)",
              borderColor: "rgba(245, 158, 11, 1)",
              borderWidth: 1,
              stack: "stack1",
            },
            {
              label: "Executive Suites",
              data: roomTypeData.executive,
              backgroundColor: "rgba(239, 68, 68, 0.5)",
              borderColor: "rgba(239, 68, 68, 1)",
              borderWidth: 1,
              stack: "stack1",
            },
            {
              label: "Family Rooms",
              data: roomTypeData.family,
              backgroundColor: "rgba(139, 92, 246, 0.5)",
              borderColor: "rgba(139, 92, 246, 1)",
              borderWidth: 1,
              stack: "stack1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              stacked: true,
              title: {
                display: true,
                text: "Number of Rooms",
              },
              ticks: {
                precision: 0,
              },
            },
            "y-percentage": {
              position: "right",
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: "Occupancy Rate (%)",
              },
              ticks: {
                callback: (value) => value + "%",
              },
              grid: {
                drawOnChartArea: false,
              },
            },
            x: {
              stacked: true,
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
              callbacks: {
                label: (context) => {
                  const label = context.dataset.label || ""
                  const value = context.parsed.y
                  if (label === "Overall Occupancy") {
                    return `${label}: ${value}%`
                  }
                  return `${label}: ${value} rooms`
                },
              },
            },
            legend: {
              position: "top",
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

