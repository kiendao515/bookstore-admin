import React, { useEffect, useState } from 'react';
import { Layout, Row, Col } from 'antd';
import CardStat from './components/CardStat';
import Utils from 'general/utils/Utils';
import axios from 'axios';
import { Spinner } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import CardBarChart from './components/CardBarChart';
import DateRangePickerInput from 'general/components/Form/DateRangePicker';
import moment from 'moment';
import CardAreaChart from './components/CardAreaChart';
import reportApi from 'api/reportApi';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const { Content } = Layout;

const Dashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [topBuyers, setTopBuyers] = useState([]);
  const [revenueByDate, setRevenueByDate] = useState([])
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(6, 'days').toISOString(),
    endDate: moment().toISOString(),
  });

  const fetchData = async (range) => {
    try {
      setLoading(true);
      const { startDate, endDate } = range;

      const response = await reportApi.getListReport(startDate,endDate)
      if (response.result) {
        setStatistics(response.data);
      }

      const categoryResponse = await reportApi.getListTopCategory(startDate,endDate)
      if (categoryResponse?.result) {
        setCategories(categoryResponse.data);
      }

      const buyerResponse = await reportApi.getListTopBuyer(startDate, endDate)
      if (buyerResponse?.result) {
        setTopBuyers(buyerResponse.data);
      }

      const revenue = await reportApi.getRevenue(startDate,endDate)
      if (revenue?.result) {
        setRevenueByDate(revenue.data)
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(dateRange);
  }, []);

  const handleDateChange = (range) => {
    setDateRange({
      startDate: range.startDate.toISOString(),
      endDate: range.endDate.toISOString(),
    });
    fetchData({
      startDate: range.startDate.toISOString(),
      endDate: range.endDate.toISOString(),
    });
  };

  if (loading) {
    return <Spinner />;
  }

  // const { ready_to_confirm, ready_to_package, ready_to_ship, shipping, done, cancel } = statistics;
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px', margin: 0 }}>
        <Row gutter={[16, 16]}>
          <Col span={18}>
            <h1>Doanh thu: {Utils.formatNumber(statistics?.done?.amount)}đ</h1>
          </Col>
          <Col span={6}>
            <DateRangePickerInput
              initialLabel="7 ngày gần đây"
              initialEndDate={moment()}
              initialStartDate={moment().subtract(6, 'days')}
              getDateRange={handleDateChange}
              customRange={{
                'Tuần này': [moment().startOf('week'), moment()],
                '7 ngày gần đây': [moment().subtract(6, 'days'), moment()],
                '30 ngày gần đây': [moment().subtract(29, 'days'), moment()],
                'Tháng trước': [
                  moment().subtract(1, 'month').startOf('month'),
                  moment().subtract(1, 'month').endOf('month'),
                ],
                'Tháng này': [moment().startOf('month'), moment()],
              }}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col span={8}>
            <CardStat
              icon={<i className="fa-duotone fa-box fa-2xl" style={{ '--fa-primary-color': '#00b505', '--fa-secondary-color': '#00b505' }}></i>}
              iconColor="#00b505"
              label="Chờ xác nhận"
              growth={statistics?.ready_to_confirm?.percent_change}
              value={statistics?.ready_to_confirm?.quantity}
              amount={`${Utils.formatNumber(statistics?.ready_to_confirm?.amount)} đ`}
            />
          </Col>
          <Col span={8}>
            <CardStat
              icon={<i className="fa-duotone fa-box-circle-check fa-2l" style={{ '--fa-primary-color': '#3388EC', '--fa-secondary-color': '#3388EC' }}></i>}
              iconColor="#3388EC"
              label="Chờ gói hàng"
              growth={statistics?.ready_to_package?.percent_change}
              value={statistics?.ready_to_package?.quantity}
              amount={`${Utils.formatNumber(statistics?.ready_to_package?.amount)} đ`}
            />
          </Col>
          <Col span={8}>
            <CardStat
              icon={<i className="fa-regular fa-arrow-rotate-left fa-2xl" style={{ color: '#ffb700' }}></i>}
              iconColor="#ffb700"
              label="Sẵn sàng gửi"
              growth={statistics?.ready_to_ship?.percent_change}
              value={statistics?.ready_to_ship?.quantity}
              amount={`${Utils.formatNumber(statistics?.ready_to_ship?.amount)} đ`}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <CardStat
              icon={<i className="fa-regular fa-truck fa-2xl" style={{ color: '#3388EC' }}></i>}
              iconColor="#3388EC"
              label="Đang gửi"
              growth={statistics?.shipping?.percent_change}
              value={statistics?.shipping?.quantity}
              amount={`${Utils.formatNumber(statistics?.shipping?.amount)} đ`}
            />
          </Col>
          <Col span={8}>
            <CardStat
              icon={<i className="fa-regular fa-check-circle fa-2xl" style={{ color: '#00b505' }}></i>}
              iconColor="#00b505"
              label="Thành công"
              growth={statistics?.done?.percent_change}
              value={statistics?.done?.quantity}
              amount={`${Utils.formatNumber(statistics?.done?.amount)} đ`}
            />
          </Col>
          <Col span={8}>
            <CardStat
              icon={<i className="fa-regular fa-times-circle fa-2xl" style={{ color: '#EC3B31' }}></i>}
              iconColor="#EC3B31"
              label="Hủy đơn"
              growth={statistics?.cancel?.percent_change}
              value={statistics?.cancel?.quantity}
              amount={`${Utils.formatNumber(statistics?.cancel?.amount)} đ`}
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ margintop: 20 }}>
          <Col span={24}>
            <CardAreaChart
              fill={false}
              additionalClassName=""
              fullChartLabels={revenueByDate?.map((item) => item.date)} // Sử dụng 'date' thay vì 'label'
              loading={loading}
              title="Doanh thu theo ngày"
              chartLabels={revenueByDate?.map((item) => Utils.formatDateTime(item.date, 'DD/MM'))} // Cập nhật theo 'date'
              chartSeries={[
                {
                  name: "Doanh thu",
                  data: revenueByDate?.map((item) => item.revenue), // Sử dụng 'revenue' thay vì 'value'
                },
              ]}
              chartColors={['#4CAF50']}  // Màu xanh cho biểu đồ doanh thu
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
          <Col span={12}>
            <CardBarChart
              title="Top 10 Danh Mục Bán Chạy Nhất"
              subTitle="Theo số lượng sách bán"
              chartLabels={categories.map((category) => category.name)}
              chartSeries={categories.map((category) => category.total_sold)}
              loading={loading}
              chartColors={[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].reverse().map((item) => Utils.blurColor('#74D7A7', item))}
            />
          </Col>
          <Col span={12}>
            <CardBarChart
              title="Top 5 Người Mua Hàng Nhiều Nhất"
              subTitle="Theo tổng số tiền mua"
              chartColors={[0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].reverse().map((item) => Utils.blurColor('#ffcc00', item))}
              chartLabels={topBuyers.map((buyer) => `${buyer.name || 'Unknown'} - ${buyer.phone || 'Unknown'}`)}
              chartSeries={topBuyers.map((buyer) => buyer.total_amount)}
              loading={loading}
            />
          </Col>
        </Row>
    
      </Content>
    </Layout>
  );
};

export default Dashboard;
