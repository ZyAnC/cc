import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Typography, Space, message, Table, Switch, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { employeeService, EmployeeWithDetails, EmployeeRole } from '../../services/employeeService';
import { useParams, useLocation } from 'react-router-dom';

const { Text, Title } = Typography;
const { Option } = Select;

interface RoleData extends Omit<EmployeeRole, 'authorized'> {
  zonal_access: string;
}

interface AccessData extends Omit<EmployeeRole, 'reporting_officer'> {
  zonal_access: string;
}

// 定义底部按钮数据
const bottomButtons = [
  { key: 'roles', title: 'Roles' },
  { key: 'access', title: 'Access Authorization' },
  { key: 'training', title: 'Training & Certification' },
  { key: 'tasks', title: 'Tasks' }
];

const Employee: React.FC = () => {
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeWithDetails | null>(null);
  const [selectedWorkTitle, setSelectedWorkTitle] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const { type } = useParams<{ type: string }>();

  useEffect(() => {
    // 添加事件监听
    const handleEmployeeSelected = (event: CustomEvent<EmployeeWithDetails>) => {
      setSelectedEmployee(event.detail);
    };

    window.addEventListener('employeeSelected', handleEmployeeSelected as EventListener);

    return () => {
      window.removeEventListener('employeeSelected', handleEmployeeSelected as EventListener);
    };
  }, []);

  const getWorkTitles = () => {
    if (!selectedEmployee) return [];
    
    const titles = new Set<string>();
    
    // 添加单个角色的 title
    if (selectedEmployee.role?.job_title) {
      titles.add(selectedEmployee.role.job_title);
    }
    
    // 添加所有角色的 titles
    if (Array.isArray(selectedEmployee.roles)) {
      selectedEmployee.roles.forEach(role => {
        if (role.job_title) {
          titles.add(role.job_title);
        }
      });
    }
    
    return ['all', ...Array.from(titles)];
  };

  const getRoleData = () => {
    if (!selectedEmployee) return [];
    
    const roles = [];
    
    if (Array.isArray(selectedEmployee.roles) && selectedEmployee.roles.length > 0) {
      const filteredRoles = selectedEmployee.roles.filter(role => 
        selectedWorkTitle === 'all' || role.job_title === selectedWorkTitle
      );
      
      return filteredRoles.map((role, index) => ({
        key: `role-${index}`,
        id: role.id,
        job_title: role.job_title,
        department: role.department,
        division: role.division,
        location: role.location,
        zonal_access: role.zone_access,
        reporting_officer: role.reporting_officer
      }));
    }
    
    if (selectedEmployee.role && (selectedWorkTitle === 'all' || selectedEmployee.role.job_title === selectedWorkTitle)) {
      roles.push({
        key: 'role-current',
        id: selectedEmployee.role.id,
        job_title: selectedEmployee.role.job_title,
        department: selectedEmployee.role.department,
        division: selectedEmployee.role.division,
        location: selectedEmployee.role.location,
        zonal_access: selectedEmployee.role.zone_access,
        reporting_officer: selectedEmployee.role.reporting_officer
      });
    }
    
    return roles;
  };

  const getAccessData = () => {
    if (!selectedEmployee) return [];
    
    const accesses = [];
    
    if (Array.isArray(selectedEmployee.access_authorizations) && selectedEmployee.access_authorizations.length > 0) {
      const filteredAccesses = selectedEmployee.access_authorizations.filter(access => 
        selectedWorkTitle === 'all' || access.job_title === selectedWorkTitle
      );
      
      return filteredAccesses.map((access, index) => ({
        key: `access-${index}`,
        id: access.id,
        job_title: access.job_title,
        department: access.department,
        division: access.division,
        location: access.location,
        zonal_access: access.zone_access,
        authorized: access.authorized !== undefined ? access.authorized : true
      }));
    }
    
    if (selectedEmployee.role && (selectedWorkTitle === 'all' || selectedEmployee.role.job_title === selectedWorkTitle)) {
      accesses.push({
        key: 'access-current',
        id: selectedEmployee.role.id,
        job_title: selectedEmployee.role.job_title,
        department: selectedEmployee.role.department,
        division: selectedEmployee.role.division,
        location: selectedEmployee.role.location,
        zonal_access: selectedEmployee.role.zone_access,
        authorized: selectedEmployee.role.authorized !== undefined ? selectedEmployee.role.authorized : true
      });
    }
    
    return accesses;
  };

  const handleAuthorizationChange = async (roleId: number, authorized: boolean) => {
    try {
      await employeeService.updateEmployeeRoleAuthorization(roleId, authorized);
      message.success('权限更新成功');
      
      // 更新本地状态
      if (selectedEmployee) {
        const updatedEmployee = { ...selectedEmployee };
        if (updatedEmployee.access_authorizations) {
          updatedEmployee.access_authorizations = updatedEmployee.access_authorizations.map(access => {
            if (access.id === roleId) {
              return { ...access, authorized };
            }
            return access;
          });
        }
        setSelectedEmployee(updatedEmployee);
      }
    } catch (error) {
      message.error('权限更新失败');
    }
  };

  const renderEmployeeInfo = () => (
    <>
      {/* Basic Information */}
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* First Row - Labels */}
        <Row gutter={[16, 0]}>
          <Col span={8}>
            <Text strong style={{ color: '#000', fontSize: '14px' }}>Name</Text>
          </Col>
          <Col span={8}>
            <Text strong style={{ color: '#000', fontSize: '14px' }}>Title</Text>
          </Col>
          <Col span={8}>
            <Text strong style={{ color: '#000', fontSize: '14px' }}>Hire Date</Text>
          </Col>
        </Row>

        {/* First Row - Values */}
        <Row gutter={[16, 16]} style={{ marginTop: '-16px' }}>
          <Col span={8}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '12px 16px',
              borderRadius: '8px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text>{selectedEmployee?.name || '-'}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '12px 16px',
              borderRadius: '8px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text>{selectedEmployee?.title || '-'}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '12px 16px',
              borderRadius: '8px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text>
                {selectedEmployee?.hire_date
                  ? new Date(selectedEmployee.hire_date).toLocaleDateString()
                  : '-'}
              </Text>
            </div>
          </Col>
        </Row>

        {/* Second Row - Labels */}
        <Row gutter={[16, 0]}>
          <Col span={8}>
            <Text strong style={{ color: '#000', fontSize: '14px' }}>Employee ID</Text>
          </Col>
          <Col span={8}>
            <Text strong style={{ color: '#000', fontSize: '14px' }}>Work Title</Text>
          </Col>
          <Col span={8}>
            <Text  style={{ color: '#000', fontSize: '14px' }}>Active Status</Text>
          </Col>
        </Row>

        {/* Second Row - Values */}
        <Row gutter={[16, 16]} style={{ marginTop: '-16px' }}>
          <Col span={8}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '12px 16px',
              borderRadius: '8px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text>{selectedEmployee?.employee_id || '-'}</Text>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '12px 16px',
              borderRadius: '8px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Select
                value={selectedWorkTitle}
                onChange={setSelectedWorkTitle}
                style={{ width: '100%' }}
              >
                {getWorkTitles().map(title => (
                  <Option key={title} value={title}>{title === 'all' ? 'All Titles' : title}</Option>
                ))}
              </Select>
            </div>
          </Col>
          <Col span={8}>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '12px 16px',
              borderRadius: '8px',
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Text>{selectedEmployee?.active_status ? 'Active' : 'Inactive'}</Text>
            </div>
          </Col>
        </Row>
      </Space>
    </>
  );

  const renderRoleInfo = () => {
    const columns = [
      { 
        title: 'Job Title', 
        dataIndex: 'job_title', 
        key: 'job_title',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Department', 
        dataIndex: 'department', 
        key: 'department',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Division', 
        dataIndex: 'division', 
        key: 'division',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Location', 
        dataIndex: 'location', 
        key: 'location',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Zonal Access', 
        dataIndex: 'zonal_access', 
        key: 'zonal_access',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Reporting Officer', 
        dataIndex: 'reporting_officer', 
        key: 'reporting_officer',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      }
    ];

    return (
      <div style={{ marginTop: '24px' }}>
        <Title level={3} style={{ color: '#003f72', textAlign: 'left', fontWeight: 'bold' }}>ROLE</Title>
        <Table 
          dataSource={getRoleData()} 
          columns={columns} 
          pagination={false}
          style={{ marginTop: '16px' }}
        />
      </div>
    );
  };

  const renderAccessInfo = () => {
    const columns = [
      { 
        title: 'Job Title', 
        dataIndex: 'job_title', 
        key: 'job_title',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Department', 
        dataIndex: 'department', 
        key: 'department',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Division', 
        dataIndex: 'division', 
        key: 'division',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Location', 
        dataIndex: 'location', 
        key: 'location',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Zonal Access', 
        dataIndex: 'zonal_access', 
        key: 'zonal_access',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Authorized', 
        dataIndex: 'authorized', 
        key: 'authorized',
        align: 'left' as const,
        render: (authorized: boolean, record: any) => (
          <Switch
            checked={authorized}
            onChange={(checked) => handleAuthorizationChange(record.id, checked)}
            style={{ backgroundColor: authorized ? '#52c41a' : '#ff4d4f' }}
          />
        )
      }
    ];

    return (
      <div style={{ marginTop: '24px' }}>
        <Title level={3} style={{ color: '#003f72', textAlign: 'left', fontWeight: 'bold' }}>Access Authorization</Title>
        <Table 
          dataSource={getAccessData()} 
          columns={columns} 
          pagination={false}
          style={{ marginTop: '16px' }}
        />
      </div>
    );
  };

  const renderContent = () => {
    // 始终显示基本信息
    const content = [
      <React.Fragment key="employee-info">
        {renderEmployeeInfo()}
      </React.Fragment>
    ];

    // 根据路由类型添加额外信息
    if (type === 'role') {
      content.push(
        <React.Fragment key="role-info">
          {renderRoleInfo()}
        </React.Fragment>
      );
    } else if (type === 'access') {
      content.push(
        <React.Fragment key="access-info">
          {renderAccessInfo()}
        </React.Fragment>
      );
    }

    return content;
  };

  return (
    <div style={{ padding: '24px' }}>
      {renderContent()}
    </div>
  );
};

// 修改导出语句
const EmployeeComponent = Employee;
export { EmployeeComponent as default }; 