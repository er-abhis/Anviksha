# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.core.CallInvokerHolderImpl { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native MMKV
-keep class com.reactnativemmkv.** { *; }

# React Native Quick SQLite
-keep class com.reactnativequicksqlite.** { *; }

# React Native View Shot
-keep class com.greententacle.reactnativeviewshot.** { *; }

# Notifee
-keep class com.iogov.notifee.** { *; }
