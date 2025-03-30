import React from 'react';
import { Button, Select, Table, Space } from 'antd';
import { useParams } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

interface ProductItem {
  garmentCode: string;
  size: string;
  labels: string;
  modifications: string;
  locker: string;
  servicedLatest: string;
  servicedStatus: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams();

  // 模拟数据
  const productItems: ProductItem[] = [
    {
      garmentCode: '301588F84000008002560D3E1',
      size: '42',
      labels: 'SELKAMERKKI, RINTAMERKKI VASEN, NIMILOGO OIKEA',
      modifications: 'LEG SHORTENING -6 CM',
      locker: '21-2',
      servicedLatest: '16/10/2024',
      servicedStatus: 'Laundry Out'
    },
    {
      garmentCode: '301588F84000008002560D383',
      size: '42',
      labels: 'SELKAMERKKI, RINTAMERKKI VASEN, NIMILOGO OIKEA',
      modifications: 'LEG SHORTENING -6 CM',
      locker: '21-2',
      servicedLatest: '23/10/2024',
      servicedStatus: 'Laundry Out'
    },
    // 可以添加更多数据
  ];

  const columns: ColumnsType<ProductItem> = [
    {
      title: 'Garment code',
      dataIndex: 'garmentCode',
      key: 'garmentCode',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Labels',
      dataIndex: 'labels',
      key: 'labels',
    },
    {
      title: 'Modifications',
      dataIndex: 'modifications',
      key: 'modifications',
    },
    {
      title: 'Locker',
      dataIndex: 'locker',
      key: 'locker',
    },
    {
      title: 'Serviced latest',
      dataIndex: 'servicedLatest',
      key: 'servicedLatest',
      render: (text: string, record: ProductItem) => (
        <>
          {text}
          <br />
          <span style={{ color: '#666' }}>{record.servicedStatus}</span>
        </>
      ),
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <Space size="small">
          ⋯
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '16px 24px' }}>
      <div style={{ 
        background: '#fff', 
        padding: '16px', 
        borderRadius: '4px',
        marginBottom: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img 
              src="/path/to/product-image.jpg" 
              alt="Product" 
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
            <div>
              <h2 style={{ margin: 0 }}>1V5260 ANTTI OVERALL M BLACK/SGREY</h2>
              <p style={{ margin: '8px 0', color: '#666' }}>
                11 pcs | Serviced last on: 23/10/2024 | <a href="#">Collapse</a>
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Select
              defaultValue="42"
              style={{ width: 120 }}
            >
              <Select.Option value="42">42</Select.Option>
              <Select.Option value="44">44</Select.Option>
              <Select.Option value="46">46</Select.Option>
            </Select>
            <Button type="primary" style={{ backgroundColor: '#00395d' }}>
              Add to order
            </Button>
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={productItems}
          pagination={false}
          size="middle"
        />
      </div>
    </div>
  );
};

export default ProductDetail; 