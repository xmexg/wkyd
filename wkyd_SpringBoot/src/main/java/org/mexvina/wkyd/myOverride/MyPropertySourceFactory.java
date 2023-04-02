package org.mexvina.wkyd.myOverride;

import org.springframework.core.env.PropertiesPropertySource;
import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.EncodedResource;
import org.springframework.core.io.support.PropertySourceFactory;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Properties;

/**
 * 重写PropertySourceLoader,使其@PropertySource加载配置文件时符合我的意愿
 */
public class MyPropertySourceFactory implements PropertySourceFactory {
    @Override
    public PropertySource<?> createPropertySource(String name, EncodedResource resource) throws IOException {
        InputStream input = resource.getInputStream();
        byte[] bytes = input.readAllBytes();
        String content = new String(bytes, StandardCharsets.UTF_8);
        //寻找十六进制的0A0A0A0A0A,并截取
        int index = content.indexOf("\n\n\n\n\n");//十六进制的0A0A0A0A0A
        if (index != -1) {
            content = content.substring(0, index);
        } else {
            System.out.println("\n\tERROR: Invalid configuration file format");
            System.exit(1);
        }
        //将配置文件内容转换为Properties对象
        Properties props = new Properties();
        props.load(new ByteArrayInputStream(content.getBytes(StandardCharsets.UTF_8)));
        System.out.println("=====================  配置文件内容  =====================");
        System.out.println("\t文件名:"+name+"\n\t价值对:"+content);
        System.out.println("=======================================================");
        return new PropertiesPropertySource(name, props);
    }

}
