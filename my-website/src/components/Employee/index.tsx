import React, { useEffect, useState } from 'react';
import { Input, Row, Col, Typography, Space, message, Table, Switch, Select, Button, Modal, Form, DatePicker, Avatar, Upload, Tag, Tooltip } from 'antd';
import { SearchOutlined, PlusOutlined, UserOutlined, UploadOutlined, CheckCircleFilled, CloseCircleFilled, FireFilled, ThunderboltFilled, ExperimentFilled } from '@ant-design/icons';
import { employeeService, EmployeeWithDetails, EmployeeRole, TrainingCertification } from '../../services/employeeService';
import { useParams, useLocation } from 'react-router-dom';
import type { RcFile } from 'antd/es/upload/interface';
// 导入图片
import clothes1 from '../../assets/clothes1.jpg';
import clothes2 from '../../assets/clothes2.jpg';
import clothes3 from '../../assets/clothes3.jpg';

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
  const [customInputs, setCustomInputs] = useState({
    job_title: false,
    department: false,
    division: false,
    zone_access: false,
    reporting_officer: false,
    location: false
  });
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploadedFile, setUploadedFile] = useState<RcFile | null>(null);
  const [employees, setEmployees] = useState<EmployeeWithDetails[]>([]);

  // 预定义选项
  const workTitleOptions = ['CNC Operator', 'Millwright', 'Assembly Technician', 'Process Technician', 'Manager', 'Other'];
  const departmentOptions = ['Milling', 'Production', 'Software', 'Auto', 'Other'];
  const divisionOptions = ['A', 'B', 'Other'];
  const zoneAccessOptions = ['1', '2', 'Other'];
  const reportingOfficerOptions = ['Jessica', 'Dominik', 'Other'];
  const locationOptions = ['Helsinki', 'Stockholm', 'Other'];

  // 获取所有员工
  const fetchEmployees = async () => {
    try {
      const allEmployees = await employeeService.getAllEmployees();
      setEmployees(allEmployees);
    } catch (error) {
      console.error('Error fetching employees:', error);
      message.error('获取员工列表失败');
    }
  };

  const handleCustomOptionClick = (field: string) => {
    setCustomInputs(prev => ({
      ...prev,
      [field]: true
    }));
    form.setFieldsValue({
      [field]: ''
    });
  };

  useEffect(() => {
    // 添加事件监听
    const handleEmployeeSelected = (event: CustomEvent<EmployeeWithDetails>) => {
      console.log('Selected employee data:', event.detail);
      console.log('Profile path:', event.detail.profile);
      setSelectedEmployee(event.detail);
    };

    window.addEventListener('employeeSelected', handleEmployeeSelected as EventListener);
    
    // 初始化时获取员工列表，但不设置selectedEmployee
    fetchEmployees();

    return () => {
      window.removeEventListener('employeeSelected', handleEmployeeSelected as EventListener);
    };
  }, []);

  // 监听 selectedEmployee 变化
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
    setImageUrl(undefined);
    setUploadedFile(null);
    setCustomInputs({
      job_title: false,
      department: false,
      division: false,
      zone_access: false,
      reporting_officer: false,
      location: false
    });
    form.resetFields();
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // 处理图片上传
      let profilePath = '';
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
          const uploadResponse = await fetch('http://localhost:3001/api/upload', {
            method: 'POST',
            body: formData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload image');
          }
          
          const uploadResult = await uploadResponse.json();
          profilePath = uploadResult.path;
          console.log('Upload successful, profile path:', profilePath);
        } catch (error) {
          console.error('Error uploading image:', error);
          message.error('Failed to upload image');
          return;
        }
      }

      const formattedValues = {
        employeeData: {
          name: values.name,
          employee_id: values.employee_id,
          primary_phone: values.primary_phone,
          hire_date: values.hire_date.format('YYYY-MM-DD'),
          active_status: true,
          profile: profilePath
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

      console.log('Creating employee with data:', formattedValues);
      
      const newEmployeeId = await employeeService.createEmployee(formattedValues.employeeData, formattedValues.roleData);
      console.log('New employee created with ID:', newEmployeeId);
      
      message.success('Employee created successfully');
      handleModalCancel();
      
      // 重新获取员工列表
      try {
        const updatedEmployees = await employeeService.getAllEmployees();
        console.log('Updated employees list:', updatedEmployees);
        setEmployees(updatedEmployees);
        
        // 找到并选中新创建的员工
        const newEmployee = updatedEmployees.find(emp => Number(emp.id) === Number(newEmployeeId));
        console.log('Looking for employee with ID:', newEmployeeId, 'Type:', typeof newEmployeeId);
        console.log('Found employee:', newEmployee);
        
        if (newEmployee) {
          console.log('Setting selected employee:', newEmployee);
          setSelectedEmployee(newEmployee);
          
          // 触发选中事件
          const event = new CustomEvent('employeeSelected', { detail: newEmployee });
          window.dispatchEvent(event);

          // 强制更新选中的员工
          window.dispatchEvent(new CustomEvent('forceUpdateEmployee', { detail: newEmployee }));
        } else {
          console.error('Could not find newly created employee in updated list. ID:', newEmployeeId);
          // 如果没找到，尝试重新获取一次
          setTimeout(async () => {
            const retryEmployees = await employeeService.getAllEmployees();
            const retryEmployee = retryEmployees.find(emp => Number(emp.id) === Number(newEmployeeId));
            if (retryEmployee) {
              console.log('Found employee on retry:', retryEmployee);
              setSelectedEmployee(retryEmployee);
              window.dispatchEvent(new CustomEvent('employeeSelected', { detail: retryEmployee }));
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Error fetching updated employee list:', error);
        message.error('Failed to refresh employee list');
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Failed to create employee');
      }
      console.error('Error creating employee:', error);
    } finally {
      setLoading(false);
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

  // 处理头像上传
  const handleUpload = async (file: RcFile) => {
    try {
      // 验证文件类型
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }

      // 验证文件大小 (小于 2MB)
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }

      // 预览图片
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      // 保存文件对象以供后续提交
      setUploadedFile(file);
      return false; // 阻止自动上传
    } catch (error) {
      message.error('Preview failed');
      return false;
    }
  };

  const renderEmployeeInfo = () => (
    <>
      {/* Basic Information */}
      <Space direction="vertical" size={24} style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         
        </div>
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

    // 模拟产品数据
    const mockProducts = [
      {
        id: '1V5260',
        name: 'ANTTI OVERALL M BLACK/SGREY',
        image: clothes1,
        approved: true,
        features: {
          flameRetardant: true,
          antiStatic: true,
          chemicalResistant: true
        }
      },
      {
        id: '1L0746',
        name: 'CE WALT WINTER JACKET CL2 FLY',
        image: clothes2,
        approved: false,
        features: {
          flameRetardant: true,
          antiStatic: false,
          chemicalResistant: true
        }
      },
      {
        id: '1L1473',
        name: 'WARD WINTER HOOD CHARCOAL',
        image: clothes3,
        approved: true,
        features: {
          flameRetardant: false,
          antiStatic: true,
          chemicalResistant: true
        }
      }
    ];

    // 展开行的渲染函数
    const expandedRowRender = () => {
      const productColumns = [
        {
          title: 'Product',
          dataIndex: 'image',
          key: 'image',
          width: 120,
          render: (image: string) => (
            <img 
              src={image} 
              alt="Product" 
              style={{ 
                width: '100px', 
                height: '100px', 
                objectFit: 'cover',
                borderRadius: '4px'
              }} 
            />
          ),
        },
        {
          title: 'CNC Milling Machinery Approval',
          key: 'approval',
          width: 250,
          render: (_: any, record: any) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {record.approved ? (
                <>
                  <CheckCircleFilled style={{ color: '#52c41a', fontSize: '24px' }} />
                  <span style={{ color: '#52c41a', fontWeight: 'bold' }}>Approved</span>
                </>
              ) : (
                <>
                  <CloseCircleFilled style={{ color: '#ff4d4f', fontSize: '24px' }} />
                  <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>Not Approved</span>
                </>
              )}
            </div>
          ),
        },
        {
          title: 'Safety Features',
          key: 'features',
          render: (_: any, record: any) => (
            <Space size="middle">
              <Tooltip title="Flame Retardant">
                <Tag 
                  color={record.features.flameRetardant ? '#f50' : '#d9d9d9'} 
                  icon={<FireFilled />}
                  style={{ padding: '4px 8px', fontSize: '16px' }}
                >
                  FR
                </Tag>
              </Tooltip>
              <Tooltip title="Anti-Static">
                <Tag 
                  color={record.features.antiStatic ? '#2db7f5' : '#d9d9d9'} 
                  icon={<ThunderboltFilled />}
                  style={{ padding: '4px 8px', fontSize: '16px' }}
                >
                  AS
                </Tag>
              </Tooltip>
              <Tooltip title="Chemical Resistant">
                <Tag 
                  color={record.features.chemicalResistant ? '#87d068' : '#d9d9d9'} 
                  icon={<ExperimentFilled />}
                  style={{ padding: '4px 8px', fontSize: '16px' }}
                >
                  CR
                </Tag>
              </Tooltip>
            </Space>
          ),
        }
      ];

      return (
        <div style={{ padding: '0 20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <Text strong>Products in use</Text>
            <Text style={{ marginLeft: '10px', color: '#666' }}>3 Products</Text>
          </div>
          <Table
            columns={productColumns}
            dataSource={mockProducts}
            pagination={false}
            size="small"
          />
        </div>
      );
    };

    return (
      <div style={{ marginTop: '24px' }}>
        <Title level={3} style={{ color: '#003f72', textAlign: 'left', fontWeight: 'bold' }}>Access Authorization</Title>
        <Table 
          dataSource={getAccessData()} 
          columns={columns} 
          pagination={false}
          style={{ marginTop: '16px' }}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
          }}
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

  // 示例任务数据
  const exampleTasks = [
    { id: 1, name: 'Assembly', description: 'Assembling machines', status: 'Pending', due_date: '2025-06-30' },
    { id: 2, name: 'Safety training', description: 'Complete the annual safety training', status: 'Completed', due_date: '2024-05-15' },
    { id: 3, name: 'Garment cutting', description: 'Garment cutting', status: 'Pending', due_date: '2025-07-10' }
  ];

  const renderTasksInfo = () => {
    const columns = [
      { title: 'Task Name', dataIndex: 'name', key: 'name' },
      { title: 'Description', dataIndex: 'description', key: 'description' },
      { title: 'Status', dataIndex: 'status', key: 'status',
        render: (status: string) => {
          let color = '#faad14';
          if (status === 'Completed') color = '#52c41a';
          if (status === 'Pending') color = '#faad14';
          if (status === 'No tasks') color = '#bfbfbf';
          return <span style={{ color, fontWeight: 600 }}>{status}</span>;
        }
      },
      { title: 'Due Date', dataIndex: 'due_date', key: 'due_date' }
    ];
    return (
      <div style={{ marginTop: '24px' }}>
        <Title level={3} style={{ color: '#003f72', textAlign: 'left', fontWeight: 'bold' }}>Tasks</Title>
        <Table
          dataSource={exampleTasks.length ? exampleTasks : [{ id: 0, name: '-', description: '-', status: 'No tasks', due_date: '-' }]}
          columns={columns}
          pagination={false}
          rowKey="id"
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
    } else if (type === 'training') {
      content.push(
        <React.Fragment key="training-info">
          {renderTrainingInfo()}
        </React.Fragment>
      );
    } else if (type === 'tasks') {
      content.push(
        <React.Fragment key="tasks-info">
          {renderTasksInfo()}
        </React.Fragment>
      );
    }

    return content;
  };

  // 在 useEffect 区域添加事件监听
  useEffect(() => {
    const openModal = () => setIsModalVisible(true);
    window.addEventListener('openNewEmployeeModal', openModal);
    return () => window.removeEventListener('openNewEmployeeModal', openModal);
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden' }}>
            {selectedEmployee?.profile ? (
              <img
                src={`http://localhost:3001${selectedEmployee.profile}`}
                alt={selectedEmployee.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center top'
                }}
                onError={(e) => {
                  console.log('Failed to load avatar for employee:', selectedEmployee);
                  e.currentTarget.src = ''; // 清除错误的图片
                  e.currentTarget.style.display = 'none'; // 隐藏错误的图片
                }}
              />
            ) : (
              <Avatar size={64} icon={<UserOutlined />} />
            )}
          </div>
        </div>
        {renderContent()}
      </div>
      
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
            <Col span={24}>
              <Form.Item
                name="profile"
                label="Profile Picture"
               
              >
                <Upload
                  name="profile"
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={handleUpload}
                  maxCount={1}
                >
                  {imageUrl ? (
                    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                      <img
                        src={imageUrl}
                        alt="avatar"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center top'
                        }}
                      />
                    </div>
                  ) : (
                    <div>
                      <PlusOutlined />
                      <div style={{ marginTop: 8 }}>Upload</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please input name' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="employee_id"
                label="Employee ID"
                rules={[{ required: true, message: 'Please input employee ID' }]}
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
                rules={[{ required: true, message: 'Please select hire date' }]}
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
                rules={[{ required: true, message: 'Please select or input work title' }]}
              >
                {customInputs.job_title ? (
                  <Input />
                ) : (
                  <Select
                    onChange={(value) => {
                      if (value === 'Other') {
                        handleCustomOptionClick('job_title');
                      }
                    }}
                  >
                    {workTitleOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select or input department' }]}
              >
                {customInputs.department ? (
                  <Input />
                ) : (
                  <Select
                    onChange={(value) => {
                      if (value === 'Other') {
                        handleCustomOptionClick('department');
                      }
                    }}
                  >
                    {departmentOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="division"
                label="Division"
                rules={[{ required: true, message: 'Please select or input division' }]}
              >
                {customInputs.division ? (
                  <Input />
                ) : (
                  <Select
                    onChange={(value) => {
                      if (value === 'Other') {
                        handleCustomOptionClick('division');
                      }
                    }}
                  >
                    {divisionOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="Location"
                rules={[{ required: true, message: 'Please select or input location' }]}
              >
                {customInputs.location ? (
                  <Input />
                ) : (
                  <Select
                    onChange={(value) => {
                      if (value === 'Other') {
                        handleCustomOptionClick('location');
                      }
                    }}
                  >
                    {locationOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="zone_access"
                label="Zone Access"
                rules={[{ required: true, message: 'Please select or input zone access' }]}
              >
                {customInputs.zone_access ? (
                  <Input />
                ) : (
                  <Select
                    onChange={(value) => {
                      if (value === 'Other') {
                        handleCustomOptionClick('zone_access');
                      }
                    }}
                  >
                    {zoneAccessOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reporting_officer"
                label="Reporting Officer"
                rules={[{ required: true, message: 'Please select or input reporting officer' }]}
              >
                {customInputs.reporting_officer ? (
                  <Input />
                ) : (
                  <Select
                    onChange={(value) => {
                      if (value === 'Other') {
                        handleCustomOptionClick('reporting_officer');
                      }
                    }}
                  >
                    {reportingOfficerOptions.map(option => (
                      <Option key={option} value={option}>{option}</Option>
                    ))}
                  </Select>
                )}
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