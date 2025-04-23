import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Typography, Space, message, Table, Switch, Select, Button, Modal, Form, DatePicker } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { employeeService, EmployeeWithDetails, EmployeeRole, TrainingCertification } from '../../services/employeeService';
import { useParams, useLocation } from 'react-router-dom';

const { Text, Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<any>(null);
  const [form] = Form.useForm();
  const [trainingData, setTrainingData] = useState<TrainingCertification[]>([]);
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

  useEffect(() => {
    if (selectedEmployee && type === 'training') {
      fetchTrainingData();
    }
  }, [selectedEmployee, type]);

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

  const handleNewEmployee = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        employeeData: {
          name: values.name,
          employee_id: values.employee_id,
          primary_phone: values.primary_phone,
          hire_date: values.hire_date.format('YYYY-MM-DD'),
          active_status: 1
        },
        roleData: {
          job_title: values.job_title,
          department: values.department,
          division: values.division,
          location: values.location,
          zone_access: values.zone_access,
          reporting_officer: values.reporting_officer,
          authorized: true
        }
      };
      
      await employeeService.createEmployee(formattedValues.employeeData, formattedValues.roleData);
      message.success('新员工创建成功');
      setIsModalVisible(false);
      form.resetFields();
      
      // 刷新员工列表
      const updatedEmployees = await employeeService.getAllEmployees();
      setSelectedEmployee(updatedEmployees[0]); // 选择新创建的员工
    } catch (error) {
      message.error('创建失败，请检查表单');
      console.error('创建员工时出错:', error);
    }
  };

  const fetchTrainingData = async () => {
    try {
      if (selectedEmployee) {
        setLoading(true);
        const data = await employeeService.getEmployeeTraining(selectedEmployee.id);
        
        // 在前端也进行状态检查（用于显示）
        const processedData = data.map(cert => ({
          ...cert,
          status: new Date(cert.expiry_date) < new Date() ? 'expired' as const : 'current' as const
        }));
        
        setTrainingData(processedData);
      }
    } catch (error) {
      console.error('获取培训认证数据失败:', error);
      message.error('获取培训认证数据失败');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).split('/').reverse().join('-');
  };

  const getStatusColor = (status: string, expiryDate: string) => {
    const isExpired = new Date(expiryDate) < new Date();
    return isExpired ? '#ff4d4f' : '#52c41a';
  };

  const handleDescriptionClick = (record: any) => {
    setSelectedCertification(record);
    setIsDetailModalVisible(true);
  };

  const renderEmployeeInfo = () => (
    <>
      {/* Basic Information */}
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        {/* First Row - Labels */}
        <Row gutter={[16, 0]}>
        <Col span={8}>
            <Text strong style={{ color: '#000', fontSize: '14px' }}>Employee ID</Text>
          </Col>
          <Col span={8}>
            <Text strong style={{ color: '#000', fontSize: '14px' }}>Name</Text>
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
            <Text strong style={{ color: '#000', fontSize: '14px' }}>Work Title</Text>
          </Col>
          <Col span={8}>
            <Text strong style={{ color: '#000', fontSize: '14px' }}>Primary Phone</Text>
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
              <Text>{selectedEmployee?.primary_phone || '-'}</Text>
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
        title: 'Zonal Access', 
        dataIndex: 'zonal_access', 
        key: 'zonal_access',
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
        title: 'Job Title', 
        dataIndex: 'job_title', 
        key: 'job_title',
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

  const renderTrainingInfo = () => {
    const columns = [
      { 
        title: 'Certification',
        dataIndex: 'certification',
        key: 'certification',
        align: 'left' as const,
        render: (text: string) => <span style={{ color: '#333' }}>{text}</span>
      },
      { 
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        align: 'left' as const,
        render: (text: string, record: any) => (
          <span 
            style={{ 
              color: '#333',
              cursor: 'pointer'
            }}
            onClick={() => handleDescriptionClick(record)}
          >
            {text}
          </span>
        )
      },
      { 
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        align: 'left' as const,
        render: (status: string, record: any) => (
          <span style={{ 
            color: getStatusColor(status, record.expiry_date),
            fontWeight: 'bold'
          }}>
            {status.toUpperCase()}
          </span>
        )
      },
      { 
        title: 'Completion Time',
        dataIndex: 'completion_time',
        key: 'completion_time',
        align: 'left' as const,
        render: (date: string) => {
          const formattedDate = date ? formatDate(date) : '-';
          return <span style={{ color: '#333' }}>{formattedDate}</span>;
        }
      }
    ];

    // 确保每个数据项都有唯一的key
    const dataWithKeys = trainingData.map((item, index) => ({
      ...item,
      key: `training-${item.id || index}`
    }));

    return (
      <div style={{ marginTop: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Title level={3} style={{ color: '#003f72', margin: 0, fontWeight: 'bold' }}>Training and Certification</Title>
        </div>
        <Table 
          dataSource={dataWithKeys} 
          columns={columns} 
          pagination={false}
          style={{ marginTop: '16px' }}
          loading={loading}
        />

        <Modal
          title={selectedCertification?.certification}
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
              Close
            </Button>
          ]}
          width={600}
        >
          {selectedCertification && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <Text strong>Status:</Text>
                <div style={{ 
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px'
                }}>
                  <div style={{ 
                    width: `${selectedCertification.status === 'current' ? 100 : 50}%`,
                    height: '24px',
                    backgroundColor: getStatusColor(selectedCertification.status, selectedCertification.expiry_date),
                    borderRadius: '4px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>Description:</Text>
                <div style={{ 
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px'
                }}>
                  {selectedCertification.description}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>Task Status:</Text>
                <div style={{ 
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px'
                }}>
                  {selectedCertification.training_description || 'No training description available'}
                </div>
              </div>

              <div>
                <Text strong>Completion Time:</Text>
                <div style={{ 
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '6px'
                }}>
                  {selectedCertification.completion_time ? formatDate(selectedCertification.completion_time) : 'Not completed'}
                </div>
              </div>
            </div>
          )}
        </Modal>
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
    } else if (type === 'training') {
      content.push(
        <React.Fragment key="training-info">
          {renderTrainingInfo()}
        </React.Fragment>
      );
    }

    return content;
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={handleNewEmployee}
          style={{ backgroundColor: '#003f72' }}
        >
          New employee
        </Button>
      </div>
      {renderContent()}

      <Modal
        title="New Employee"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employee_id"
                label="Employee ID"
                rules={[{ required: true, message: '请输入员工ID' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="primary_phone"
                label="Primary Phone"
                rules={[{ required: false }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="hire_date"
                label="Hire Date"
                rules={[{ required: true, message: '请选择入职日期' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="job_title"
                label="Work Title"
                rules={[{ required: true, message: '请输入职位' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: '请输入部门' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="division"
                label="Division"
                rules={[{ required: true, message: '请输入分部' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: '请输入位置' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="zone_access"
                label="Zone Access"
                rules={[{ required: true, message: '请输入区域访问权限' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reporting_officer"
                label="Reporting Officer"
                rules={[{ required: true, message: '请输入汇报主管' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

// 修改导出语句
const EmployeeComponent = Employee;
export { EmployeeComponent as default }; 