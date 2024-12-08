import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import AppData from 'general/constants/AppData';
import AppResource from 'general/constants/AppResource';
import Utils from 'general/utils/Utils';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

CardAreaChart.propTypes = {
  additionalClassName: PropTypes.string,
  title: PropTypes.string,
  subTitle: PropTypes.string,
  chartSeries: PropTypes.array,
  chartLabels: PropTypes.array,
  toolbarElement: PropTypes.element,
  sideBarElement: PropTypes.element,
  chartColors: PropTypes.array,
  headerSidebar: PropTypes.element,
  loading: PropTypes.bool,
  fullChartLabels: PropTypes.array,
  customYAxis: PropTypes.string,
  fill: PropTypes.bool,
};

CardAreaChart.defaultProps = {
  additionalClassName: '',
  title: '',
  subTitle: '',
  chartSeries: [],
  chartLabels: [],
  toolbarElement: null,
  sideBarElement: null,
  chartColors: AppData.chartColors,
  headerSidebar: null,
  loading: false,
  fullChartLabels: [],
  customYAxis: '',
  fill: true,
};
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
function CardAreaChart(props) {
  const {
    additionalClassName,
    title,
    subTitle,
    chartSeries,
    chartLabels,
    toolbarElement,
    sideBarElement,
    chartColors,
    headerSidebar,
    loading,
    customYAxis,
    fill,
  } = props;
  const { t } = useTranslation();

  const options = useMemo(
    () => ({
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: false,
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }
              if (customYAxis) {
                return label + context.parsed.y + customYAxis;
              } else {
                return label + context.parsed.y;
              }
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            callback: function (value, index, ticks) {
              return chartLabels[index];
            },
          },
        },
        y: {
          ticks: {
            callback: function (value, index, ticks) {
              if (customYAxis) {
                return value + customYAxis;
              } else {
                if (value % 1 === 0) {
                  return value;
                }
              }
            },
          },
        },
      },
    }),
    [chartLabels]
  );

  const data = useMemo(() => {
    return {
      labels: chartLabels,
      datasets: chartSeries.map((item, index) => {
        return {
          label: item.name,
          data: item.data,
          borderColor: chartColors[index],
          fill: 'start',
          lineTension: 0.3,
          backgroundColor: (context) => {
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 250);
            gradient.addColorStop(0, Utils.hexToRGBA(chartColors[index], 0.6));
            gradient.addColorStop(1, Utils.hexToRGBA(chartColors[index], 0));
            return gradient;
          },
        };
      }),
    };
  }, [chartSeries, chartLabels]);

  const apexChartEl = useMemo(() => {
    return <Line options={options} data={data} />;
  }, [options, chartSeries]);

  return (
    <div
      className={`CardAreaChart bg-white rounded h-100 ${additionalClassName} ${
        sideBarElement ? 'row m-0 pr-0' : ''
      }`}
    >
      <div className={`${sideBarElement ? 'col-9' : ''}`}>
        <div className={`card-header px-6 border-0 pt-6 ${toolbarElement ? '' : 'pb-0'}`}>
          <div
            className={`${toolbarElement ? 'mb-6' : ''} ${
              headerSidebar ? 'd-flex flex-wrap align-items-center justify-content-between' : ''
            }`}
          >
            {/* card title */}
            <h3 className="card-title m-0">
              <span className="card-label font-weight-bolder font-size-h4 text-dark-75">
                {title}
              </span>
              <span className="text-dark pt-2 font-size-sm d-block">{subTitle}</span>
            </h3>
            <div>{headerSidebar}</div>
          </div>
          {/* card toolbar */}
          {toolbarElement && <div className="card-toolbar">{toolbarElement}</div>}
        </div>
        {loading ? (
          <div className="d-flex align-items-center justify-content-center mb-8">
            <Loading showBackground={false} />
          </div>
        ) : chartSeries?.every((item) => item.data?.every((value) => value <= 0)) ? (
          <div className="pt-12">
            <Empty
              text={t('NoData')}
              visible={false}
              imageEmpty={AppResource.images.imgEmptyView}
              imageEmptyPercentWidth={20}
            />
          </div>
        ) : (
          <div className="h-100 mb-8 pr-3 pl-6" style={{ minHeight: '350px' }}>
            {apexChartEl}
          </div>
        )}
      </div>
      {sideBarElement && <div className="border-left col-3 px-0">{sideBarElement}</div>}
    </div>
  );
}

export default CardAreaChart;
