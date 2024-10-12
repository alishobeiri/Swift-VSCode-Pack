```json
{
    "triggerTaskOnSave.tasks": {
        "sweetpad: build": [
            "**/*.swift"
        ]
    },
    "triggerTaskOnSave.on": true,
    "triggerTaskOnSave.showNotifications": false,
    "triggerTaskOnSave.restart": true,
    "triggerTaskOnSave.delay": 1000,
    "triggerTaskOnSave.resultIndicatorResetTimeout": 5,
    "workbench.colorCustomizations": {},
    "sweetpad.format.args": [
        "--in-place",
        "--configuration",
        ".vscode/.swift-format",
        "${file}"
    ],
    "[swift]": {
        "editor.defaultFormatter": "sweetpad.sweetpad",
        "editor.formatOnSave": true,
    }
}
```