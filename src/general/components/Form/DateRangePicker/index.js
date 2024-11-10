import PropTypes from 'prop-types';
import DateRangePicker from 'react-bootstrap-daterangepicker';

import 'bootstrap-daterangepicker/daterangepicker.css';
import AppResource from 'general/constants/AppResource';
import Utils from 'general/utils/Utils';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './style.scss';

DateRangePickerInput.propTypes = {
  format: PropTypes.string,
  className: PropTypes.string,
  haveTitle: PropTypes.bool,
  getDateRange: PropTypes.func,
  customRange: PropTypes.object,
  showingRange: PropTypes.string,
  initialLabel: PropTypes.string,
  initialStartDate: PropTypes.object,
  initialEndDate: PropTypes.object,
};

DateRangePickerInput.defaultProps = {
  format: 'DD/MM/YYYY',
  className: '',
  haveTitle: true,
  getDateRange: null,
  customRange: {},
  showingRange: '',
  initialLabel: 'Tất cả',
  initialStartDate: null,
  initialEndDate: null,
};

function DateRangePickerInput(props) {
  const {
    format,
    className,
    haveTitle,
    getDateRange,
    customRange,
    showingRange,
    initialLabel,
    initialStartDate,
    initialEndDate,
  } = props;
  const dateRangePickerInput = useRef(null);
  const [range, setRange] = useState(initialLabel);
  const { t } = useTranslation();

  function handleEvent(event, picker) {
    // console.log(picker.endDate._d);
  }
  function handleCallback(start, end, label) {
    let dateRange = {};
    switch (label) {
      case 'Tất cả':
        setRange('Tất cả');
        dateRange = {
          label: label,
          startDate: '',
          endDate: '',
        };
        break;
      case 'Hôm nay':
      case 'Hôm qua':
        setRange(label);
        dateRange = {
          label: label,
          startDate: start._d,
          endDate: end._d,
        };
        break;
      default:
        const rangeLabel = label
          ? label
          : `${Utils.formatDateTime(start._d, 'DD/MM/YYYY')} - ${Utils.formatDateTime(
              end._d,
              'DD/MM/YYYY'
            )}`;
        setRange(rangeLabel);
        dateRange = {
          label: label,
          startDate: start._d,
          endDate: end._d,
        };
        break;
    }
    if (getDateRange) {
      getDateRange(dateRange);
    }
  }

  function handleFocus() {
    dateRangePickerInput.current.ref.focus();
  }

  function handleShowCalender(event, picker) {
    // console.log("event:", event);
    // console.log("picker:", picker);
  }

  useEffect(() => {
    if (showingRange) {
      setRange(showingRange);
    }
  }, [showingRange]);

  return (
    <div
      className={`DateRangePickerInput cursor-pointer d-flex flex-wrap align-items-center justify-content-between ${className}`}
      onClick={handleFocus}
    >
      {haveTitle && (
        <div>
          <i
            className="DateRangePickerInput_Icon_Calender fas fa-calendar-day ml-2"
            style={{ color: '#4A5677' }}
          ></i>
          <span
            className="DateRangePickerInput_Title font-weight-bold ml-2"
            style={{ color: '#4A5677' }}
          >
            Thời gian:{' '}
          </span>
        </div>
      )}
      <div>
        <span
          className="font-size-base font-weight-bolder mx-2"
          style={{ color: AppResource.colors.remainingColor }}
        >
          {range}
          <i
            className="DateRangePickerInput_Icon_Down fas fa-caret-down ml-2"
            style={{ color: '#4A5677' }}
          ></i>
        </span>
      </div>

      <DateRangePicker
        onShow={handleShowCalender}
        ref={dateRangePickerInput}
        onEvent={handleEvent}
        onCallback={handleCallback}
        // className = 'position-absolute pl-28'
        style={{ display: 'none' }}
        initialSettings={{
          startDate: initialStartDate ?? moment().subtract(28, 'days'),
          endDate: initialEndDate ?? moment(),
          alwaysShowCalendars: true,
          opens: 'left',
          locale: {
            format: format,
            cancelLabel: t('Hủy'),
            applyLabel: t('Áp dụng'),
            customRangeLabel: t('Tùy chỉnh'),
            daysOfWeek: ['CN', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7'],
            monthNames: [
              'Tháng Một',
              'Tháng Hai',
              'Tháng Ba',
              'Tháng Tư',
              'Tháng Năm',
              'Tháng Sáu',
              'Tháng Bảy',
              'Tháng Tám',
              'Tháng Chín',
              'Tháng Mười',
              'Tháng Mười Một',
              'Tháng Mười Hai',
            ],
          },

          ranges: {
            'Tất cả': ['', ''],
            // 'Hôm qua': [
            //   moment().subtract(1, 'day').startOf('day'),
            //   moment().subtract(1, 'day').endOf('day'),
            // ],
            'Tuần này': [moment().startOf('week').add(1, 'days'), moment()],
            '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
            '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
            'Tháng trước': [
              moment().subtract(1, 'month').startOf('month'),
              moment().subtract(1, 'month').endOf('month'),
            ],
            'Tháng này': [moment().startOf('month'), moment()],
          },
        }}
      >
        <input
          style={{
            // position: 'absolute',
            color: 'transparent',
            height: '38px',
            width: '0px',
            // bottom: '0%'
          }}
          className="cursor-pointer rounded p-0"
        />
      </DateRangePicker>
    </div>
  );
}

export default DateRangePickerInput;
