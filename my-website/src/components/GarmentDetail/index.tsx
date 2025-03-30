import React, { useState } from 'react';
import { Table, Button, Select, Typography, Space, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

interface GarmentDetailProps {
  onBack?: () => void;
}

interface GarmentRecord {
  garmentCode: string;
  size: string;
  labels: string;
  modifications: string;
  locker: string;
  servicedLatest: string;
  status: string;
  location: string;
}

const GarmentDetail: React.FC<GarmentDetailProps> = ({ onBack }) => {
  const [selectedQuantity, setSelectedQuantity] = useState<string>('42');

  const columns: ColumnsType<GarmentRecord> = [
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
    },
    {
      title: '',
      key: 'actions',
      render: () => (
        <Button type="link">•••</Button>
      ),
    },
  ];

  const data: GarmentRecord[] = [
    {
      garmentCode: '301588F84000008000256D3E1',
      size: '42',
      labels: 'SELKAMERKKI, RINTAMERKKI VASEN, NIMILOGO OIKEA',
      modifications: 'LEG SHORTENING -6 CM',
      locker: '21-2',
      servicedLatest: '16/10/2024',
      status: 'Laundry Out',
      location: '',
    },
    {
      garmentCode: '301588F84000008000256D383',
      size: '42',
      labels: 'SELKAMERKKI, RINTAMERKKI VASEN, NIMILOGO OIKEA',
      modifications: 'LEG SHORTENING -6 CM',
      locker: '21-2',
      servicedLatest: '23/10/2024',
      status: 'Laundry Out',
      location: '',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {onBack && (
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={onBack}
          style={{ marginBottom: '16px' }}
        >
          返回
        </Button>
      )}
      <Card>
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
          <div style={{ width: '200px', height: '240px', background: '#f0f0f0' }}>
            <img src="/path/to/garment/image" alt="Garment" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1 }}>
            <Title level={4}>SELKAMERKKI RINTAMERKKI</Title>
            <Text>11 pcs | Serviced last on: 23/10/2024 | </Text>
            <Button type="link" style={{ padding: 0 }}>Collapse</Button>
            
            <div style={{ marginTop: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
              <Select
                value={selectedQuantity}
                onChange={setSelectedQuantity}
                style={{ width: '120px' }}
              >
                {Array.from({ length: 50 }, (_, i) => i + 1).map(num => (
                  <Option key={num} value={num}>{num}</Option>
                ))}
              </Select>
              <Button type="primary">Add to order</Button>
            </div>
          </div>
        </div>

        <Table 
          columns={columns} 
          dataSource={data}
          pagination={false}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default GarmentDetail; 