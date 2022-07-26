import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
import {Line} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import './../../styles/HourlyForecast.scss';
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
  );

function HourlyForecast({currentStatusData, currentUnit}){
    const {unit, calculateTemp} = currentUnit;
    const {hourly} = currentStatusData;
    let arr = [];
    for(let i = 1; i <= 12 && i <= hourly.length; i++){
        arr.push({
            dt: new Date((hourly[i].dt) * 1000),
            temp: calculateTemp(hourly[i].temp,unit),
            weather: hourly[i].weather,
        });
    }
    const salesData = {
        labels: arr.map((el, idx) => {
            return el.dt.toLocaleString('en-US', { hour: 'numeric', hour12: true });
        }),
        datasets: [
          {
            label: "Temperature",
            fill: "end",
            fillColor: "red",
            tension: 0.3,
            data: arr.map((el, idx) => {
                return el.temp;
            }),
          },
        ]
      };
      const options = {
        responsive: true,
        borderColor: "#ff9500",
        elements: {
            point:{
                radius: 0
            }
        },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: Math.round,
                color: "white",
                font: {
                    weight: 'bold',
                    size: 12
                }
            },
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: false
            },
        },
        layout: {
            padding: {
                top: 30
            }
        },
        scales: {
            x: {
                min: 0,
                max: 7,
                grid: {
                    display: true,
                    borderColor: "transparent"
                },
                ticks: {
                    color: "white"
                }
            },
            y: {
                display: false,
                grid: {
                    display: false,
                    borderColor: "transparent"
                },
                ticks: {
                    color: "white"
                }
            }
          }
      };
    return(
        <div className="hourlyforecast container">
        <p>Hourly Forecast</p>
        <Line
            data={salesData}
            options={options}
            height="40px"
            width="80vw"
        />
        </div>
    )
}
export default HourlyForecast;