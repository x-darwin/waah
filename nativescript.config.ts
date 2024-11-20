import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'com.rtmpvirtualcamera.app',
  appPath: 'app',
  appResourcesPath: 'App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none',
    maxLogcatObjectSize: 2048,
    codeCache: true,
    discardUncaughtJsExceptions: true,
    enableMultithreadedJavascript: true
  }
} as NativeScriptConfig;