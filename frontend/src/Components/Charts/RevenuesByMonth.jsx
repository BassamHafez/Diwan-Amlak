import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";

const RevenuesByMonth = ({ revenuesByMonth = [] }) => {
  const { t: key } = useTranslation();

  const months = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "short" })
  );

  const revenueData = Array(12).fill({ totalPaid: 0, totalPending: 0 });

  revenuesByMonth.forEach(({ month, totalPaid, totalPending }) => {
    revenueData[month - 1] = { totalPaid, totalPending };
  });

  const totalPaid = revenueData.map((data) => data.totalPaid);
  const totalPending = revenueData.map((data) => data.totalPending);

  const chartData = {
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,

        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
          },
          autoSelected: "pan",
        },
        zoom: {
          allowMouseWheelZoom: false,
          zoomedArea: {
            fill: {
              color: "#90CAF9",
              opacity: 0.4,
            },
            stroke: {
              color: "#0D47A1",
              opacity: 0.4,
              width: 1,
            },
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "50%",
        },
      },
      xaxis: {
        tickPlacement: "on",
        categories: months,
        title: {
          text: key("months"),
        },
      },
      yaxis: {
        title: {
          text: `${key("revenues")} (${key("sar")})`,
        },
      },
      legend: {
        position: "top",
      },
      fill: {
        opacity: 1,
      },
      tooltip: {
        y: {
          formatter: (value) => `${value.toLocaleString()} ${key("sar")}`,
        },
      },
      colors: ["#d39833", "#fad4a9","#33b5e5", "#f44336"],
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        formatter: function (val) {
            return val
        },
        textAnchor: 'middle',
        distributed: false,
        offsetX: 0,
        offsetY: 0,
        style: {
            fontSize: '10px',
            fontWeight: 'bold',
            colors: undefined
        },
        background: {
          enabled: true,
          foreColor: '#fff',
          padding: 2,
          opacity: 0.9,

        },
      }
    },
 
    series: [
      {
        name: key("totalPaidRevenues"),
        data: totalPaid,    
      },
      {
        name: key("pendingRevenues"),
        data: totalPending,
      },
      
    ],
  };

  return (
    <div className="ar_lang">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={445}
      />
    </div>
  );
};

export default RevenuesByMonth;
