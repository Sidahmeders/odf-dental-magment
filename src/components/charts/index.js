import 'chart.js/auto'
import { Chart, ArcElement } from 'chart.js'
import { Bar, Doughnut, Line, Pie, PolarArea, Radar, Scatter, Bubble } from 'react-chartjs-2'

export const BarChart = ({ data }) => {
  return (
    <div className="chart">
      <Bar data={data} />
    </div>
  )
}

export const DoughChart = ({ data }) => {
  return (
    <div className="chart">
      <Doughnut data={data} />
    </div>
  )
}

export const LineChart = ({ data }) => {
  return (
    <div className="chart">
      <div className="break"></div>
      <Line data={data} />
    </div>
  )
}

export const PieChart = ({ data }) => {
  return (
    <div className="pie-charts">
      <div className="chart">
        <Pie data={data} />
      </div>
    </div>
  )
}

export const PolarAreaChart = ({ data }) => {
  return (
    <div className="polarArea-charts">
      <div className="chart">
        <PolarArea data={data} />
      </div>
    </div>
  )
}

export const RadarChart = ({ data }) => {
  return (
    <div className="radar-charts">
      <div className="chart">
        <Radar data={data} />
      </div>
    </div>
  )
}

export const ScatterChart = ({ data }) => {
  return (
    <div className="scatter-charts">
      <div className="chart">
        <Scatter data={data} />
      </div>
    </div>
  )
}

export const BubbleChart = ({ data }) => {
  return (
    <div className="bubble-charts">
      <div className="chart">
        <Bubble data={data} />
      </div>
    </div>
  )
}

Chart.register(ArcElement)
