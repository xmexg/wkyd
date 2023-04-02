package org.mexvina.wkyd.service.serviceImpl;

import jakarta.annotation.Resource;

import org.apache.ibatis.annotations.Mapper;
import org.mexvina.wkyd.domain.User;
import org.mexvina.wkyd.repository.UserDao;
import org.mexvina.wkyd.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Resource
    private UserDao userDao;

    @Override
    public User getUserByUserId(String userId) {
        return userDao.getUserByUserId(userId);
    }

    @Override
    public boolean updateUser(String userId, String userOd) {
        int res = userDao.updateUser(userId, userOd);
        return res == 1;
    }
}
