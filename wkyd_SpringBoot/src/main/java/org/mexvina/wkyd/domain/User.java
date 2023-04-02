package org.mexvina.wkyd.domain;


import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

/*
 * 数据库命令: create table if not exists `usertable`(`dataId` int unsigned auto_increment, `userId` varchar(20), `userOd` varchar(50), PRIMARY KEY(`dataId`))ENGINE=InnoDB DEFAULT CHARSET=utf8;
 */
@Service
@Component
public class User {

        private Integer dataId;
        private String userId;
        private String userOd;

        public Integer getDataId() {
            return dataId;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUserOd() {
            return userOd;
        }

        public void setUserOd(String userOd) {
            this.userOd = userOd;
        }

}
