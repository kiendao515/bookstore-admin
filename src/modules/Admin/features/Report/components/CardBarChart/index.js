import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import Empty from 'general/components/Empty';
import Loading from 'general/components/Loading';
import AppData from 'general/constants/AppData';
import AppResource from 'general/constants/AppResource';
import Utils from 'general/utils/Utils';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

CardBarChart.propTypes = {
  additionalClassName: PropTypes.string,
  chartSeries: PropTypes.array,
  chartLabels: PropTypes.array,
  title: PropTypes.string,
  chartColors: PropTypes.array,
  additonalElement: PropTypes.element,
  headerSidebar: PropTypes.element,
  loading: PropTypes.bool,
  subTitle: PropTypes.string,
  footerElement: PropTypes.element,
};

CardBarChart.defaultProps = {
  additionalClassName: '',
  chartSeries: [],
  chartLabels: [],
  title: '',
  chartColors: AppData.chartColors,
  additonalElement: <></>,
  headerSidebar: null,
  loading: false,
  subTitle: '',
  footerElement: null,
};

/**
 *
 * @param {{
 * additionalClassName: string,
 * chartLabels: string[],
 * chartSeries: number[],
 * title: string,
 * subTitle: string,
 * footerElement: element,
 * }} props
 * @returns
 */
function CardBarChart(props) {
  // MARK: --- Params ---
  const {
    additionalClassName,
    chartLabels,
    chartSeries,
    title,
    chartColors,
    additonalElement,
    headerSidebar,
    loading,
    subTitle,
    footerElement,
  } = props;
  const { t } = useTranslation();

  const options = useMemo(
    () => ({
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      // responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          position: 'bottom',
        },
      },
      scales: {
        x: {
          ticks: {
            callback: function (value, index, ticks) {
              if (value % 1 === 0) {
                return value;
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
      datasets: [
        {
          data: chartSeries,
          borderColor: chartColors,
          backgroundColor: chartColors,
        },
      ],
    };
  }, [chartSeries]);

  return (
    <div className="CardBarChart h-100">
      <div className={`card card-custom card-stretch gutter-b ${additionalClassName}`}>
        {/* card header */}
        <div className="card-header border-0 pt-6 d-flex flex-wrap align-items-center justify-content-between">
          <div className="w-100">
            <div
              className={`${
                headerSidebar ? 'd-flex flex-wrap align-items-center justify-content-between' : ''
              }`}
            >
              {/* card title */}
              <h3 className="card-title m-0">
                <span className="card-label font-weight-bolder font-size-h4 mb-2 text-dark-75">
                  {title}
                </span>
                <span
                  className="text-dark-50 font-size-sm d-block"
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  {subTitle}
                </span>
              </h3>
              <div>{headerSidebar}</div>
            </div>
          </div>
          <div className="mb-4">{additonalElement}</div>
        </div>

        {/* card body */}
        <div className="card-body d-flex align-items-center justify-content-center pb-7 pt-0 flex-wrap">
          <div className="w-100 h-100" style={{ minHeight: '350px' }}>
            {loading ? (
              <div className="d-flex aligin-items-center justify-content-center">
                <Loading showBackground={false} />
              </div>
            ) : !Utils.allElementsZero(chartSeries) ? (
              <Bar options={options} data={data} />
            ) : (
              <div className="pt-12">
                <Empty
                  text={t('NoData')}
                  visible={false}
                  imageEmpty={AppResource.images.imgEmptyView}
                  imageEmptyPercentWidth={50}
                />
              </div>
            )}
          </div>
        </div>

        {footerElement && <div className="card-footer">{footerElement}</div>}
      </div>
    </div>
  );
}

export default CardBarChart;
