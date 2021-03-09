import React from 'react'
import Chart from 'chart.js'

export interface ChartDataSets {
  label: string
  data: Array<number>
  backgroundColor: string
  borderColor: string
  borderWith: number
}

export interface ChartData {
  labels?: Array<string | string[]>
  datasets?: ChartDataSets[]
}

const Graph = ({ graphData }: { graphData?: ChartData | null }) => {
  if (!graphData) return null

  const ctx = React.useRef<HTMLCanvasElement | null>(null)

  React.useEffect(() => {
    let theChart: Chart
    if (ctx.current !== null) {
      ctx.current.getContext('2d')
      theChart = new Chart(ctx.current, {
        type: 'bar',
        data: graphData,
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      })
    }
    return () => {
      if (theChart) {
        theChart.destroy()
      }
    }
  }, [graphData, ctx.current])

  return (
    <div id="voto2021-graph" className="relative max-w-3xl mx-auto text-blue">
      <canvas ref={ctx}></canvas>
    </div>
  )
}

export default Graph
