CREATE DATABASE IF NOT EXISTS your_database_name;

USE your_database_name;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  hire_date DATE,
  employee_id VARCHAR(50) UNIQUE,
  work_title VARCHAR(255),
  active_status BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 添加示例数据
INSERT INTO employees (name, title, hire_date, employee_id, work_title, active_status)
VALUES 
  ('John Doe', 'Senior Developer', '2023-01-01', 'EMP001', 'Software Engineer', true),
  ('Jane Smith', 'Project Manager', '2023-02-01', 'EMP002', 'Manager', true); 