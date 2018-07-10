# HERE + Snap Kit

![here-snapkit](here-snapkit.png)

[HERE Developer](http://developer.here.com/) integration with [Snap Kit](https://kit.snapchat.com/portal/). Learn how to send location-aware stickers to the Snapchat camera.

Created by [Dylan Babbs](http://dylanbabbs.com).

### Adding  HERE and Snap Kit keys
In order to successfully build this project, you need to register for HERE Developer and Snap Kit credentials.

In `Info.plist`, replace `YOUR-SNAPKIT-KEY` with your Snap Kit development key, found in the Snap Kit portal.
```
<key>SCSDKClientId</key>
<string>YOUR-SNAPKIT-KEY</string>
```

In `ViewController.swift`, replace `YOUR-HERE-ID` and `YOUR-HERE-CODE` with your app id and app code, found in the HERE Developer Portal.
```
struct here {
    static var id = "YOUR-HERE-ID"
    static var code = "YOUR-HERE-CODE"
}
```
