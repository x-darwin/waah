import { Observable } from '@nativescript/core';
import { android as androidApp } from '@nativescript/core/application';

export class MainViewModel extends Observable {
    private _rtmpUrl: string;
    private _status: string;
    private virtualCameraService: any;

    constructor() {
        super();
        this._rtmpUrl = "";
        this._status = "Ready to start";
    }

    get rtmpUrl(): string {
        return this._rtmpUrl;
    }

    set rtmpUrl(value: string) {
        if (this._rtmpUrl !== value) {
            this._rtmpUrl = value;
            this.notifyPropertyChange('rtmpUrl', value);
        }
    }

    get status(): string {
        return this._status;
    }

    set status(value: string) {
        if (this._status !== value) {
            this._status = value;
            this.notifyPropertyChange('status', value);
        }
    }

    startVirtualCamera() {
        if (!this._rtmpUrl) {
            this.status = "Please enter RTMP URL";
            return;
        }

        const context = androidApp.context;
        const Intent = android.content.Intent;
        const MediaProjectionManager = android.media.projection.MediaProjectionManager;

        const mediaProjectionManager = context.getSystemService(
            android.content.Context.MEDIA_PROJECTION_SERVICE
        );

        const intent = mediaProjectionManager.createScreenCaptureIntent();
        androidApp.foregroundActivity.startActivityForResult(intent, 1000);

        this.status = "Virtual camera starting...";
    }
}