package com.dudu.run.utils;

import java.util.UUID;

public class n {
    public static String a() {
        String replaceAll = UUID.randomUUID().toString().replaceAll("-", "");
        return (replaceAll == null || replaceAll.length() < 8) ? "1234asdf" : replaceAll.substring(0, 8);
    }

    public static String b(String str) {
        StringBuffer stringBuffer = new StringBuffer();
        stringBuffer.append(str);
        stringBuffer.append(e.a(System.currentTimeMillis()));
        stringBuffer.append("duDusDut");
        System.out.println("n.java - 随机数拼接后:"+stringBuffer);//输出随机数拼接后
        return j.b(stringBuffer.toString()).toLowerCase();
    }
}