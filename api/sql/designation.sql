

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

