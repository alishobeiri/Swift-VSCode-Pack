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
            "detail": "Build the app"
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
            "detail": "Build and Launch the app"
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
            "detail": "Clean the app"
        }
    ]
}
```