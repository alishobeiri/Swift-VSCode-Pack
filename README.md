## Setup Instructions

To get started developing Swift in VSCode, we need to configure [SweetPad](https://marketplace.visualstudio.com/items?itemName=sweetpad.sweetpad), [Trigger tasks on Save](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.triggertaskonsave), [SourceKit-LSP](https://marketplace.visualstudio.com/items?itemName=pvasek.sourcekit-lsp--dev-unofficial) and [CodeLLDB](https://marketplace.visualstudio.com/items?itemName=vadimcn.vscode-lldb). 

You can either install the extension pack and follow along with the walkthrough setup (Cmd + Shift + P) > (Help: Welcome) or follow along by using the following instructions:

### 1. Add the following to `settings.json`

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

### 2. Add the following to `launch.json`
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

### 3. Add the following to `tasks.json`
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

### 4. Generate Build Server Config for Autocompletion
Press `Cmd + P` and run:
```
SweetPad: Create Build Server Config
```

### 5. Install all necessary tools
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

If all has gone well, you should be ready to develop Swift in VSCode!