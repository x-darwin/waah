import { android as androidApp } from '@nativescript/core/application';

@JavaProxy('com.rtmpvirtualcamera.VirtualCameraService')
export class VirtualCameraService extends android.app.Service {
    private mediaProjection: android.media.projection.MediaProjection;
    private virtualDisplay: android.hardware.display.VirtualDisplay;
    private mediaRecorder: android.media.MediaRecorder;
    private rtmpUrl: string;

    onCreate() {
        super.onCreate();
    }

    onStartCommand(intent: android.content.Intent, flags: number, startId: number): number {
        this.rtmpUrl = intent.getStringExtra("rtmpUrl");
        const resultCode = intent.getIntExtra("resultCode", 0);
        const data = intent.getParcelableExtra("data");

        const mediaProjectionManager = this.getSystemService(
            android.content.Context.MEDIA_PROJECTION_SERVICE
        );

        this.mediaProjection = mediaProjectionManager.getMediaProjection(resultCode, data);
        this.setupVirtualDisplay();

        return android.app.Service.START_STICKY;
    }

    private setupVirtualDisplay() {
        const metrics = new android.util.DisplayMetrics();
        androidApp.foregroundActivity.getWindowManager().getDefaultDisplay().getMetrics(metrics);

        const screenWidth = metrics.widthPixels;
        const screenHeight = metrics.heightPixels;
        const screenDensity = metrics.densityDpi;

        this.mediaRecorder = new android.media.MediaRecorder();
        this.mediaRecorder.setVideoSource(android.media.MediaRecorder.VideoSource.SURFACE);
        this.mediaRecorder.setOutputFormat(android.media.MediaRecorder.OutputFormat.MPEG_4);
        this.mediaRecorder.setVideoEncoder(android.media.MediaRecorder.VideoEncoder.H264);
        this.mediaRecorder.setVideoSize(screenWidth, screenHeight);
        this.mediaRecorder.setVideoFrameRate(30);
        this.mediaRecorder.setOutputFile(this.rtmpUrl);
        
        try {
            this.mediaRecorder.prepare();
        } catch (error) {
            console.error("Failed to prepare MediaRecorder:", error);
            return;
        }

        this.virtualDisplay = this.mediaProjection.createVirtualDisplay(
            "VirtualCamera",
            screenWidth,
            screenHeight,
            screenDensity,
            android.hardware.display.DisplayManager.VIRTUAL_DISPLAY_FLAG_AUTO_MIRROR,
            this.mediaRecorder.getSurface(),
            null,
            null
        );

        this.mediaRecorder.start();
    }

    onDestroy() {
        if (this.virtualDisplay != null) {
            this.virtualDisplay.release();
            this.virtualDisplay = null;
        }
        if (this.mediaRecorder != null) {
            this.mediaRecorder.release();
            this.mediaRecorder = null;
        }
        if (this.mediaProjection != null) {
            this.mediaProjection.stop();
            this.mediaProjection = null;
        }
        super.onDestroy();
    }

    onBind(intent: android.content.Intent): android.os.IBinder {
        return null;
    }
}