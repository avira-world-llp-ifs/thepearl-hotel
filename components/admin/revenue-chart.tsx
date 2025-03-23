"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"
import { formatPrice } from "@/lib/utils"

// Register Chart.js components
Chart.register(...registerables)

interface RevenueChartProps {
  data: any[]
}

export function RevenueChart({ data }: RevenueChartProps) {
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
    const revenueData = data.map((item) => item.revenue)
    const bookingCountData = data.map((item) => item.bookingCount)

    // Create new chart
    const ctx = chartRef.current.getContext("2d")
    if (ctx) {
      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Revenue",
              data: revenueData,
              backgroundColor: "rgba(16, 185, 129, 0.2)",
              borderColor: "rgba(16, 185, 129, 1)",
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              yAxisID: "y",
            },
            {
              label: "Bookings",
              data: bookingCountData,
              backgroundColor: "rgba(59, 130, 246, 0.2)",
              borderColor: "rgba(59, 130, 246, 1)",
              borderWidth: 2,
              borderDash: [5, 5],
              fill: false,
              tension: 0.4,
              yAxisID: "y1",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              type: "linear",
              display: true,
              position: "left",
              title: {
                display: true,
                text: "Revenue ($)",
              },
              ticks: {
                callback: (value) => formatPrice(value as number).replace("$", ""),
              },
            },
            y1: {
              type: "linear",
              display: true,
              position: "right",
              title: {
                display: true,
                text: "Number of Bookings",
              },
              ticks: {
                precision: 0,
              },
              grid: {
                drawOnChartArea: false,
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
              callbacks: {
                label: (context) => {
                  const label = context.dataset.label || ""
                  const value = context.parsed.y
                  if (label === "Revenue") {
                    return `${label}: ${formatPrice(value)}`
                  }
                  return `${label}: ${value}`
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

