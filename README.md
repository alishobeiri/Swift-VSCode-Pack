# Swift Development - Swift & iOS Development in VSCode and Cursor

Extension pack for developing Swift and iOS apps in VSCode or Cursor. Includes syntax highlighting, autocompletion, build integration, debugging, and simulator support.

Provides syntax highlighting, autocompletion, build errors, linting, formatting, debugging, and simulator support for Swift development in VSCode or Cursor. Swift development in VSCode was previously limited, requiring Xcode for building and debugging. This extension pack brings build, debug, and run capabilities into VSCode or Cursor. Xcode is still required for build tools and simulator, but you can develop without switching applications.

## Features

This extension pack bundles and configures the essential tools for Swift development in VSCode or Cursor. It includes language server support, build system integration, debugging capabilities, and code formatting. All development tasks—writing, building, debugging, and running—can be done from one place without switching between Xcode and your editor.

- **Interactive Setup**: Walkthrough configures your project. Open an Xcode project and follow the guided setup.
- **Autocompletion**: Swift language support via SourceKit-LSP with context-aware suggestions and type information.
- **Auto-Build on Save**: Compilation errors appear as you code. Your project builds when you save a Swift file.
- **Code Formatting**: Swift code formatting on save with customizable rules. Maintains consistent code style.
- **Debugging**: Debugger support with CodeLLDB. Set breakpoints, inspect variables, and debug iOS apps in VSCode.
- **Simulator Support**: Build and run iOS apps in the simulator from the editor. Launch and test with a single command.
- **Integrated Workflow**: Write, build, debug, and run from one place without switching between tools.

## What's Included

This extension pack bundles four essential extensions, pre-configured to work together:

- **SweetPad** - Swift language server and build system integration
- **Swift Language Support** - Official Swift syntax highlighting and language features
- **CodeLLDB** - Native debugging support for Swift and C/C++
- **Trigger Task on Save** - Builds your project when you save files

## Quick Start

Getting started is simple - just open an Xcode project and follow the setup prompt:

1. **Install this extension pack** from the VSCode marketplace
2. **Open an Xcode project** (any folder containing a `.xcodeproj` file)
3. **A popup will automatically appear** asking how you'd like to set up Swift Development:
   - **Auto Setup (Recommended)** - Automatically installs tools and configures your project
   - **Open Walkthrough** - Step-by-step guided setup with explanations
   - **Not Now** - Skip setup for now
4. **That's it!** Your environment is configured and ready to use

The popup appears automatically the first time you open an Xcode project. If you want to access the walkthrough later, press `Cmd+Shift+P` (`Ctrl+Shift+P` on Windows/Linux) and select "Help: Welcome", then choose "Swift Development for VSCode".

## Detailed Setup Instructions

For advanced users who prefer manual configuration, or if you want to understand what's being set up, follow these detailed instructions.

### Prerequisites

Before you begin, ensure you have:

- **Xcode** installed from the Mac App Store (required for Swift compiler, iOS SDK, and build tools)
- **Xcode Command Line Tools** installed - run: `xcode-select --install`

To verify your installation:
```bash
# Check Xcode installation
xcode-select -p

# Check Swift is available
swift --version
```

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
      "name": "Build and Launch (SweetPad)",
      "preLaunchTask": "sweetpad: launch"
    },
    {
      "type": "sweetpad-lldb",
      "request": "attach",
      "name": "Attach to Running App (SweetPad)",
      "description": "Use this if the app is already running to avoid rebuild"
    }
  ]
}
```

**Note:** If your simulator is already running, use the "Attach to Running App" configuration to avoid hanging on the build task.

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

Press `Cmd + Shift + P` and run:
```
SweetPad: Create Build Server Config
```

If all has gone well, you should be ready to develop Swift in VSCode!

## Key Features

- **Syntax Highlighting and Autocompletion**: Full Swift language support with intelligent code completion
- **Build Error Detection**: Real-time compilation error reporting as you type
- **Debugging Capabilities**: Full debugger with breakpoints, variable inspection, and call stack
- **Code Formatting and Linting**: Formatting on save with SwiftLint integration
- **Simulator Integration**: Build and run iOS apps directly from the editor

## Usage

### Key Bindings

- `Cmd+R` (Mac) / `Ctrl+R` (Windows/Linux) - Build and launch your app
- `Cmd+Ctrl+B` (Mac) / `Ctrl+Alt+B` (Windows/Linux) - Build your project

### Debugging Configurations

This extension provides two debug configurations:

1. **Build and Launch (SweetPad)** - Use this for a fresh start. Builds your project and launches it in the simulator.
2. **Attach to Running App (SweetPad)** - Use this when your app is already running in the simulator. This avoids rebuilding and attaches the debugger directly.

**Tip:** If the debugger hangs while waiting for the preLaunchTask, your simulator may already be running. Press `Stop` and use the "Attach to Running App" configuration instead.

### Common Workflows

- Opening an Xcode project triggers setup
- Saving a Swift file builds the project
- Use the debugger to set breakpoints and inspect variables
- Format code on save
- Switch between debug configurations based on whether simulator is running

## Requirements

- macOS (required for iOS development and Xcode tools)
- Visual Studio Code 1.34.0 or later, or Cursor
- **Xcode** (download from Mac App Store - provides Swift compiler, iOS SDK, and build tools)
- **Xcode Command Line Tools** (install with: `xcode-select --install`)
- Homebrew (for installing development tools)

## Support & Contributing

- Report issues on GitHub: https://github.com/alishobeiri/Swift-VSCode-Pack
- Contribute improvements via pull requests
- Check existing issues before creating new ones
