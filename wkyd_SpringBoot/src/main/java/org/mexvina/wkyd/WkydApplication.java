package org.mexvina.wkyd;

import org.apache.ibatis.annotations.Mapper;
//import org.mybatis.spring.annotation.MapperScan;
import org.mexvina.wkyd.myOverride.MyPropertySourceFactory;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.PropertySource;

@SpringBootApplication
// 加载配置文件,重写加载器,自定义价值规则
@PropertySource(value="file:KohobodiBoy.mp3", factory = MyPropertySourceFactory.class, encoding = "UTF-8", name = "KohobodiBoy")
@ComponentScan(basePackages = {"org.mexvina.wkyd.repository", "org.mexvina.wkyd.service", "org.mexvina.wkyd.web", "org.mexvina.wkyd.domain", "org.mexvina.wkyd.myOverride", "org.mexvina.wkyd.myFilter", "org.mexvina.wkyd"})
public class WkydApplication {

	public static void main(String[] args) {
		SpringApplication.run(WkydApplication.class, args);
	}

}
