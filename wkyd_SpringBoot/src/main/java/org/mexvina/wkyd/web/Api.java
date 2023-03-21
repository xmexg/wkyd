package org.mexvina.wkyd.web;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import org.mexvina.wkyd.NetWork;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;


@RestController
@RequestMapping("/api")
public class Api {

    @Autowired
    NetWork netWork;

    //提交跑步记录
    @PostMapping("/run/addRunInfo")
    public String addRunInfo(@RequestParam String salt, @RequestParam String sign, @RequestBody Map<String, Object> runInfo) {

        Map<String, String> head = JSON.parseObject(JSON.toJSONString(runInfo.get("HEAD")), new TypeReference<Map<String, String>>() {});
        String body = JSON.toJSONString(runInfo.get("BODY"));

        String res = netWork.sendPost2("http://sports.wfust.edu.cn/api/run/addRunInfo?salt="+salt+"&sign="+sign, head, body);
        return res;
    }

    //获取4个打卡点
    @PostMapping("/semester/queryPoint")
    public String queryPoint(@RequestParam String salt, @RequestParam String sign, @RequestBody Map<String, Object> runInfo) {

        Map<String, String> head = JSON.parseObject(JSON.toJSONString(runInfo.get("HEAD")), new TypeReference<Map<String, String>>() {});
        String body = JSON.toJSONString(runInfo.get("BODY"));

        String res = netWork.sendPost2("http://sports.wfust.edu.cn/api/semester/queryPoint?salt="+salt+"&sign="+sign, head, body);
        return res;
    }
}
