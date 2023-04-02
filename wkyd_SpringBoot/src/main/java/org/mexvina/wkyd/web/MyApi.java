package org.mexvina.wkyd.web;

import org.mexvina.wkyd.MyFilter;
import org.mexvina.wkyd.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 这是网站的api
 */
@RestController
@RequestMapping("/webapi")
public class MyApi {

    @Autowired
    private UserService userService;

    @Autowired
    private MyFilter filter;

    @PostMapping("/upuser")
    public String upUser(@RequestBody Map<String, Object> order) {
        String userId = (String) order.get("userId");
        String userOd = (String) order.get("userOd");
        userId = filter.save0aA(userId);
        userOd = filter.save0aA(userOd);
        if (userId == null || userOd == null || userId.length() < 10 || userOd.length() < 10){//两个数值长度最小为10
            return "1";
        }
        System.out.println("updata:"+userId +"\t"+ userOd);

        boolean res = userService.updateUser(userId, userOd);
        return res ? "0" : "1";
    }
}
