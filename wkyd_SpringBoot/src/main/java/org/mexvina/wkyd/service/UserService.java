package org.mexvina.wkyd.service;

import org.mexvina.wkyd.domain.User;
import org.springframework.stereotype.Service;

@Service
public interface UserService {
    User getUserByUserId(String userId);

    boolean updateUser(String userId, String userOd);
}
