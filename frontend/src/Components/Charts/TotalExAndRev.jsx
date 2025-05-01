import Chart from "react-apexcharts";
import { convertNumbersToFixedTwo } from "../Logic/LogicFun";
import { useTranslation } from "react-i18next";

const TotalExAndRev = ({ type, paidAmount, total }) => {
  const { t: key } = useTranslation();
  const percentage = convertNumbersToFixedTwo((paidAmount / total) * 100);

  const chartConfig =
    type === "expenses"
      ? {
          label: key("paymentRatio"),
          gradientColors: ["#d39833"],
        }
      : type === "revenues"
      ? {
          label: key("collectionRatio"),
          gradientColors: ["#d39833"],
        }
      : {
          label: key("totalRentedEstate"),
          gradientColors: ["#d39833"],
        };

  const chartData = {
    options: {
      chart: {
        height: 280,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: "70%",
            background: "#293450",
          },
          track: {
            dropShadow: {
              enabled: true,
              top: 2,
              left: 0,
              blur: 4,
              opacity: 0.15,
            },
          },
          dataLabels: {
            name: {
              offsetY: -10,
              color: "#fff",
              fontSize: "0.75rem",
            },
            value: {
              color: "#fff",
              fontSize: "1.5625rem",
              show: true,
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          gradientToColors: chartConfig.gradientColors,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",
      },
      labels: [chartConfig.label],
    },
    series: [percentage],
  };

  return (
    <div className="ar_lang">
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="radialBar"
        height={280}
      />
    </div>
  );
};

export default TotalExAndRev;
