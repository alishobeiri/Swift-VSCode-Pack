# Change Log

All notable changes to the "swiftdevelopment" extension pack will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.34] - 2025-12-27

### Fixed
- Fixed walkthrough opening functionality to work correctly with VSCode's `workbench.action.openWalkthrough` command
- Added Cursor IDE detection to conditionally hide "Open Walkthrough" button in setup popup (Cursor doesn't support walkthrough API)
- Implemented graceful fallback for walkthrough command with Auto Setup and Documentation options when walkthrough is unavailable

### Changed
- Improved IDE compatibility by detecting Cursor vs VSCode and adapting UI accordingly
- Enhanced setup popup to only show supported options based on the IDE being used

## [0.0.32] - 2025-12-27

### Added
- Two debug configurations in launch.json for better workflow flexibility:
  - "Build and Launch (SweetPad)" - Primary configuration that builds and launches the app
  - "Attach to Running App (SweetPad)" - Attaches debugger to already running app without rebuilding
- `stopAll: true` flag on primary debug configuration to automatically stop previous debug sessions
- Enhanced setup popup with three options: "Auto Setup (Recommended)", "Open Walkthrough", and "Not Now"
- Comprehensive Prerequisites section in README documenting Xcode SDK and Command Line Tools requirements
- Detailed "Debugging Configurations" section in README explaining when to use each configuration

### Changed
- Improved first-time setup popup to prioritize "Auto Setup" as the recommended default option
- Enhanced Quick Start guide to clearly explain automatic popup behavior when opening Xcode projects
- Updated walkthrough descriptions to explain both debug configurations
- Reorganized README with clearer Prerequisites section before tool installation steps

### Fixed
- Resolved issue where debugger would hang if simulator was already running during "Build and Launch"
- Improved user guidance for handling already-running simulators

### Documentation
- Added verification commands for checking Xcode and Swift installation
- Added troubleshooting tip for simulator hang scenarios
- Enhanced Usage section with debugging configuration explanations
- Updated all configuration examples to include both debug options

## [0.0.31] - 2025-12-27

### Changed
- Replaced deprecated `sswg.swift-lang` extension with official `swiftlang.swift-vscode` extension
- This fixes language server compatibility issues and ensures users get the latest Swift extension features

## [Unreleased]

- Initial release
