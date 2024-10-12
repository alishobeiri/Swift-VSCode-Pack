```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "sweetpad",
            "action": "build",
            "problemMatcher": [
                "$sweetpad-watch",
                "$sweetpad-xcodebuild-default",
                "$sweetpad-xcbeautify-errors",
                "$sweetpad-xcbeautify-warnings"
            ],
            "label": "sweetpad: build",
            "detail": "Build the app",
            "isBackground": true,
            "presentation": {
                "reveal": "silent",
                "panel": "dedicated",
                "showReuseMessage": false,
                "clear": true
            }
        },
        {
            "type": "sweetpad",
            "action": "launch",
            "problemMatcher": [
                "$sweetpad-watch",
                "$sweetpad-xcodebuild-default",
                "$sweetpad-xcbeautify-errors",
                "$sweetpad-xcbeautify-warnings"
            ],
            "label": "sweetpad: launch",
            "detail": "Build and Launch the app",
            "presentation": {
                "reveal": "always",
                "panel": "dedicated",
                "showReuseMessage": true,
                "clear": false
            }
        },
        {
            "type": "sweetpad",
            "action": "clean",
            "problemMatcher": [
                "$sweetpad-watch",
                "$sweetpad-xcodebuild-default",
                "$sweetpad-xcbeautify-errors",
                "$sweetpad-xcbeautify-warnings"
            ],
            "label": "sweetpad: clean",
            "detail": "Clean the app",
            "presentation": {
                "reveal": "always",
                "panel": "dedicated",
                "showReuseMessage": true,
                "clear": false
            }
        }
    ]
}
```