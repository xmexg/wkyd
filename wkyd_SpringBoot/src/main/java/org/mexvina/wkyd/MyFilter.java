package org.mexvina.wkyd;

import org.springframework.context.annotation.Configuration;

/**
 * 过滤器
 */
@Configuration()
public class MyFilter {

    /**
     * 删除所有非数字和字母的字符
     */
    public static String save0aA(String str) {
        if(str == null)
            return null;
        return str.replaceAll("[^a-zA-Z0-9]", "");
    }
}
