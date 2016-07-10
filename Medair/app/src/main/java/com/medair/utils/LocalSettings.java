package com.medair.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

/**
 * Created by patel on 7/10/2016.
 */
public class LocalSettings {

    private static final String USER_ID = "user_id";

    public static void setUserID(final Context context, final String key) {
        SharedPreferences preferences = getSharedPref(context);
        preferences.edit().putString(USER_ID, key).commit();
    }

    public static String getUserID(final Context context) {
        return getSharedPref(context).getString(USER_ID, "");
    }

    private static SharedPreferences getSharedPref(final Context context) {
        return PreferenceManager.getDefaultSharedPreferences(context);
    }

}
