

CREATE TABLE IF NOT EXISTS `init` (
`sl` int(11) NOT NULL,
  `option` text NOT NULL,
  `status` text NOT NULL
) ;



INSERT INTO `init` (`sl`, `option`, `status`) VALUES
(1, 'Install', 'Not Start');



ALTER TABLE `init`
 ADD PRIMARY KEY (`sl`);


ALTER TABLE `init`
MODIFY `sl` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
