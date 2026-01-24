CREATE TABLE `lendellp_losis`.`tbl_investigation_types` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `code` VARCHAR(100) NULL,
  `name` VARCHAR(100) NULL,
  `description` VARCHAR(200) NULL,
  `datetime_created` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `datetime_updated` DATETIME NULL DEFAULT CURRENT_TIMESTAMP(),
  `remarks` VARCHAR(100) NULL,
  `active` TINYINT(1) NULL DEFAULT 1,
  PRIMARY KEY (`id`));




INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('academic-check', 'Academic Check', 'Academic Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('employment-check', 'Employment Checks', 'Employment Checks');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('character-reference-check', 'Character Reference Check', 'Character Reference Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('criminal-check', 'Criminal Check', 'Criminal Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('global-database-check', 'Global Database Check', 'Global Database Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('credit-check', 'Credit Check', 'Credit Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('local-court-check', 'Local Court Check', 'Local Court Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('world-check', 'World Check', 'World Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('address-check', 'Address Check', 'Address Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('nationality-check', 'Nationality Check', 'Nationality Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('sss-verification-check', 'SSS Verification Check', 'SSS Verification Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('identity-check', 'Identity Check', 'Identity Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('ofac-check', 'OFAC', 'OFAC');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('government-military-check', 'Government Military Check', 'Government Military Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('ph-nationality-check', 'PH Nationality Check', 'PH Nationality Check');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('motor-vehicle-check', 'Motor Vehicle Checks', 'Motor Vehicle Checks');
INSERT INTO `lendellp_losis`.`tbl_investigation_types` (`code`, `name`, `description`) VALUES ('licenses-professional-cert-check', 'Licenses / Professional Certification Check', 'Licenses / Professional Certification Check');
