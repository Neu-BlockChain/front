import { Layout, Row, Typography } from 'antd';
import React from 'react';
import styles from './Guide.less';

interface Props {
  name: string;
}

// 脚手架示例组件
const Guide: React.FC<Props> = (props) => {
  const { name } = props;
  return (
    <Layout>
      <Row>
        <Typography.Title level={3} className={styles.title}>
        中国科学院——甲烷排放额交易区块链平台
        </Typography.Title>
      </Row>
    </Layout>
  );
};

export default Guide;
