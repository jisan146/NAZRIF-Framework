

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

