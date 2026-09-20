# Add project specific ProGuard rules here.

# React Native Core & TurboModules / JNI
-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.hermes.** { *; }

# React Native Nitro Modules
-keep class com.margelo.nitro.** { *; }

# React Native Reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.core.CallInvokerHolderImpl { *; }

# React Native Gesture Handler
-keep class com.swmansion.gesturehandler.** { *; }

# React Native Screens
-keep class com.swmansion.rnscreens.** { *; }

# React Native MMKV
-keep class com.reactnativemmkv.** { *; }
-keep class com.tencent.mmkv.** { *; }

# React Native Quick SQLite
-keep class com.reactnativequicksqlite.** { *; }

# React Native View Shot
-keep class com.greententacle.reactnativeviewshot.** { *; }

# Notifee
-keep class app.notifee.core.** { *; }
-keep class io.invertase.notifee.** { *; }

# Vector Icons
-keep class com.oblador.vectoricons.** { *; }

# Lottie
-keep class com.airbnb.lottie.** { *; }

# SVG
-keep class com.horcrux.svg.** { *; }

# In-App Updates (Google Play Core)
-keep class com.sudoplz.rninappupdate.** { *; }
-keep class com.google.android.play.core.** { *; }

# Device Info & Share
-keep class com.learnium.RNDeviceInfo.** { *; }
-keep class cl.json.** { *; }
