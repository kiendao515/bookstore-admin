import React from 'react';
import { Layout, Row, Col, Card, Statistic, Progress, Icon } from 'antd';
import { DesktopOutlined, ContainerOutlined, TeamOutlined } from '@ant-design/icons';

const { Content } = Layout;

const Dashboard = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '24px', margin: 0 }}>
        <Row gutter={16}>
          {/* First Row */}
          <Col span={8}>
            <Card bordered={false} title="Total Sales">
              <Statistic
                title="Amount"
                value={112893}
                precision={2}
                prefix="$"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} title="Revenue">
              <Statistic
                title="Amount"
                value={28732}
                precision={2}
                prefix="$"
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} title="Tasks Completed">
              <Statistic
                title="Completed"
                value={87}
                suffix="%"
                valueStyle={{ color: '#3f8600' }}
              />
              <Progress percent={87} size="small" />
            </Card>
          </Col>
        </Row>

        <Row gutter={16} style={{ marginTop: 16 }}>
          {/* Second Row */}
          <Col span={8}>
            <Card bordered={false} title="Users">
              <Statistic
                title="Total Users"
                value={50234}
                suffix={<TeamOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} title="Server Status">
              <Statistic
                title="Status"
                value="Active"
                suffix={<DesktopOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card bordered={false} title="System Storage">
              <Statistic
                title="Used Space"
                value={68}
                suffix="%"
                valueStyle={{ color: '#cf1322' }}
              />
              <Progress percent={68} size="small" />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Dashboard;
