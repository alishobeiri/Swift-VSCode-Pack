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
    "[swift]": {
        "editor.defaultFormatter": "sweetpad.sweetpad",
        "editor.formatOnSave": true,
        "editor.tabSize": 4,
        "editor.insertSpaces": true,
        "sweetpad.format.args": [
            "--quiet",
            "--line-length",
            "100",
            "--indentation",
            "spaces",
            "4",
            "${file}"
        ]
    }   
}
```