package org.mexvina.wkyd.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.mexvina.wkyd.domain.User;


/**
 * 数据库命令: create table if not exists `usertable`(`dataId` int unsigned auto_increment, `userId` varchar(20), `userOd` varchar(50), PRIMARY KEY(`dataId`))ENGINE=InnoDB DEFAULT CHARSET=utf8;
 */
@Mapper
public interface UserDao {

    //根据user_id查询用户
    @Select("select * from usertable where userId = #{userId} limit 1")
    public User getUserByUserId(String userId);

    //更新用户信息,表中的userId为空时才更新
    @Update("update usertable set userId = #{userId} where userOd = #{userOd} and userId is null")
    public int updateUser(String userId, String userOd);
}
