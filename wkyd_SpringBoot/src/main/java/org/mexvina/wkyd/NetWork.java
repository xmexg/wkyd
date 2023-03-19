package org.mexvina.wkyd;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.Map;

@Component
public class NetWork {
    //发生post请求
    public static String sendPost(String url,Map<String, String> head , String param) {
        PrintWriter out = null;
        BufferedReader in = null;
        String result = "";
        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection conn = realUrl.openConnection();
            // 设置通用的请求属性
            for (Map.Entry<String, String> entry : head.entrySet()) {
                conn.setRequestProperty(entry.getKey(), entry.getValue());
            }
            conn.setRequestProperty("Connection", "close");
            conn.setRequestProperty("Content-Type", "application/json ; charset=utf-8");
            conn.setRequestProperty("Content-Length", String.valueOf(param.length()));
            conn.setRequestProperty("Host", "sports.wfust.edu.cn");
            conn.setRequestProperty("Accept-Encoding", "gzip, deflate, result");
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            // 获取URLConnection对象对应的输出流
            out = new PrintWriter(conn.getOutputStream());
            // 发送请求参数
            out.print(param);
            // flush输出流的缓冲
            out.flush();
            // 定义BufferedReader输入流来读取URL的响应
            in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
            System.out.println("发送 POST 请求出现异常！" + e);
            e.printStackTrace();
        }
        //使用finally块来关闭输出流、输入流
        finally {
            try {
                if (out != null) {
                    out.close();
                }
                if (in != null) {
                    in.close();
                }
            } catch (IOException ex) {
                ex.printStackTrace();
            }
        }
        return result;
    }


    public static String sendPost2(String url,Map<String, String> head , String param ) {
        try {
            // 创建连接
            URL obj = new URL(url);
            HttpURLConnection conn = (HttpURLConnection) obj.openConnection();
            conn.setRequestMethod("POST");


            // 请求头
            conn.setRequestProperty("Connection", "close");
            conn.setRequestProperty("Content-Type", "application/json ; charset=utf-8");
            conn.setRequestProperty("Host", "sports.wfust.edu.cn");
            conn.setRequestProperty("Accept-Encoding", "gzip, deflate, result");


            // 添加请求头
            for (Map.Entry<String, String> entry : head.entrySet()) {
                conn.setRequestProperty(entry.getKey(), entry.getValue());
            }

            // 添加请求体
            conn.setDoOutput(true);// 设置是否向httpUrlConnection输出，因为这个是post请求，参数要放在http正文内，因此需要设为true, 默认情况下是false;
//            conn.getOutputStream().write(param.getBytes("UTF-8"));//post的参数
            conn.getOutputStream().write(param.getBytes());//post的参数

            // 发送请求
            int responseCode = conn.getResponseCode();
            System.out.println("Response Code : " + responseCode);

            // 读取响应
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            // 打印响应
//            System.out.println(response.toString());
            return response.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    //使用Apache HttpClient发送post请求
    public static String sendPost3(String url,Map<String, String> head , String param ) {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpPost httpPost = new HttpPost(url);
        //设置请求头
        httpPost.setHeader("Connection", "close");
        httpPost.setHeader("Content-Type", "application/json ; charset=utf-8");
        httpPost.setHeader("Host", "sports.wfust.edu.cn");
        httpPost.setHeader("Accept-Encoding", "gzip, deflate, result");
        for (Map.Entry<String, String> entry : head.entrySet()) {
            httpPost.setHeader(entry.getKey(), entry.getValue());
        }
        //设置请求体
        httpPost.setEntity(new StringEntity(param, "UTF-8"));
        //发送请求
        CloseableHttpResponse response = null;
        HttpEntity entity = null;
        try {
            response = httpClient.execute(httpPost);
            entity = response.getEntity();
            return entity.toString();
        } catch (IOException e) {
            return "向学校服务器发送请求失败: " + e.getMessage();
        }
    }
}
