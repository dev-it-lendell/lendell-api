ALTER TABLE `lendellp_losis_test`.`tbl_endo` 
ADD COLUMN `external_client_id` VARCHAR(45) NULL DEFAULT NULL COMMENT 'For API Integration' AFTER `application_code`,
ADD COLUMN `active` TINYINT(1) NULL DEFAULT 1 AFTER `external_client_id`,
ADD COLUMN `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP() AFTER `active`,
ADD COLUMN `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP() AFTER `created_at`;


CREATE TABLE `lendellp_losis_test`.`tbl_candidate_status` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(100) NULL,
  `name` VARCHAR(150) NULL,
  `description` VARCHAR(250) NULL,
  `created_by` VARCHAR(100) NULL,
  `updated_by` VARCHAR(100) NULL,
  `created_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `updated_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `remarks` VARCHAR(250) NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `lendellp_losis_test`.`tbl_candidate_status` 
ADD COLUMN `active` TINYINT(1) NULL DEFAULT 1 AFTER `description`;


INSERT INTO `lendellp_losis_test`.`tbl_candidate_status` (`code`, `name`, `description`) VALUES ('hired', 'Hired', 'Hired');
INSERT INTO `lendellp_losis_test`.`tbl_candidate_status` (`code`, `name`, `description`) VALUES ('complete_pre_onboarding', 'Complete Pre-onboarding', 'Complete Pre-onboarding');
INSERT INTO `lendellp_losis_test`.`tbl_candidate_status` (`code`, `name`, `description`) VALUES ('onboarded', 'Onboarded', 'Onboarded');
INSERT INTO `lendellp_losis_test`.`tbl_candidate_status` (`code`, `name`, `description`) VALUES ('workday_onboarding', 'Workday Onboarding', 'Workday Onboarding');


ALTER TABLE tbl_endo ADD INDEX client_id (client_id);
ALTER TABLE tbl_endo ADD INDEX site_id (endo_code);
ALTER TABLE tbl_endo ADD INDEX endorsed_to (endorsed_to);
ALTER TABLE tbl_client ADD INDEX user_id (user_id);
ALTER TABLE client_list ADD INDEX client_id (client_id);
ALTER TABLE tbl_endorsement_bi_process ADD INDEX endo_code (endo_code);
ALTER TABLE tbl_supervisor ADD INDEX user_id (user_id);

ALTER TABLE `lendellp_losis_test`.`supervisor_list` 
ADD COLUMN `user_id` VARCHAR(80) NULL AFTER `suffix`;


UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000008' WHERE (`id` = '2');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000009' WHERE (`id` = '3');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000010' WHERE (`id` = '4');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000011' WHERE (`id` = '5');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000012' WHERE (`id` = '6');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000013' WHERE (`id` = '7');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000014' WHERE (`id` = '8');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000015' WHERE (`id` = '9');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000016' WHERE (`id` = '10');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000017' WHERE (`id` = '11');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000018' WHERE (`id` = '12');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000019' WHERE (`id` = '13');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000020' WHERE (`id` = '14');
UPDATE `lendellp_losis_test`.`supervisor_list` SET `user_id` = 'LOSIS-000114' WHERE (`id` = '18');


CREATE TABLE `lendellp_losis_test`.`tbl_endo_api_data` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `endo_code` VARCHAR(255) NULL,
  `raw_data` TEXT NULL,
  `provider` VARCHAR(45) NULL,
  `datetime_created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `datetime_updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `remarks` VARCHAR(150) NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `lendellp_losis_test`.`tbl_endo_external_files` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `endo_code` VARCHAR(255) NULL DEFAULT NULL,
  `name` VARCHAR(200) NULL,
  `type` VARCHAR(100) NULL,
  `content_type` VARCHAR(150) NULL DEFAULT NULL,
  `content_url` TEXT NULL DEFAULT NULL,
  `datetime_created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `datetime_updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  `remarks` VARCHAR(150) NULL DEFAULT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `lendellp_losis_test`.`tbl_endo_external_files` 
ADD COLUMN `tag` VARCHAR(200) NULL AFTER `name`;

