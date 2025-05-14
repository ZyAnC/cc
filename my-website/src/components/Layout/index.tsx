import React, { useState, useEffect } from 'react';
import { Layout as AntLayout, Menu, Button, Space, Divider, Input, message, Typography } from 'antd';
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
import logo from '../../assets/Lindstrom_logo_RGB.jpg';

const { Header, Content, Sider } = AntLayout;
const { Text } = Typography;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.slice(1);

  const [searchText, setSearchText] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithDetails | null>(null);
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([]);
  const [collapsed, setCollapsed] = useState(false);
  const [searchResults, setSearchResults] = useState<EmployeeWithDetails[]>([]);
  const [showResults, setShowResults] = useState(false);

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
    if (value.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      setSelectedEmployee(null);
      return;
    }

    const results = employees.filter(employee => 
      employee.name.toLowerCase().includes(value.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(results);
    setShowResults(true);
    
    if (results.length === 1) {
      handleSelectEmployee(results[0]);
    }
  };

  const handleSelectEmployee = (employee: EmployeeWithDetails) => {
    setSearchText('');
    setShowResults(false);
    setSelectedEmployee(employee);
    // 触发自定义事件通知其他组件
    const event = new CustomEvent('employeeSelected', { detail: employee });
    window.dispatchEvent(event);
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
    // // 暂时禁用 locations 的点击功能
    // if (key === 'locations') {
    //   return; // 直接返回，不执行任何操作
    // }
    navigate(`/${key}`);
  };

  const renderBottomButtons = () => {
    if (location.pathname.startsWith('/employee')) {
      return (
        <Space direction="vertical" style={{ width: '100%', padding: '0 16px', position: 'relative' }}>
          <div style={{ marginBottom: '16px', position: 'relative' }}>
            <Input
              prefix={<SearchOutlined />}
              placeholder="Search by name or employee ID"
              value={searchText}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => setShowResults(true)}
              style={{ 
                borderRadius: '20px',
                height: '32px',
                backgroundColor: '#f5f5f5',
                border: 'none'
              }}
            />
            {showResults && searchResults.length > 0 && (
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  borderRadius: '4px',
                  zIndex: 1000,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  marginTop: '4px'
                }}
              >
                {searchResults.map(employee => (
                  <div
                    key={employee.id}
                    onClick={() => handleSelectEmployee(employee)}
                    style={{
                      padding: '8px 12px',
                      cursor: 'pointer',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = '#f5f5f5';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = 'white';
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px'
                      }}
                    >
                      {employee.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{employee.name}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {employee.role?.job_title || 'No title'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ backgroundColor: '#003f72', marginBottom: 12 }}
            block
            onClick={() => window.dispatchEvent(new Event('openNewEmployeeModal'))}
          >
            New employee
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
      <Header style={{ background: '#fff', padding: 0, borderBottom: '1px solid #e8e8e8', height: '96px', display: 'block' }}>
        {/* 第一行：logo+主导航+用户信息 */}
        <div style={{ display: 'flex', alignItems: 'center', height: 48, padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 180 }}>
            <img src={logo} alt="Lindström Logo" style={{ height: 32, marginRight: 8 }} />
           
          </div>
          
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 32, marginLeft: 40 }}>
            <span style={{ fontWeight: 500, fontSize: 16, color: '#222', cursor: 'pointer' }}>Lindström</span>
            <span style={{ fontWeight: 500, fontSize: 16, color: '#222', cursor: 'pointer' }}>Store</span>
            <span style={{ fontWeight: 500, fontSize: 16, color: '#fff', background: '#00395d', borderRadius: 4, padding: '4px 16px', cursor: 'pointer' }}>eLindström</span>
            <span style={{ fontWeight: 500, fontSize: 16, color: '#222', cursor: 'pointer' }}>eComforta</span>
          </div>
          <div style={{ minWidth: 320, textAlign: 'right', fontSize: 14 }}>
            <span style={{ color: '#888' }}>Welcome, </span>
            <span style={{ fontWeight: 600, color: '#222' }}>Manager</span>
            <span style={{ color: '#888', margin: '0 8px' }}>|</span>
            <span style={{ color: '#00395d', fontWeight: 500, cursor: 'pointer' }}>Sign Out</span>
          </div>
        </div>
        {/* 第二行：功能导航 */}
        <div style={{ display: 'flex', alignItems: 'center', height: 48, padding: '0 16px' }}>
          <HomeOutlined style={{ fontSize: 20, marginRight: 16, color: '#222' }} onClick={() => navigate('/')} />
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname.split('/')[1] || 'accounts']}
            items={navItems}
            style={{ flex: 1, border: 'none', fontWeight: 600, fontSize: 15, background: 'none' }}
            className="main-nav-menu"
          />
          <ShoppingCartOutlined style={{ fontSize: 20, marginLeft: 16, color: '#222' }} />
        </div>
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