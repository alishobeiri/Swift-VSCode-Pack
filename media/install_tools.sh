#!/bin/sh

# Function to check if Homebrew is installed
check_homebrew_installed() {
    if ! command -v brew &> /dev/null
    then
        echo "Homebrew is not installed. Installing Homebrew..."
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    else
        echo "Homebrew is already installed."
    fi
}

# Check and install Homebrew if not already installed
check_homebrew_installed

# Install swift-format
echo "Installing swift-format..."
brew install swift-format

# Install XcodeGen
echo "Installing XcodeGen..."
brew install xcodegen

# Install SwiftLint
echo "Installing SwiftLint..."
brew install swiftlint

# Install xcbeautify
echo "Installing xcbeautify..."
brew install xcbeautify

# Install xcode-build-server
echo "Installing xcode-build-server..."
brew install xcode-build-server

# Install ios-deploy
echo "Installing ios-deploy..."
brew install ios-deploy

# Install tuist
echo "Installing tuist..."
brew install --cask tuist

echo "Installation of all tools is complete!"