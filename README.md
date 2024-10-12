## Setup Instructions

To get started developing Swift in VSCode, we need to configure [SweetPad](https://marketplace.visualstudio.com/items?itemName=sweetpad.sweetpad), [Trigger tasks on Save](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.triggertaskonsave), [Swift](https://marketplace.visualstudio.com/items?itemName=sswg.swift-lang) and [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb). 

You can either install the extension pack and follow along with the walkthrough setup (Cmd + Shift + P) > (Help: Welcome) or follow along by using the following instructions:

### 1. Install all necessary tools
To ensure that you have all the necessary tools installed for working with SweetPad, please run the following commands to install the required software using Homebrew:

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install the following tools:
```bash
# Install swift-format
brew install swift-format

# Install XcodeGen
brew install xcodegen

# Install SwiftLint
brew install swiftlint

# Install xcbeautify
brew install xcbeautify

# Install xcode-build-server
brew install xcode-build-server

# Install ios-deploy
brew install ios-deploy

# Install tuist
brew install --cask tuist
```

### 2. Create a `.vscode` folder

### 3. Add the following to `.vscode/settings.json`
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

### 4. Add the following to `.vscode/.swift-format`
```json
{
    "indentation" : {
      "spaces" : 4
    },
    "insertSpaces" : true,
    "spacesAroundRangeFormationOperators" : false,
    "tabWidth" : 8,
    "version" : 1
}
```

### 5. Add the following to `.vscode/launch.json`
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "sweetpad-lldb",
      "request": "launch",
      "name": "Attach to running app (SweetPad)",
      "preLaunchTask": "sweetpad: launch"
    }
  ]
}
```

### 6. Add the following to `.vscode/tasks.json`
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

### 7. Generate Build Server Config for Autocompletion
Press `Cmd + P` and run:
```
SweetPad: Create Build Server Config
```

If all has gone well, you should be ready to develop Swift in VSCode!