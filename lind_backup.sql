-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: Lind
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Milling','Milling department','2025-03-27 13:17:14','2025-03-27 13:17:14'),(2,'Production','Production department','2025-03-27 13:17:14','2025-03-27 13:17:14');
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `division`
--

DROP TABLE IF EXISTS `division`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `division` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `division_name` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `division`
--

LOCK TABLES `division` WRITE;
/*!40000 ALTER TABLE `division` DISABLE KEYS */;
INSERT INTO `division` VALUES (1,'A','Division A','2025-03-27 13:17:24','2025-03-27 13:17:24');
/*!40000 ALTER TABLE `division` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `hire_date` date DEFAULT NULL,
  `active_status` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `primary_phone` varchar(20) DEFAULT NULL,
  `profile` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1,'EMP001','Yan Zheng','Mr.','2025-06-15',1,'2025-03-27 13:20:38','2025-05-02 23:17:52',NULL,NULL),(2,'EMP002','David AAA','Mr.','2023-07-10',1,'2025-03-27 14:39:13','2025-05-02 23:17:52',NULL,NULL),(3,'4018322','Stark, Tony','CNC Operator','2020-01-14',1,'2025-04-22 12:31:32','2025-05-02 23:17:52','813-991-3167',NULL),(4,'5007068','Odinson, Loki','Millwright','2019-06-07',0,'2025-04-22 12:31:32','2025-05-02 23:17:52','534-399-6111',NULL),(5,'3247576','Targaryen, Danaerys \"Dede\"','Assembly Technician','2016-10-11',0,'2025-04-22 12:31:32','2025-05-02 23:17:52','787-568-3409',NULL),(6,'4357289','Woman, Wonder','Assembly Technician','2001-09-02',1,'2025-04-22 12:31:32','2025-05-02 23:17:52','923-311-3208',NULL),(7,'2489344','White, Walter','Process Technician','2023-05-15',1,'2025-04-22 12:31:32','2025-05-02 23:17:52','641-313-2121',NULL),(8,'2909885','Killmonger, Erik','CNC Operator','2021-11-19',1,'2025-04-22 12:31:32','2025-05-02 23:17:52','468-682-5281',NULL),(9,'4018321','Tester',NULL,'2020-02-14',1,'2025-04-22 13:06:46','2025-05-02 23:17:52','35864111',NULL),(10,'4018321','Tester',NULL,'2020-02-21',1,'2025-04-22 13:07:54','2025-05-02 23:17:52','35864111',NULL),(11,'202524','jes',NULL,'2025-04-23',1,'2025-04-23 18:33:05','2025-05-02 23:17:52',NULL,NULL),(12,'EMP99','SOFT TESTER',NULL,'2025-05-08',1,'2025-05-02 22:36:10','2025-05-02 22:36:10',NULL,NULL),(13,'333','Design Factory',NULL,'2025-05-06',1,'2025-05-02 22:55:36','2025-05-02 23:24:43','1121e3123','/uploads/1746215736546-621168644.jpg'),(14,'666','Jane',NULL,'2025-05-01',1,'2025-05-02 23:23:26','2025-05-02 23:23:26',NULL,'/uploads/1746217406323-429656455.png'),(15,'111','Sara',NULL,'2025-05-05',1,'2025-05-02 23:29:13','2025-05-02 23:29:13',NULL,'/uploads/1746217753732-675839401.png'),(16,'23','Kane',NULL,'2025-05-01',1,'2025-05-02 23:32:50','2025-05-02 23:32:50','0416666666','/uploads/1746217970438-755728842.png'),(17,'234','Aana',NULL,'2025-05-01',1,'2025-05-02 23:34:16','2025-05-02 23:34:16','0416666666','/uploads/1746218056450-180409439.png'),(18,'255','Anssi',NULL,'2025-05-06',1,'2025-05-02 23:36:08','2025-05-02 23:36:08','0416666666','/uploads/1746218168102-147072350.png'),(19,'78','Elina',NULL,'2025-05-13',1,'2025-05-02 23:38:36','2025-05-02 23:38:36',NULL,'/uploads/1746218316234-89790587.png'),(20,'98','Liisa',NULL,'2025-05-01',1,'2025-05-02 23:40:15','2025-05-02 23:40:15',NULL,'/uploads/1746218415215-146028221.png'),(21,'80','Niko',NULL,'2025-05-01',1,'2025-05-02 23:46:20','2025-05-02 23:46:20',NULL,'/uploads/1746218780728-26426208.png'),(22,'801','Nikolai',NULL,'2025-05-01',1,'2025-05-13 23:09:20','2025-05-13 23:09:20',NULL,'/uploads/1747166960170-512126897.jpg');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_role`
--

DROP TABLE IF EXISTS `employee_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_role` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` int unsigned NOT NULL,
  `job_title` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `division` varchar(100) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `zone_access` varchar(100) DEFAULT NULL,
  `reporting_officer` varchar(100) DEFAULT NULL,
  `authorized` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `rfid` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_employee_role_employee` (`employee_id`),
  CONSTRAINT `fk_employee_role_employee` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_role`
--

LOCK TABLES `employee_role` WRITE;
/*!40000 ALTER TABLE `employee_role` DISABLE KEYS */;
INSERT INTO `employee_role` VALUES (1,1,'Machine Operator','Milling','A','Helsinki','Zone 2','Dominik',0,'2025-03-27 13:25:00','2025-04-09 16:20:09','301588F84000008001FA6E46'),(2,1,'Maintenance','Production','A','Helsinki','Zone 1','Jessica',1,'2025-03-27 13:25:00','2025-05-02 19:47:32','301588F84000008001EB51CC'),(3,2,'Leader','Milling','A','Helsinki','Zone 1','Manager A',0,'2025-03-27 14:39:13','2025-03-30 17:17:30',NULL),(4,2,'Manager','Production','A','Helsinki','Zone 2','Manager B',1,'2025-03-27 14:39:13','2025-03-30 17:17:32',NULL),(5,3,'CNC Operator','Production','A','Helsinki','Zone 1','Auto Manager',1,'2025-04-22 12:31:40','2025-05-14 13:43:33',NULL),(6,4,'Millwright','Production','A','Helsinki','Zone 1','Auto Manager',1,'2025-04-22 12:31:40','2025-04-22 12:31:40',NULL),(7,5,'Assembly Technician','Production','A','Helsinki','Zone 1','Auto Manager',1,'2025-04-22 12:31:40','2025-04-22 12:31:40',NULL),(8,6,'Assembly Technician','Production','A','Helsinki','Zone 1','Auto Manager',1,'2025-04-22 12:31:40','2025-04-22 12:31:40',NULL),(9,7,'Process Technician','Production','A','Helsinki','Zone 1','Auto Manager',1,'2025-04-22 12:31:40','2025-04-22 12:31:40',NULL),(10,8,'CNC Operator','Production','A','Helsinki','Zone 1','Auto Manager',1,'2025-04-22 12:31:40','2025-04-22 12:31:40',NULL),(12,9,'tester','Software','B','Helsinki','2','Jessica',1,'2025-04-22 13:06:46','2025-04-22 13:06:46',NULL),(13,10,'tester','Software','B','Helsinki','2','Jessica',1,'2025-04-22 13:07:54','2025-04-22 13:07:54',NULL),(14,11,'123','auto','assembly','hel','zone1','yan',1,'2025-04-23 18:33:05','2025-04-23 18:33:05',NULL),(15,12,'TESTER','Software','A','HELSINKI','2','Dominik',1,'2025-05-02 22:36:10','2025-05-02 22:36:10',NULL),(16,13,'Assembly Technician','Production','B','Stockholm','1','Jessica',1,'2025-05-02 22:55:36','2025-05-02 22:55:36',NULL),(17,14,'Millwright','Milling','A','Stockholm','2','Dominik',1,'2025-05-02 23:23:26','2025-05-02 23:23:26',NULL),(18,15,'Millwright','Production','B','Stockholm','3','Nana',1,'2025-05-02 23:29:13','2025-05-02 23:29:13',NULL),(19,16,'Manager','Production','B','Stockholm','1','Dominik',1,'2025-05-02 23:32:50','2025-05-02 23:32:50',NULL),(20,17,'CNC Operator','Production','A','Stockholm','1','Dominik',1,'2025-05-02 23:34:16','2025-05-02 23:34:16',NULL),(21,18,'CNC Operator','Milling','B','Stockholm','1','Dominik',1,'2025-05-02 23:36:08','2025-05-02 23:36:08',NULL),(22,19,'Process Technician','Production','B','Stockholm','1','Jessica',1,'2025-05-02 23:38:36','2025-05-02 23:38:36',NULL),(23,20,'Process Technician','Software','B','Stockholm','2','Dominik',1,'2025-05-02 23:40:15','2025-05-02 23:40:15',NULL),(24,21,'Software QA','Software','C','London','2','Dominik',1,'2025-05-02 23:46:20','2025-05-02 23:46:20',NULL),(25,22,'Manager','Production','B','Stockholm','1','Jessica',1,'2025-05-13 23:09:20','2025-05-13 23:09:20',NULL);
/*!40000 ALTER TABLE `employee_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `location`
--

DROP TABLE IF EXISTS `location`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `location` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `location_name` varchar(100) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `location`
--

LOCK TABLES `location` WRITE;
/*!40000 ALTER TABLE `location` DISABLE KEYS */;
INSERT INTO `location` VALUES (1,'Helsinki','123 Nordic Road','Helsinki','Finland','Main factory','2025-03-27 13:17:28','2025-03-27 13:17:28');
/*!40000 ALTER TABLE `location` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `training_certification`
--

DROP TABLE IF EXISTS `training_certification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `training_certification` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `employee_id` int unsigned NOT NULL,
  `certification` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `status` enum('current','expired') NOT NULL DEFAULT 'current',
  `expiry_date` date NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `training_description` varchar(255) DEFAULT NULL,
  `completion_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_employee_id` (`employee_id`),
  KEY `idx_status` (`status`),
  KEY `idx_expiry_date` (`expiry_date`),
  CONSTRAINT `training_certification_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `training_certification`
--

LOCK TABLES `training_certification` WRITE;
/*!40000 ALTER TABLE `training_certification` DISABLE KEYS */;
INSERT INTO `training_certification` VALUES (1,1,'ISO-909','Environmental Management','current','2028-05-12','2025-04-22 13:18:52','2025-04-22 13:53:13','Task completed on hollow mat.','2025-04-22 13:18:52'),(2,1,'ISO-100','Energy Management','current','2026-11-06','2025-04-22 13:18:52','2025-04-22 13:53:13','Task completed on hollow mat.','2025-04-22 13:18:52'),(3,1,'ISO-981','ATEX','expired','2025-01-03','2025-04-22 13:18:52','2025-04-22 13:53:13','Task completed on hollow mat.','2025-04-22 13:18:52'),(4,1,'ISO-133','Lockout/Tagout','current','2026-05-14','2025-04-22 13:18:52','2025-04-22 13:53:13','Task completed on hollow mat.','2025-04-22 13:18:52'),(5,1,'ISO-988','Confined entry space','current','2025-07-07','2025-04-22 13:18:52','2025-04-22 13:53:13','Task completed on hollow mat.','2025-04-22 13:18:52'),(6,3,'ISO-909','Environmental Management','expired','2021-05-12','2025-04-22 13:42:45','2025-04-22 13:53:13','Task completed on hollow mat.','2025-04-22 13:18:52'),(7,3,'ISO-100','Energy Management','expired','2024-11-06','2025-04-22 13:42:45','2025-04-22 13:53:13','Task completed on hollow mat.','2025-04-22 13:18:52'),(8,3,'ISO-981','ATEX','expired','2025-05-03','2025-04-22 13:42:45','2025-05-07 15:52:11','Task completed on hollow mat.','2025-04-22 13:18:52'),(9,3,'ISO-133','Lockout/Tagout','current','2026-05-14','2025-04-22 13:42:45','2025-04-22 13:53:13','Task completed on hollow mat.','2025-04-22 13:18:52'),(10,3,'ISO-988','Confined entry space','current','2025-07-07','2025-04-22 13:42:45','2025-04-22 13:53:13','Task completed on hollow mat.','2025-04-22 13:18:52');
/*!40000 ALTER TABLE `training_certification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-14 14:36:38
