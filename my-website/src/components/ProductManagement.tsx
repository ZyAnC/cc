import React, { useState, useEffect } from 'react';
import { Layout, Menu, Switch, Select, Button, Typography, Space, Divider } from 'antd';
import {
  HomeOutlined,
  UserOutlined,
  CompassOutlined,
  FileTextOutlined,
  BellOutlined,
  ToolOutlined,
  PlusOutlined,
  SettingOutlined,
  LineChartOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  BookOutlined,
  CalculatorOutlined,
  ShoppingCartOutlined,
  DownOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface Product {
  id: string;
  name: string;
  quantity: number;
  users: number;
  sizes: string[];
  image: string;
  description?: string;
  optimisationEnabled: boolean;
}

const ProductManagement: React.FC = () => {
  // 模拟数据
  const mockProducts: Product[] = [
    {
      id: '1V5260',
      name: 'ANTTI OVERALL M BLACK/SGREY',
      quantity: 635,
      users: 68,
      sizes: ['42', '44', '46', '48', '50', '52', '54', '56', '58', '62', '64'],
      image: '/path/to/overall.jpg',
      optimisationEnabled: false
    },
    {
      id: '1L0712',
      name: 'CE FALK TROUSERS CL1 FLY',
      quantity: 11,
      users: 4,
      sizes: ['48', '50', '52'],
      image: '/path/to/trousers.jpg',
      description: 'EN ISO 20471:2013, visibility class 1. High Visibility trousers. Large leg pockets at both sides, hidden press buttons at pocket flaps. Patch pockets at back.',
      optimisationEnabled: false
    }
  ];

  const [products] = useState<Product[]>(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<string>('product_name');
  const [sortedProducts, setSortedProducts] = useState<Product[]>(mockProducts);

  // 处理排序
  useEffect(() => {
    let sorted = [...products];
    switch (sortBy) {
      case 'product_name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'product_name_desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'quantity_asc':
        sorted.sort((a, b) => a.quantity - b.quantity);
        break;
      case 'quantity_desc':
        sorted.sort((a, b) => b.quantity - a.quantity);
        break;
      case 'users_asc':
        sorted.sort((a, b) => a.users - b.users);
        break;
      case 'users_desc':
        sorted.sort((a, b) => b.users - a.users);
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  }, [sortBy, products]);

  // 顶部导航项
  const navItems = [
    { key: 'accounts', label: 'Accounts', icon: <UserOutlined /> },
    { key: 'routes', label: 'Routes', icon: <CompassOutlined /> },
    { key: 'requests', label: 'Requests', icon: <FileTextOutlined /> },
    { key: 'feedback', label: 'Feedback', icon: <SettingOutlined /> },
    { key: 'reports', label: 'Reports', icon: <LineChartOutlined /> },
    { key: 'announcements', label: 'Announcements', icon: <BellOutlined /> },
    { key: 'notifications', label: 'Notifications', icon: <BellOutlined /> },
    { key: 'workorders', label: 'Work orders', icon: <ToolOutlined /> }
  ];

  // 左侧菜单项
  const sideMenuItems = [
    { key: 'visits', label: 'Visits', icon: <ShoppingOutlined /> },
    { key: 'locations', label: 'Locations', icon: <EnvironmentOutlined />, style: { backgroundColor: '#00395d', color: 'white' } },
    { key: 'optimisation', label: 'Optimisation recommendations', icon: <BarChartOutlined /> },
    { key: 'collection', label: 'Collection', icon: <BookOutlined /> },
    { key: 'sustainability', label: 'Sustainability calculator', icon: <CalculatorOutlined /> }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      

      <Layout>
      

        <Layout style={{ padding: '16px 24px' }}>
          <Content style={{ background: '#fff', padding: '16px', borderRadius: '4px' }}>
            <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
              <Select
                style={{ width: 200 }}
                placeholder="Product category"
                onChange={(value) => setSelectedCategory(value)}
                suffixIcon={<DownOutlined />}
              >
                <Option value="all">&lt;All&gt;</Option>
                <Option value="overalls">Overalls</Option>
                <Option value="trousers">Trousers</Option>
              </Select>
              <Select
                style={{ width: 200 }}
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                suffixIcon={<DownOutlined />}
              >
                <Option value="product_name">Product name A-Z</Option>
                <Option value="product_name_desc">Product name Z-A</Option>
                <Option value="quantity_asc">Quantity (Low to High)</Option>
                <Option value="quantity_desc">Quantity (High to Low)</Option>
                <Option value="users_asc">Users (Low to High)</Option>
                <Option value="users_desc">Users (High to Low)</Option>
              </Select>
            </div>

            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
              1398 items, 19 Products
            </Text>

            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              {sortedProducts.map(product => (
                <div key={product.id} style={{ border: '1px solid #e8e8e8', padding: '16px', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ width: 120, height: 120 }}>
                      <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <Title level={5} style={{ margin: 0 }}>{product.name}</Title>
                        <div>
                          <Text>Optimisation</Text>
                          <Switch
                            checked={product.optimisationEnabled}
                            style={{ marginLeft: 8 }}
                          />
                        </div>
                      </div>
                      <Text style={{ color: '#666' }}>
                        Quantity: {product.quantity} Users: {product.users} Sizes: {product.sizes.join(', ')}
                      </Text>
                      {product.description && (
                        <Text type="secondary" style={{ display: 'block', marginTop: 8 }}>
                          {product.description}
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Space>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default ProductManagement; 