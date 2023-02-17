
-- Start users
CREATE TABLE IF NOT EXISTS `users` (
`sl` int(11) NOT NULL,
  `password` varchar(512) NOT NULL,
  `active` int(11) NOT NULL,
  `access` int(11) DEFAULT NULL,
  `image` mediumtext NOT NULL,
  `device_sync` int(11) DEFAULT NULL,
  `device_id` int(11) DEFAULT NULL,
  `org_id` int(11) DEFAULT NULL
) ;



INSERT INTO `users` (`sl`, `password`, `active`, `access`, `image`, `device_sync`, `device_id`, `org_id`) VALUES
( '1000', 'd404559f602eab6fd602ac7680dacbfaadd13630335e951f097af3900e9de176b6db28512f2e000b9d04fba5133e8b1c6e8df59db3a8ab9d60be4b97cc9e81db', 1, 1, 'jisan.jpg', NULL, NULL, NULL);


ALTER TABLE `users`
 ADD PRIMARY KEY (`sl`);


ALTER TABLE `users`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1001;

-- Start Employee


CREATE TABLE IF NOT EXISTS `employee` (
`sl` int(11) NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `designation` int(11) NOT NULL,
  `salary` int(11) NOT NULL
) ;



INSERT INTO `employee` (`sl`, `name`, `designation`, `salary`) VALUES
(1000, 'Tareq Rahman Jisan', 1, 1);




ALTER TABLE `employee`
 ADD PRIMARY KEY (`sl`);


ALTER TABLE `employee`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1001;

-- Start Designation



CREATE TABLE IF NOT EXISTS `designation` (
`sl` int(11) NOT NULL,
  `designation` varchar(45) NOT NULL,
  `org_id` varchar(45) DEFAULT NULL
) ;



INSERT INTO `designation` (`sl`, `designation`, `org_id`) VALUES
(1, 'Admin', NULL);


ALTER TABLE `designation`
 ADD PRIMARY KEY (`sl`);


ALTER TABLE `designation`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;

-- Menu 


CREATE TABLE IF NOT EXISTS `menu` (
`sl` int(11) NOT NULL,
  `menu` varchar(100) NOT NULL,
  `left_icon` varchar(300) NOT NULL,
  `right_icon` varchar(300) NOT NULL,
  `viewsl` int(11) DEFAULT NULL
) ;



INSERT INTO `menu` (`sl`, `menu`, `left_icon`, `right_icon`, `viewsl`) VALUES
(1, 'Access Control', 'nav-icon fas fa-user-lock', 'fas fa-angle-left right', 1);


ALTER TABLE `menu`
 ADD PRIMARY KEY (`sl`), ADD UNIQUE KEY `menu_UNIQUE` (`menu`);


ALTER TABLE `menu`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;


-- Menu Pages


CREATE TABLE IF NOT EXISTS `menu_pages` (
`sl` int(11) NOT NULL,
  `page` varchar(200) NOT NULL,
  `link` varchar(100) NOT NULL,
  `icon` varchar(200) NOT NULL,
  `menu` int(11) NOT NULL,
  `query_id` text NOT NULL,
  `query` text NOT NULL,
  `ui_query` text NOT NULL,
  `report_query` text NOT NULL,
  `default_report_condition` text NOT NULL,
  `dynamic_report_condition` text NOT NULL,
  `conditional_column` text NOT NULL,
  `update_query` text NOT NULL,
  `select_option_query` text NOT NULL,
  `other_query` text NOT NULL
);



INSERT INTO `menu_pages` (`sl`, `page`, `link`, `icon`, `menu`, `query_id`, `query`, `ui_query`, `report_query`, `default_report_condition`, `dynamic_report_condition`, `conditional_column`, `update_query`, `select_option_query`, `other_query`) VALUES
(1, 'Menu', '/MenuControl', 'far fa-circle nav-icon', 1, '98f13708210194c475687be6106a3b84', '', '', '', '', '', '', '', '', '');


ALTER TABLE `menu_pages`
 ADD PRIMARY KEY (`sl`);


ALTER TABLE `menu_pages`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;


-- Menu access group


CREATE TABLE IF NOT EXISTS `menu_access_group` (
`sl` int(11) NOT NULL,
  `group_name` varchar(45) NOT NULL
) ;



INSERT INTO `menu_access_group` (`sl`, `group_name`) VALUES
(1, 'Super Admin');


ALTER TABLE `menu_access_group`
 ADD PRIMARY KEY (`sl`);


ALTER TABLE `menu_access_group`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;

-- Menu access control


CREATE TABLE IF NOT EXISTS `menu_access_control` (
`sl` int(11) NOT NULL,
  `group_id` int(11) DEFAULT NULL,
  `page` int(11) DEFAULT NULL
) ;



INSERT INTO `menu_access_control` (`sl`, `group_id`, `page`) VALUES
(1, 1, 1);

ALTER TABLE `menu_access_control`
 ADD PRIMARY KEY (`sl`);


ALTER TABLE `menu_access_control`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;

-- notification


CREATE TABLE IF NOT EXISTS `notification` (
`sl` int(11) NOT NULL,
  `sender` int(11) DEFAULT NULL,
  `receiver` int(11) DEFAULT NULL,
  `msg` longtext,
  `date_time` datetime DEFAULT NULL,
  `type` int(11) DEFAULT NULL,
  `user_read` int(11) DEFAULT NULL
) ;


ALTER TABLE `notification`
 ADD PRIMARY KEY (`sl`);


ALTER TABLE `notification`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;

-- error


CREATE TABLE IF NOT EXISTS `error` (
`id` int(11) NOT NULL,
  `api` longtext,
  `error` longtext,
  `application` varchar(45) DEFAULT NULL,
  `date_time` varchar(45) DEFAULT NULL
) ;



ALTER TABLE `error`
 ADD PRIMARY KEY (`id`);


ALTER TABLE `error`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;

-- ui info


CREATE TABLE IF NOT EXISTS `ui_info` (
`sl` int(11) NOT NULL,
  `table_name` text NOT NULL,
  `col_name` text NOT NULL,
  `input_label` text NOT NULL,
  `input_type` text NOT NULL,
  `select_sl` int(11) NOT NULL,
  `isnull` int(11) NOT NULL
) ;


ALTER TABLE `ui_info`
 ADD PRIMARY KEY (`sl`);

ALTER TABLE `ui_info`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=1;


-- ui info report condition



CREATE TABLE IF NOT EXISTS `ui_report_condition` (
  `query_id` text NOT NULL,
  `sl` int(11) NOT NULL,
  `col` text NOT NULL
) ;

-- ui generate


