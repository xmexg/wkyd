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
`推论: salt为生成的随机数, sign为加密后的md5`
  
### salt的值怎么获得?
 - 搜素一下`salt`,找到这里([com.dudu.run.f.a](./apktojava/com_dudu_run_f_a_a))
观察`/api/sys/currVersion`接口,这是软件启动时的更新检查接口,他是最干净的,参数只有salt和sign,  
```
 @o("/api/sys/currVersion")
 d<BaseResponse<CheckAppUpdateResponseData>> k(@t("salt") String str, @t("sign") String str2);
```
 - 搜素一下`com.dudu.run.f.a`,看看哪里引入了这些接口,找到了这里([com.dudu.run.g.b.a](./apktojava/com_dudu_run_g_b_a))
该包`import com.dudu.run.utils.n;`   
```
    @Override // com.dudu.run.g.a
    public void l(com.dudu.run.f.b.c<BaseResponse<CheckAppUpdateResponseData>> cVar) {
        String a = n.a();
        retrofit2.d<BaseResponse<CheckAppUpdateResponseData>> k2 = this.a.k(a, n.b(a));
        cVar.a();
        k2.W(new m(this, cVar));
    }
```
 - 找到`com.dudu.run.utils`,该文件源码在该标题下,n.a是生成一段8位的随机数,n.b(a)是随机数转md5,具体转法见标题`md5加密(com.dudu.run.utils)`   
 - 确凿上文salt和sign的算法是正确的,但不知道为什么和实际不一样`  
 - 对上条的后续:我尽可能原封不动的复刻了加密相关的包,是这套理论,他又正常工作了,说明我给出的加密方法是正确的,复刻代码见[apkmd5code](./apkmd5code)文件夹



## 一些已知的包的用途

 - 唯一`import com.dudu.run.utils.n`的包(com.dudu.run.g.b.a)
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
