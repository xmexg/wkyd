# 现状
作者已弃坑,有想接手后续开发可提出`Issues`或在[Telegram](https://t.me/mge0_0)与我取得联系

# wkyd
wk运动app的抓包笔记与利用思路
```
          _____                    _____                _____                    _____          
         /\    \                  /\    \              |\    \                  /\    \         
        /::\____\                /::\____\             |:\____\                /::\    \        
       /:::/    /               /:::/    /             |::|   |               /::::\    \       
      /:::/   _/___            /:::/    /              |::|   |              /::::::\    \      
     /:::/   /\    \          /:::/    /               |::|   |             /:::/\:::\    \     
    /:::/   /::\____\        /:::/____/                |::|   |            /:::/  \:::\    \    
   /:::/   /:::/    /       /::::\    \                |::|   |           /:::/    \:::\    \   
  /:::/   /:::/   _/___    /::::::\____\________       |::|___|______    /:::/    / \:::\    \  
 /:::/___/:::/   /\    \  /:::/\:::::::::::\    \      /::::::::\    \  /:::/    /   \:::\ ___\ 
|:::|   /:::/   /::\____\/:::/  |:::::::::::\____\    /::::::::::\____\/:::/____/     \:::|    |
|:::|__/:::/   /:::/    /\::/   |::|~~~|~~~~~        /:::/~~~~/~~      \:::\    \     /:::|____|
 \:::\/:::/   /:::/    /  \/____|::|   |            /:::/    /          \:::\    \   /:::/    / 
  \::::::/   /:::/    /         |::|   |           /:::/    /            \:::\    \ /:::/    /  
   \::::/___/:::/    /          |::|   |          /:::/    /              \:::\    /:::/    /   
    \:::\__/:::/    /           |::|   |          \::/    /                \:::\  /:::/    /    
     \::::::::/    /            |::|   |           \/____/                  \:::\/:::/    /     
      \::::::/    /             |::|   |                                     \::::::/    /      
       \::::/    /              \::|   |                                      \::::/    /       
        \::/____/                \:|   |                                       \::/____/        
         ~~                       \|___|                                        ~~              

```


# 抓包记录
[抓包笔记](./抓包记录)

# apk反编译及salt和sign算法
[apk反编译分析笔记](./apk反编译分析笔记.md)

# 笔记

## salt和sign  
- salt和sign已解密,使用UUID随机字符的前8位为salt,加上当前日期加duDusDut再md5转小写字母为sign,可使用[演示程序](./apkmd5code/apkmd5code.jar)来生成,详见[apk反编译分析笔记](./apk反编译分析笔记.md)  
![image](./image/apkmd5codejar.png)
- salt和sign在未登录前的检查更新中就已经可以生成,并且通过替换学号,相同的salt和sign仍然生效推测,这两值的原始密文应该是固定的,与帐号和密码无关;salt和sign有有效时长,较长时候后会失效; 
- 使用有效的salt和sign值,通过修改学号可操作指定学号的信息

## 跑步
- 跑步前一定要先查看规则,让规则加载出来,这样跑步时的成绩才是有效的,否则会一直成绩无效  
- 跑步时不会向学校服务器发送数据,所有数据在按下提交按钮后提交,这份数据可重复使用且通过修改学号可帮该学号完成跑步  

## web
 - [SpringBoot服务端](./wkyd_SpringBoot)  
 - 演示网站http://101.42.33.254:9090
 
## 搭建自己的平台  
 - 数据库配置  
  创建数据库: `自行创建`  
  假设你已创建并通过终端连接了名为`wkydgithub`的该数据库  
  使用该数据库
```
use wkydgithub
```
  创建数据表
```
create table if not exists `usertable`(`dataId` int unsigned auto_increment, `userId` varchar(20), `userOd` varchar(50), PRIMARY KEY(`dataId`))ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

 - 本地jar配置  
 下载jar文件  
 默认的配置文件是 [KohobodiBoy.mp3](./wkyd_SpringBoot/KohobodiBoy.mp3) ,把该文件和下载的jar文件放在同一个目录中,使用`hex`编辑本文件  
 切勿使用windows自带的文本编辑器!!!  
 只修改必要的信息,其他信息切勿乱动!!!  
 
 - 启动程序  
 `java -jar 文件名.jar`  


