import PropTypes from 'prop-types';
import Utils from 'general/utils/Utils';

CardStat.propTypes = {
  icon: PropTypes.element,
  label: PropTypes.string,
  value: PropTypes.number,
  iconColor: PropTypes.string,
  growth: PropTypes.number,
  amount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]), // Thêm prop amount
};

CardStat.defaultProps = {
  icon: <></>,
  label: '',
  value: 0,
  iconColor: '',
  growth: 0,
  amount: '', // Giá trị mặc định
};

function CardStat(props) {
  // MARK: ---- Params ----
  const { icon, label, value, iconColor, growth, amount } = props;

  return (
    <div className="rounded p-6 bg-white h-100">
      <div className="d-flex flex-row align-items-center justify-content-between">
        <div>
          <p
            className="font-weight-bold font-size-h3"
            style={{ color: Utils.hexToRGBA('#202224', 0.7) }}
          >
            {label}
          </p>
          <p className="text-body-emphasis font-weight-bolder font-size-h1">
            {Utils.formatNumber(value)}
          </p>
          {amount && ( 
            <p className="font-size-h5" style={{ color: '#6c757d' }}>
              {typeof amount === 'number' ? `${Utils.formatNumber(amount)}đ` : amount}
            </p>
          )}
        </div>
        <div className="p-4 rounded-2" style={{ backgroundColor: Utils.hexToRGBA(iconColor, 0.2) }}>
          {icon}
        </div>
      </div>
      {!!growth ? (
        <h6>
          <i
            className={`fa-regular fa-arrow-trend-${growth > 0 ? 'up' : 'down'} fa-lg`}
            style={{ color: growth > 0 ? '#00b69b' : '#F93C65' }}
          ></i>
          <span style={{ color: growth > 0 ? '#00b69b' : '#F93C65' }}>{` ${Utils.formatNumber(
            growth > 0 ? growth : growth * -1
          )}%`}</span>
          <span style={{ color: Utils.hexToRGBA('#202224', 0.7) }} className="text-lowercase">{` ${
            growth > 0 ? 'UpLastMonth' : 'DownLastMonth'
          }`}</span>
        </h6>
      ) : null}
    </div>
  );
}

export default CardStat;
