CREATE DATABASE  IF NOT EXISTS `lendellp_lomis` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;
USE `lendellp_lomis`;
-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: lendellp_lomis
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tbl_active_clients`
--

DROP TABLE IF EXISTS `tbl_active_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_active_clients` (
  `client_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `contact_person` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contract_type` varchar(255) NOT NULL,
  `start_contract` date NOT NULL,
  `end_contract` date NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_active_clients`
--

LOCK TABLES `tbl_active_clients` WRITE;
/*!40000 ALTER TABLE `tbl_active_clients` DISABLE KEYS */;
INSERT INTO `tbl_active_clients` VALUES (1,'Tech Solutions Inc.','John Smith','Project Manager','john.smith@techsolutions.com','Web Development','2025-01-01','2025-12-31','2025-01-23 08:36:12'),(2,'Bright Future Corp.','Sarah Davis','Marketing Head','sarah.davis@brightfuture.com','Digital Marketing','2025-02-15','2025-08-15','2025-01-23 08:36:12'),(3,'EcoGrowth Partners','Daniel Martinez','Sustainability Consultant','daniel.martinez@ecogrowth.com','Sustainability Consulting','2025-03-01','2025-09-01','2025-01-23 08:36:12'),(4,'Visionary Designs','Sophia Anderson','Creative Director','sophia.anderson@visionarydesigns.com','Graphic Design','2025-01-20','2025-07-20','2025-01-23 08:36:12'),(5,'MarketPulse Analytics','James Thomas','Data Analyst','james.thomas@marketpulse.com','Data Analysis','2025-04-01','2025-10-01','2025-01-23 08:36:12'),(6,'Startup Syndicate','Olivia Hernandez','Business Strategist','olivia.hernandez@startupsyn.com','Business Strategy','2025-05-01','2025-11-01','2025-01-23 08:36:12'),(7,'Innovatech Co.','Michael Brown','CTO','michael.brown@innovatech.com','Cloud Solutions','2025-06-01','2025-12-01','2025-01-23 08:36:12'),(8,'HumanWorks LLC','Emma Taylor','HR Specialist','emma.taylor@humanworks.com','HR Consulting','2025-03-15','2025-09-15','2025-01-23 08:36:12'),(9,'Creative Minds Ltd.','Emily Johnson','CEO','emily.johnson@creativeminds.com','Brand Strategy','2025-07-01','2025-12-31','2025-01-23 08:36:12'),(10,'BuildPro Enterprises','David Wilson','Construction Manager','david.wilson@buildpro.com','Construction Services','2025-01-10','2025-06-10','2025-01-23 08:36:12');
/*!40000 ALTER TABLE `tbl_active_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_inquiries`
--

DROP TABLE IF EXISTS `tbl_inquiries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_inquiries` (
  `id` int(11) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `service` varchar(100) DEFAULT NULL,
  `message` varchar(500) DEFAULT NULL,
  `type` int(11) DEFAULT 1 COMMENT '1 - Online, 2 - Calls',
  `status` tinyint(5) DEFAULT NULL COMMENT '0 - Sent\r\n1 - No',
  `active` tinyint(1) DEFAULT 1,
  `updated_by` varchar(50) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `date_updated` timestamp NULL DEFAULT current_timestamp(),
  `remarks` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_inquiries`
--

LOCK TABLES `tbl_inquiries` WRITE;
/*!40000 ALTER TABLE `tbl_inquiries` DISABLE KEYS */;
INSERT INTO `tbl_inquiries` VALUES (1,'Alice Carter','IT Manager','Tech Visionaries','123-456-7890','alice.carter@techvision.com','Database Check','',1,0,1,NULL,'2025-01-24 08:56:27','2025-05-12 03:38:05',NULL),(2,'Kaye Ganda','CEO','Future Innovations','987-654-3210','mark.wilson@futureinnovations.com','Background Investigation','',1,1,1,NULL,'2025-01-24 14:00:57','2025-05-12 03:38:05',NULL),(3,'Emily Green','Sustainability Officer','GreenEarth Solutions','456-789-1234','emily.green@greenearth.com','Property Verification','',1,0,1,NULL,'2025-01-24 06:56:27','2025-05-12 03:38:05',NULL),(4,'Robert Hill','Operations Manager','NextGen Industries','321-654-9870','robert.hill@nextgen.com','Property Appraisal','',1,0,1,NULL,'2025-01-25 14:01:01','2025-05-12 03:38:05',NULL),(5,'Jessica Lane','Creative Director','Smart Designs Ltd.','654-321-9876','jessica.lane@smartdesigns.com','Collection Management','',1,1,1,NULL,'2025-01-25 14:01:05','2025-05-12 03:38:05',NULL),(6,'Daniel Wright','HR Head','BrightPath Co.','789-123-4560','daniel.wright@brightpath.com','Skip Tracing','',1,0,1,NULL,'2025-01-22 14:01:08','2025-05-12 03:38:05',NULL),(7,'Sophia Moore','Marketing Director','Elite Ventures','111-222-3333','sophia.moore@eliteventures.com','Database Check','',1,0,1,NULL,'2025-01-22 14:01:15','2025-05-12 03:38:05',NULL),(8,'Chris Adams','CTO','InnoTech Labs','444-555-6666','chris.adams@innotech.com','Background Investigation','',1,1,1,NULL,'2025-01-15 14:01:24','2025-05-12 03:38:05',NULL),(9,'Laura Baker','Project Manager','Pioneer Systems','777-888-9999','laura.baker@pioneersystems.com','Property Verification','',1,0,1,NULL,'2025-01-14 14:01:34','2025-05-12 03:38:05',NULL),(10,'Michael Scott','Business Analyst','Dynamic Corp.','000-111-2222','michael.scott@dynamiccorp.com','Property Appraisal','',1,0,1,NULL,'2025-01-13 04:56:27','2025-05-12 03:38:05',NULL),(14,'Jesper R. Samson','Web Dev','KORAK','0000000','samson.j.bsinfotech@gmail.com','Background Investigation','fasfasf',1,0,1,NULL,'2025-03-11 03:30:21','2025-05-12 03:38:05',NULL),(15,'Jesper R. Samson','Web Dev','KORAK','0000000','samson.j.bsinfotech@gmail.com','Background Investigation','fasfasf',1,0,1,NULL,'2025-03-11 03:30:21','2025-05-12 03:38:05',NULL),(16,'Jesper R. Samson','Web Dev','KORAK','0000000','samson.j.bsinfotech@gmail.com','Skip Tracing','fsaasfasfsaf',1,0,1,NULL,'2025-03-11 03:32:02','2025-05-12 03:38:05',NULL),(17,'Jesper R. Samson','Web Dev','KORAK','0000000','samson.j.bsinfotech@gmail.com','Skip Tracing','fsaasfasfsaf',1,0,1,NULL,'2025-03-11 03:32:02','2025-05-12 03:38:05',NULL),(18,'Jesper R. Samson','Web Dev','KORAK','0000000','samson.j.bsinfotech@gmail.com','Property Appraisal','fasfsa',1,0,1,NULL,'2025-03-11 05:45:28','2025-05-12 03:38:05',NULL),(19,'Jesper R. Samson','Web Dev','KORAK','0000000','samson.j.bsinfotech@gmail.com','Property Appraisal','fasfsa',1,0,1,NULL,'2025-03-11 05:45:28','2025-05-12 03:38:05',NULL),(20,'JM Scott','Web Dev','KORAK','0000000','test@email.com','Property Verification','safadg',1,0,1,NULL,'2025-03-11 05:47:36','2025-05-12 03:38:05',NULL),(21,'JM Scott','Web Dev','KORAK','0000000','test@email.com','Property Verification','safadg',1,0,1,NULL,'2025-03-11 05:47:36','2025-05-12 03:38:05',NULL),(22,'JM Scott','Web Dev','KORAK','0000000','test@email.com','Background Investigation','fsa',1,0,1,NULL,'2025-03-11 05:49:46','2025-05-12 03:38:05',NULL),(23,'JM Scott','Web Dev','KORAK','0000000','test@email.com','Background Investigation','fsa',1,0,1,NULL,'2025-03-11 05:49:46','2025-05-12 03:38:05',NULL),(24,'Jespermnbmn','Web Dev','Prople','0000000','admin@dev.ph','Credit Investigation','bnnb',1,0,1,NULL,'2025-03-11 05:58:04','2025-05-12 03:38:05',NULL),(25,'Jespermnbmn','Web Dev','Prople','0000000','admin@dev.ph','Credit Investigation','bnnb',1,0,1,NULL,'2025-03-11 05:58:04','2025-05-12 03:38:05',NULL),(26,'Jespermnbmn','Web Dev','Prople','0000000','admin@dev.ph','Property Verification','sdfghj',1,0,1,NULL,'2025-03-11 06:19:52','2025-05-12 03:38:05',NULL),(27,'Jespermnbmn','Web Dev','Prople','0000000','admin@dev.ph','Property Verification','sdfghj',1,0,1,NULL,'2025-03-11 06:19:52','2025-05-12 03:38:05',NULL),(28,'JAY MARVIN PERALTA','awd','COP IT Solutions and Services','123','admin@dev.ph','Background Investigation','ada',1,0,1,NULL,'2025-03-18 12:45:21','2025-05-12 03:38:05',NULL),(29,'JAY MARVIN PERALTA','awd','COP IT Solutions and Services','123','admin@dev.ph','Background Investigation','ada',1,0,1,NULL,'2025-03-18 12:45:21','2025-05-12 03:38:05',NULL),(30,'JAY MARVIN PERALTA','d','COP IT Solutions and Services','123','admin@dev.ph','Background Investigation','fdgdfgfd',1,0,1,NULL,'2025-03-18 12:58:33','2025-05-12 03:38:05',NULL),(31,'JAY MARVIN PERALTA','d','COP IT Solutions and Services','123','admin@dev.ph','Background Investigation','fdgdfgfd',1,0,1,NULL,'2025-03-18 12:58:33','2025-05-12 03:38:05',NULL),(32,'Sharron','Scpiupd ajt','Sharron Barreras','745596483','sharron.barreras@outlook.com','Collection Management','Looking for real results? We send your ad text to website contact forms, ensuring potential customers see your message. No per-click feesâ€”just a flat rate.  \r\n\r\nReach out today and letâ€™s talk about how this can benefit you.  \r\n\r\nRegards,  \r\nSharron Barreras  \r\nEmail: Sharron.Barreras@freshnewleads.my  \r\nWebsite: https://adstocontactforms.top',1,0,1,NULL,'2025-04-07 11:42:02','2025-05-12 03:38:05',NULL),(33,'Joanna','No Etceydgr','Joanna Riggs','5657406026','joannariggs278@gmail.com','Skip Tracing','Hi,\r\n\r\nI just visited lendell.ph and wondered if you\'d ever thought about having an engaging video to explain what you do?\r\n\r\nOur videos cost just $195 for a 30 second video ($239 for 60 seconds) and include a full script, voice-over and video.\r\n\r\nI can show you some previous videos we\'ve done if you want me to send some over. Let me know if you\'re interested in seeing samples of our previous work.\r\n\r\nRegards,\r\nJoanna',1,0,1,NULL,'2025-04-08 08:59:14','2025-05-12 03:38:05',NULL),(34,'Felicity','G Pon h my u','Felicity Sauncho','2292460166','felicitysauncho02@gmail.com','Collection Management','Hi there,\r\n\r\nWe run a Youtube growth service, where we can increase your subscriber count safely and practically. \r\n\r\n- Guaranteed: We guarantee to gain you 700-1500 new subscribers each month.\r\n- Real, human subscribers who subscribe because they are interested in your channel/videos.\r\n- Safe: All actions are done, without using any automated tasks / bots.\r\n\r\nOur price is just $60 (USD) per month and we can start immediately.\r\n\r\nIf you are interested then we can discuss further.\r\n\r\nKind Regards',1,0,1,NULL,'2025-04-10 14:20:48','2025-05-12 03:38:05',NULL),(35,'ClaytonGlons','Software Engineer','ClaytonGlons','81152625697','myno.s.ta.l.g.ia1.960s@gmail.com','Collection Management','Robert AI is a crypto ecosystem that combines AI with decentralized finance to offer real utility and sustainable growth. Unlike meme coins, Robert AI is focused on staking rewards, SEO-based promotion, and decentralized governance. \r\nhttps://ai-robert.site/ \r\n \r\nToken holders can receive monthly rewards, with 50% of fees shared among top holders and 50% destroyed to create deflation. The project also attracts MEV bots via Uniswap pools, boosting on-chain activity. \r\n \r\nFuture updates include AI',1,0,1,NULL,'2025-04-20 07:02:59','2025-05-12 03:38:05',NULL),(36,'Joycelyn','Qxyb P','Joycelyn Frierson','9131358918','joycelyn.frierson@outlook.com','Skip Tracing','Hi there, I apologize for using your contact form, \r\nbut I wasn\'t sure who the right person was to speak with in your company. \r\nWe have a patented application that creates Local Area pages that rank on \r\ntop of Google within weeks, we call it Local Magic.  Here is a link to the \r\nproduct page https://www.mrmarketingres.com/local-magic/ . The product \r\nleverages technology where these pages are managed dynamically by AI and \r\nit is ideal for promoting any type of business that gets customers fro',1,0,1,NULL,'2025-04-27 12:19:21','2025-05-12 03:38:05',NULL),(37,'Joanna','Rkjrnad Lnr','Joanna Riggs','6884523538','joannariggs278@gmail.com','Collection Management','Hi,\r\n\r\nI just visited lendell.ph and wondered if you\'ve ever considered an impactful video to advertise your business? Our videos can generate impressive results on both your website and across social media.\r\n\r\nOur prices start from just $195.\r\n\r\nLet me know if you\'re interested in seeing samples of our previous work.\r\n\r\nRegards,\r\nJoanna',1,0,1,NULL,'2025-04-28 05:38:56','2025-05-12 03:38:05',NULL),(38,'jesper','dg','dgd','000','jesper@gmail.com','Property Verification','fdfsfd',1,0,1,NULL,'2025-05-05 07:27:04','2025-05-12 03:38:05',NULL),(39,'jesper','dg','dgd','000','jesper@gmail.com','Property Verification','fdfsfd',1,0,1,NULL,'2025-05-05 07:27:04','2025-05-12 03:38:05',NULL),(40,'test','test','test','0905325401','btgresola@uerm.edu.ph','Credit Investigation','fsdfs',1,0,1,NULL,'2025-05-10 02:37:31','2025-05-12 03:38:05',NULL),(41,'test','test','test','0905325401','btgresola@uerm.edu.ph','Credit Investigation','fsdfs',1,0,1,NULL,'2025-05-10 02:37:31','2025-05-12 03:38:05',NULL),(42,'test','test','test','0905325401','btgresola@uerm.edu.ph','Credit Investigation','fsdfs',1,0,1,NULL,'2025-05-10 02:40:44','2025-05-12 03:38:05',NULL),(43,'test','test','test','0905325401','btgresola@uerm.edu.ph','Credit Investigation','fsdfs',1,0,1,NULL,'2025-05-10 02:40:44','2025-05-12 03:38:05',NULL),(44,'test','test','tet','test','bernard.gresola@lendell.ph','Background Investigation','test',1,0,1,NULL,'2025-05-10 02:43:07','2025-05-12 03:38:05',NULL),(45,'test','test','tet','test','bernard.gresola@lendell.ph','Background Investigation','test',1,0,1,NULL,'2025-05-10 02:43:07','2025-05-12 03:38:05',NULL),(46,'test','test','tet','test','bernard.gresola@lendell.ph','Background Investigation','test',1,0,1,NULL,'2025-05-10 02:44:19','2025-05-12 03:38:05',NULL),(47,'test','test','tet','test','bernard.gresola@lendell.ph','Background Investigation','test',1,0,1,NULL,'2025-05-10 02:44:19','2025-05-12 03:38:05',NULL),(48,'test','testqte','test','tes','test','Credit Investigation','test',1,0,1,NULL,'2025-05-10 02:44:34','2025-05-12 03:38:05',NULL),(49,'test','testqte','test','tes','test','Credit Investigation','test',1,0,1,NULL,'2025-05-10 02:44:34','2025-05-12 03:38:05',NULL),(50,'test','tet','test','tset','psnavarro@uerm.edu.ph','Background Investigation','se',1,0,1,NULL,'2025-05-10 02:50:13','2025-05-12 03:38:05',NULL),(51,'test','tet','test','tset','psnavarro@uerm.edu.ph','Background Investigation','se',1,0,1,NULL,'2025-05-10 02:50:13','2025-05-12 03:38:05',NULL),(52,'test','te','tes','tet','gresola_bernard@yahoo.com','Credit Investigation','te',1,0,1,NULL,'2025-05-10 02:50:50','2025-05-12 03:38:05',NULL),(53,'test','te','tes','tet','gresola_bernard@yahoo.com','Credit Investigation','te',1,0,1,NULL,'2025-05-10 02:50:50','2025-05-12 03:38:05',NULL),(54,'test','test','tes','ts','psnavarro@uerm.edu.ph','Credit Investigation','31',1,0,1,NULL,'2025-05-10 02:52:18','2025-05-12 03:38:05',NULL),(55,'test','test','tes','ts','psnavarro@uerm.edu.ph','Credit Investigation','31',1,0,1,NULL,'2025-05-10 02:52:18','2025-05-12 03:38:05',NULL),(56,'test','test','tes','test','bernard.gresola@lendell.ph','Background Investigation','tes',1,0,1,NULL,'2025-05-10 02:53:58','2025-05-12 03:38:05',NULL),(57,'test','test','tes','test','bernard.gresola@lendell.ph','Background Investigation','tes',1,0,1,NULL,'2025-05-10 02:53:58','2025-05-12 03:38:05',NULL),(58,'test','te','tes','tes','bernard.gresola@lendell.ph','Background Investigation','ts',1,0,1,NULL,'2025-05-10 02:55:09','2025-05-12 03:38:05',NULL),(59,'test','te','tes','tes','bernard.gresola@lendell.ph','Background Investigation','ts',1,0,1,NULL,'2025-05-10 02:55:09','2025-05-12 03:38:05',NULL),(60,'test','test','te','tes','bernard.gresola@lendell.ph','Background Investigation','tes',1,0,1,NULL,'2025-05-10 02:57:10','2025-05-12 03:38:05',NULL),(61,'test','test','te','tes','bernard.gresola@lendell.ph','Background Investigation','tes',1,0,1,NULL,'2025-05-10 02:57:10','2025-05-12 03:38:05',NULL),(62,'test','test','tes','tes','bernard.gresola@lendell.ph','Credit Investigation','sdg',1,0,1,NULL,'2025-05-10 02:58:04','2025-05-12 03:38:05',NULL),(63,'test','tes','tes','t','bernard.gresola@lendell.ph','Credit Investigation','dsf',1,0,1,NULL,'2025-05-10 02:58:39','2025-05-12 03:38:05',NULL);
/*!40000 ALTER TABLE `tbl_inquiries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_meetings`
--

DROP TABLE IF EXISTS `tbl_meetings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_meetings` (
  `meeting_id` int(11) NOT NULL AUTO_INCREMENT,
  `meeting_name` varchar(255) NOT NULL,
  `company_id` int(11) NOT NULL,
  `meeting_datetime` datetime NOT NULL,
  `category` tinyint(1) NOT NULL COMMENT '0 - Online\r\n1 - Face to Face',
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0 - Upcoming\r\n1 - Done',
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`meeting_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `tbl_meetings_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `tbl_prospect_clients` (`prospect_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_meetings`
--

LOCK TABLES `tbl_meetings` WRITE;
/*!40000 ALTER TABLE `tbl_meetings` DISABLE KEYS */;
INSERT INTO `tbl_meetings` VALUES (1,'Project Kickoff',1,'2025-01-25 10:00:00',0,0,'2025-01-23 08:43:29'),(2,'Marketing Strategy Discussion',2,'2025-01-26 14:00:00',1,0,'2025-01-23 08:43:29'),(3,'Sustainability Plan Review',3,'2025-01-27 09:00:00',1,1,'2025-01-23 08:43:29'),(4,'Design Feedback Session',4,'2025-01-28 11:30:00',0,1,'2025-01-23 08:43:29'),(5,'Data Analysis Insights',5,'2025-01-29 13:00:00',1,0,'2025-01-23 08:43:29'),(6,'Business Proposal Discussion',6,'2025-01-30 15:00:00',0,0,'2025-01-23 08:43:29'),(7,'Cloud Solutions Demo',7,'2025-02-01 10:30:00',0,1,'2025-01-23 08:43:29'),(8,'HR Onboarding Meeting',8,'2025-02-02 09:15:00',1,0,'2025-01-23 08:43:29'),(9,'Branding Workshop',9,'2025-02-03 16:00:00',1,1,'2025-01-23 08:43:29'),(10,'Construction Plan Update',10,'2025-02-04 14:00:00',0,1,'2025-01-23 08:43:29');
/*!40000 ALTER TABLE `tbl_meetings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_prospect_clients`
--

DROP TABLE IF EXISTS `tbl_prospect_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_prospect_clients` (
  `prospect_id` int(11) NOT NULL AUTO_INCREMENT,
  `company_name` varchar(255) NOT NULL,
  `contact_person` varchar(255) NOT NULL,
  `designation` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `package` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `date_created` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`prospect_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_prospect_clients`
--

LOCK TABLES `tbl_prospect_clients` WRITE;
/*!40000 ALTER TABLE `tbl_prospect_clients` DISABLE KEYS */;
INSERT INTO `tbl_prospect_clients` VALUES (1,'Tech Visionaries','Alice Carter','IT Manager','alice.carter@techvision.com','Starter Package',1,'2025-01-23 08:34:14'),(2,'Future Innovations','Mark Wilson','CEO','mark.wilson@futureinnovations.com','Premium Package',0,'2025-01-23 08:34:14'),(3,'GreenEarth Solutions','Emily Green','Sustainability Officer','emily.green@greenearth.com','Standard Package',1,'2025-01-23 08:34:14'),(4,'NextGen Industries','Robert Hill','Operations Manager','robert.hill@nextgen.com','Enterprise Package',0,'2025-01-23 08:34:14'),(5,'Smart Designs Ltd.','Jessica Lane','Creative Director','jessica.lane@smartdesigns.com','Custom Package',1,'2025-01-23 08:34:14'),(6,'BrightPath Co.','Daniel Wright','HR Head','daniel.wright@brightpath.com','Starter Package',0,'2025-01-23 08:34:14'),(7,'Elite Ventures','Sophia Moore','Marketing Director','sophia.moore@eliteventures.com','Standard Package',1,'2025-01-23 08:34:14'),(8,'InnoTech Labs','Chris Adams','CTO','chris.adams@innotech.com','Premium Package',0,'2025-01-23 08:34:14'),(9,'Pioneer Systems','Laura Baker','Project Manager','laura.baker@pioneersystems.com','Enterprise Package',1,'2025-01-23 08:34:14'),(10,'Dynamic Corp.','Michael Scott','Business Analyst','michael.scott@dynamiccorp.com','Standard Package',0,'2025-01-23 08:34:14');
/*!40000 ALTER TABLE `tbl_prospect_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbl_users`
--

DROP TABLE IF EXISTS `tbl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbl_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbl_users`
--

LOCK TABLES `tbl_users` WRITE;
/*!40000 ALTER TABLE `tbl_users` DISABLE KEYS */;
INSERT INTO `tbl_users` VALUES (2,'Samson','samson@gmail.com','$2y$10$gX2QgZnr1kszx8Z/twbE.ukUlozSELTlm3FhrWxjqpzT/jQtq1iim','2025-01-09 03:41:47'),(4,'Jesper','jesper@gmail.com','$2y$10$LMYC2hhUmsRjoIG8ai81re0l/3PwF2ArdNaISSI.s/F5xUJUVrtju','2025-01-17 06:02:06');
/*!40000 ALTER TABLE `tbl_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-13  9:26:15
