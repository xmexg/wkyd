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