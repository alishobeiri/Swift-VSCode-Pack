# swiftdevelopment README

## Setup Instructions

To get started with SweetPad, please add the following configurations to your Visual Studio Code settings.

### Add to `settings.json`

```json
{
  "triggerTaskOnSave.runonsave": {
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
      "--line-length", "100",
      "--indentation", "spaces", "4",
      "${file}"
    ]
  }
}
```

### Add to `launch.json`
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

### Add to `tasks.json`
```
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

### Running the Config
Finally press `Cmd + P` and run:
```
SweetPad: Create Build Server Config
```

### Additional Setup Instructions
To ensure that you have all the necessary tools installed for working with SweetPad, please run the following commands to install the required software using Homebrew:

```
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install the following tools:
```
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