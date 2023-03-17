# apk反编译分析笔记

## 开始
 - 学校运动apk未加固
 - 安装jadx:`sudo apt-get install jadx`
 - 打开jadx,使用jadx查看该apk


## 已知无用的包:
 - 高德地图(autoavi,amap.api)
 - u-app反作弊(efs.sdk)
 - 友盟(umeng)
 - google的一些页面控件和json包(google)
 - UC啄木鸟(uc.crashsdk好像是友盟里的)
 - 网络请求类(okhttp3,okio,retrofit2)
 - kotlin(kotlin)
 - java(io.reactivex,chad.library.adapter.base)
 - 系统的包定义功能?(defpackage)
 - 系统沉浸式状态栏(gyf.immersionbar)

## md5加密(com.dudu.run.utils)
 ```
package com.dudu.run.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/* compiled from: MD5.java */
/* loaded from: classes.dex */
public class j {
    private static String a(String str) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("MD5");
            messageDigest.update(str.getBytes());
            byte[] digest = messageDigest.digest();
            StringBuffer stringBuffer = new StringBuffer("");
            for (int i = 0; i < digest.length; i++) {
                int i2 = digest[i];
                if (i2 < 0) {
                    i2 += 256;
                }
                if (i2 < 16) {
                    stringBuffer.append("0");
                }
                stringBuffer.append(Integer.toHexString(i2));
            }
            return stringBuffer.toString();
        } catch (NoSuchAlgorithmException e2) {
            e2.printStackTrace();
            return null;
        }
    }

    public static String b(String str) {
        String a = a(str);
        return a != null ? a : str;
    }
}
```
`在上文的代码中,他接收一段文本,并使用MessageDigest对文本计算md5的二进制值,然后通过for循环把二进制转为十六进制,这是大家熟知的md5算法`


## salt和sign的值计算(com.dudu.run.utils.n)
`com.dudu.run.utils.n的内容如下`  
```
package com.dudu.run.utils;

import java.util.UUID;

/* compiled from: SignUtils.java */
/* loaded from: classes.dex */
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
        return j.b(stringBuffer.toString()).toLowerCase();
    }
}
```
`com.dudu.run.utils.e的内容如下`
```
package com.dudu.run.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

/* compiled from: DateFormatUtils.java */
/* loaded from: classes.dex */
public class e {
    public static String a(long j) {
        return new SimpleDateFormat("yyyyMMdd").format(new Date(j));
    }

    public static String b(long j) {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(j));
    }
}
```  
`第1个方法a()生成一个UUID,并去除里面的-,如果替换后文本小于8位,则返回1234asdf,否则返回这段文本的前8位`
`第2个方法b()能接收一个字符串,使用e.a()生成现在的日期,加上当前的日期和duDusDut,然后计算这段文本的md5,并返回转换成小写字母后的md5`
`这里的随机数即为salt,md5即为sign`

## 一些已知的包的用途

 - 数据接口(com.dudu.run.f.a.a)

### com.dudu.tun.utils下的类分析
 - Accompaniment: 画出地图,播放媒体和声音
 - b: 读取本地配置文件相关
 - c: ?
 - d: 页面显示时的文本样式
 - e: 日期格式化
 - f: 规定android sdk要大于23
 - g: 数据传输时的ssl有关
 - h: 和gps定位有关
 - i: 空,无用
 - j: md5加密
 - k: 获取城市??无网络时返回请检查网络
 - l: 空,无用
 - m: 正则表达式(^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{1,50}$) 
 - n: 和sign有关!!!!!!!!!

## 一些敏感信息?
 - 友盟: 6095f5a1c9aacd3bd4c8bf9b
