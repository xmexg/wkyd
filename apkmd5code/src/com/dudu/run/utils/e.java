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