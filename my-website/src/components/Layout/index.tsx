import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Button, Space, Divider, Input, message } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeOutlined,
  UserOutlined,
  CompassOutlined,
  FileTextOutlined,
  BellOutlined,
  ToolOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  BookOutlined,
  CalculatorOutlined,
  SearchOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { employeeService, EmployeeWithDetails } from '../../services/employeeService';

const { Header, Content, Sider } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.slice(1);

  const [searchText, setSearchText] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithDetails | null>(null);
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([]);

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filteredEmployee = employees.find(emp => 
      emp.name.toLowerCase().includes(value.toLowerCase()) ||
      String(emp.employee_id).toLowerCase().includes(value.toLowerCase())
    );
    if (filteredEmployee) {
      setSelectedEmployee(filteredEmployee);
      // 触发事件通知 Employee 组件更新
      const event = new CustomEvent('employeeSelected', { detail: filteredEmployee });
      window.dispatchEvent(event);
    }
  };

  const handleButtonClick = (type: string) => {
    if (selectedEmployee) {
      navigate(`/employee/${type.toLowerCase()}`);
    } else {
      message.warning('请先选择一个员工');
    }
  };

  // 顶部导航项
  const navItems = [
    { key: 'accounts', label: 'Accounts', icon: <UserOutlined /> },
    { key: 'routes', label: 'Routes', icon: <CompassOutlined /> },
    { key: 'requests', label: 'Requests', icon: <FileTextOutlined /> },
    { key: 'feedback', label: 'Feedback', icon: <FileTextOutlined /> },
    { key: 'reports', label: 'Reports', icon: <BellOutlined /> },
    { key: 'announcements', label: 'Announcements', icon: <BellOutlined /> },
    { key: 'notifications', label: 'Notifications', icon: <BellOutlined /> },
    { key: 'workorders', label: 'Work orders', icon: <ToolOutlined /> }
  ];

  // 左侧菜单项
  const sideMenuItems = [
    { 
      key: 'visits', 
      label: 'Visits', 
      icon: <ShoppingOutlined />,
      style: { height: '40px', lineHeight: '40px' }
    },
    { 
      key: 'locations', 
      label: 'Locations', 
      icon: <EnvironmentOutlined />,
      style: currentPath === 'locations' 
        ? { height: '40px', lineHeight: '40px', backgroundColor: '#00395d', color: 'white' } 
        : { height: '40px', lineHeight: '40px' }
    },
    { 
      key: 'employee', 
      label: 'Employee', 
      icon: <UserOutlined />,
      style: currentPath === 'employee' 
        ? { height: '40px', lineHeight: '40px', backgroundColor: '#00395d', color: 'white' } 
        : { height: '40px', lineHeight: '40px' }
    },
    { 
      key: 'optimisation', 
      label: 'Optimization Recs.', 
      icon: <BarChartOutlined />,
      style: { height: '40px', lineHeight: '40px' }
    },
    { 
      key: 'collection', 
      label: 'Collection', 
      icon: <BookOutlined />,
      style: { height: '40px', lineHeight: '40px' }
    },
    { 
      key: 'sustainability', 
      label: 'Sustainability calculator', 
      icon: <CalculatorOutlined />,
      style: { height: '40px', lineHeight: '40px' }
    }
  ];

  const handleMenuClick = (key: string) => {
    // 暂时禁用 locations 的点击功能
    if (key === 'locations') {
      return; // 直接返回，不执行任何操作
    }
    navigate(`/${key}`);
  };

  const renderBottomButtons = () => {
    if (location.pathname.startsWith('/employee')) {
      return (
        <Space direction="vertical" style={{ width: '100%', padding: '0 16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Employee Lookup"
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              style={{ 
                borderRadius: '20px',
                height: '32px',
                backgroundColor: '#f5f5f5',
                border: 'none'
              }}
            />
          </div>
          <Button 
            block 
            style={{ 
              height: '40px',
              borderRadius: '20px', 
              textAlign: 'left', 
              paddingLeft: '16px',
              border: '1px solid #d9d9d9',
              boxShadow: 'none',
              backgroundColor: location.pathname.includes('/role') ? '#00395d' : undefined,
              color: location.pathname.includes('/role') ? 'white' : undefined
            }}
            onClick={() => handleButtonClick('role')}
          >
            Role
          </Button>
          <Button 
            block 
            style={{ 
              height: '40px',
              borderRadius: '20px', 
              textAlign: 'left', 
              paddingLeft: '16px',
              border: '1px solid #d9d9d9',
              boxShadow: 'none',
              backgroundColor: location.pathname.includes('/access') ? '#00395d' : undefined,
              color: location.pathname.includes('/access') ? 'white' : undefined
            }}
            onClick={() => handleButtonClick('access')}
          >
            Access Auth.
          </Button>
          <Button 
            block 
            style={{ 
              height: '40px',
              borderRadius: '20px', 
              textAlign: 'left', 
              paddingLeft: '16px',
              border: '1px solid #d9d9d9',
              boxShadow: 'none',
              backgroundColor: location.pathname.includes('/training') ? '#00395d' : undefined,
              color: location.pathname.includes('/training') ? 'white' : undefined
            }}
            onClick={() => handleButtonClick('training')}
          >
            Training & Certification
          </Button>
          <Button 
            block 
            style={{ 
              height: '40px',
              borderRadius: '20px', 
              textAlign: 'left', 
              paddingLeft: '16px',
              border: '1px solid #d9d9d9',
              boxShadow: 'none',
              backgroundColor: location.pathname.includes('/tasks') ? '#00395d' : undefined,
              color: location.pathname.includes('/tasks') ? 'white' : undefined
            }}
            onClick={() => handleButtonClick('tasks')}
          >
            Tasks
          </Button>
        </Space>
      );
    }

    return (
      <Space direction="vertical" style={{ width: '100%', padding: '0 16px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          block 
          style={{ backgroundColor: '#00395d' }}
          onClick={() => navigate('/new-order')}
        >
          New order
        </Button>
        <Button block>Repair request</Button>
        <Button block>Return request</Button>
        <Button block>Change Size</Button>
        <Button block>Service request</Button>
        <Button block>Add new employees</Button>
      </Space>
    );
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 16px', 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: '1px solid #e8e8e8',
        height: '48px'
      }}>
        <HomeOutlined 
          style={{ fontSize: '20px', marginRight: '24px', cursor: 'pointer' }} 
          onClick={() => navigate('/')}
        />
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname.split('/')[1] || 'home']}
          items={navItems}
          style={{ flex: 1, border: 'none' }}
        />
        <ShoppingCartOutlined style={{ fontSize: '20px' }} />
      </Header>
      <AntLayout>
        <Sider width={250} theme="light" style={{ 
          borderRight: '1px solid #e8e8e8',
          backgroundColor: '#fff'
        }}>
          <Menu
            mode="inline"
            selectedKeys={[currentPath]}
            items={sideMenuItems}
            style={{ 
              height: 'auto', 
              borderRight: 0,
              backgroundColor: '#fff'
            }}
            onClick={({ key }) => handleMenuClick(key)}
          />
          <Divider style={{ margin: '12px 0' }} />
          {renderBottomButtons()}
        </Sider>
        <Content style={{ background: '#fff' }}>
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout; 