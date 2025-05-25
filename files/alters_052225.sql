ALTER TABLE `lendellp_losis_test`.`tbl_endo` 
ADD COLUMN `external_client_id` VARCHAR(45) NULL COMMENT 'For API Integration' AFTER `application_code`;


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