CREATE TABLE IF NOT EXISTS training_certification (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  employee_id INT UNSIGNED NOT NULL,
  certification VARCHAR(100) NOT NULL,
  description VARCHAR(255) NOT NULL,
  training_description VARCHAR(255),
  status ENUM('current', 'expired') NOT NULL DEFAULT 'current',
  completion_time DATE,
  expiry_date DATE NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (employee_id) REFERENCES employee(id) ON DELETE CASCADE,
  INDEX idx_employee_id (employee_id),
  INDEX idx_status (status),
  INDEX idx_expiry_date (expiry_date)
); 