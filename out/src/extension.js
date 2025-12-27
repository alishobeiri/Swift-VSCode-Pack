"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
// Helper function to ensure .vscode directory exists
const ensureVscodeDirectoryExists = () => {
    var _a;
    const workspaceFolder = (_a = vscode.workspace.workspaceFolders) === null || _a === void 0 ? void 0 : _a[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder is open.');
        return undefined;
    }
    const vscodePath = path.join(workspaceFolder.uri.fsPath, '.vscode');
    if (!fs.existsSync(vscodePath)) {
        fs.mkdirSync(vscodePath, { recursive: true });
    }
    return vscodePath;
};
function cleanJSON(jsonString) {
    return jsonString.replace(/^\uFEFF/, '');
}
function deepMerge(target, source) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}
// Helper function to detect if running in Cursor
function isCursor() {
    return vscode.env.appName.toLowerCase().includes('cursor');
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Congratulations, your extension "swift-development" is now active!');
        const openWelcomeCommand = vscode.commands.registerCommand('swift-development.welcome', () => __awaiter(this, void 0, void 0, function* () {
            // Use the walkthrough API to open the walkthrough
            try {
                yield vscode.commands.executeCommand('workbench.action.openWalkthrough', 'alishobeiri.swift-development#swiftdevelopment-getting-started', false);
            }
            catch (error) {
                // Fallback for Cursor or other VSCode forks that don't support walkthroughs
                const choice = yield vscode.window.showInformationMessage('Welcome to Swift Development for VSCode!\n\nWould you like to run the automated setup?', { modal: true }, 'Auto Setup', 'View Documentation');
                if (choice === 'Auto Setup') {
                    yield vscode.commands.executeCommand('swift-development.runAllSteps');
                }
                else if (choice === 'View Documentation') {
                    vscode.env.openExternal(vscode.Uri.parse('https://github.com/alishobeiri/Swift-Cursor-VSCode-Extension-Pack'));
                }
            }
        }));
        context.subscriptions.push(openWelcomeCommand);
        // Register command for each step in the package.json walkthrough
        context.subscriptions.push(vscode.commands.registerCommand('swift-development.installTools', () => __awaiter(this, void 0, void 0, function* () {
            const scriptPath = path.join(context.extensionPath, 'media', 'install_tools.sh');
            // Confirm the operating system is macOS
            if (process.platform !== 'darwin') {
                vscode.window.showErrorMessage("The installation script is designed to run on macOS only.");
                return;
            }
            // Create a terminal and show it
            const terminal = vscode.window.createTerminal('Swift Development Tools Installation');
            terminal.show();
            // Execute the shell script by sending text to the terminal
            terminal.sendText(`sh "${scriptPath}"`);
            // Optionally, you may want to provide a notification after sending the command
            vscode.window.showInformationMessage('Started Swift development tools installation.');
        })));
        // Register command for generating settings.json
        context.subscriptions.push(vscode.commands.registerCommand('swift-development.generateSettings', () => __awaiter(this, void 0, void 0, function* () {
            const vscodePath = ensureVscodeDirectoryExists();
            if (!vscodePath)
                return;
            const settingsPath = path.join(vscodePath, 'settings.json');
            const newSettings = {
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
            };
            try {
                let currentSettings = {};
                if (fs.existsSync(settingsPath)) {
                    const settingsRaw = fs.readFileSync(settingsPath, 'utf-8');
                    try {
                        currentSettings = JSON.parse(cleanJSON(settingsRaw));
                    }
                    catch (jsonError) {
                        vscode.window.showErrorMessage(`Error parsing existing settings.json: ${jsonError.message}`);
                        return;
                    }
                }
                const updatedSettings = deepMerge(currentSettings, newSettings);
                const vscodeDir = path.dirname(settingsPath);
                if (!fs.existsSync(vscodeDir)) {
                    fs.mkdirSync(vscodeDir);
                }
                fs.writeFileSync(settingsPath, JSON.stringify(updatedSettings, null, 4));
                vscode.window.showInformationMessage(`settings.json has been updated successfully.`);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Error updating settings.json: ${error.message}`);
            }
        })));
        context.subscriptions.push(vscode.commands.registerCommand('swift-development.generateLaunch', () => __awaiter(this, void 0, void 0, function* () {
            const vscodePath = ensureVscodeDirectoryExists();
            if (!vscodePath)
                return;
            const settingsPath = path.join(vscodePath, 'launch.json');
            const newLaunchConfig = {
                "version": "0.2.0",
                "configurations": [
                    {
                        "type": "sweetpad-lldb",
                        "request": "launch",
                        "name": "Build and Launch (SweetPad)",
                        "preLaunchTask": "sweetpad: launch",
                        "stopAll": true
                    },
                    {
                        "type": "sweetpad-lldb",
                        "request": "attach",
                        "name": "Attach to Running App (SweetPad)",
                        "description": "Use this if the app is already running to avoid rebuild"
                    }
                ]
            };
            try {
                let currentLaunchConfig = { version: "0.2.0", configurations: [] };
                if (fs.existsSync(settingsPath)) {
                    const launchConfigRaw = fs.readFileSync(settingsPath, 'utf-8');
                    try {
                        currentLaunchConfig = JSON.parse(cleanJSON(launchConfigRaw));
                    }
                    catch (jsonError) {
                        vscode.window.showErrorMessage(`Error parsing existing launch.json: ${jsonError.message}`);
                        return;
                    }
                }
                const updatedConfigurations = newLaunchConfig.configurations.filter((newConfig) => !currentLaunchConfig.configurations.some((currentConfig) => currentConfig.name === newConfig.name)).concat(currentLaunchConfig.configurations);
                const updatedLaunchConfig = {
                    version: currentLaunchConfig.version || newLaunchConfig.version,
                    configurations: updatedConfigurations
                };
                const vscodeDir = path.dirname(settingsPath);
                if (!fs.existsSync(vscodeDir)) {
                    fs.mkdirSync(vscodeDir);
                }
                fs.writeFileSync(settingsPath, JSON.stringify(updatedLaunchConfig, null, 4));
                vscode.window.showInformationMessage(`launch.json has been updated successfully.`);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Error updating launch.json: ${error.message}`);
            }
        })));
        context.subscriptions.push(vscode.commands.registerCommand('swift-development.generateTasks', () => __awaiter(this, void 0, void 0, function* () {
            const vscodePath = ensureVscodeDirectoryExists();
            if (!vscodePath)
                return;
            const settingsPath = path.join(vscodePath, 'tasks.json');
            const newTaskConfig = {
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
            };
            try {
                let currentTaskConfig = { version: "2.0.0", tasks: [] };
                if (fs.existsSync(settingsPath)) {
                    const taskConfigRaw = fs.readFileSync(settingsPath, 'utf-8');
                    try {
                        currentTaskConfig = JSON.parse(cleanJSON(taskConfigRaw));
                    }
                    catch (jsonError) {
                        vscode.window.showErrorMessage(`Error parsing existing tasks.json: ${jsonError.message}`);
                        return;
                    }
                }
                const updatedTasks = newTaskConfig.tasks.filter((newTask) => !currentTaskConfig.tasks.some((currentTask) => currentTask.label === newTask.label)).concat(currentTaskConfig.tasks);
                const updatedTaskConfig = {
                    version: currentTaskConfig.version || newTaskConfig.version,
                    tasks: updatedTasks
                };
                const vscodeDir = path.dirname(settingsPath);
                if (!fs.existsSync(vscodeDir)) {
                    fs.mkdirSync(vscodeDir);
                }
                fs.writeFileSync(settingsPath, JSON.stringify(updatedTaskConfig, null, 4));
                vscode.window.showInformationMessage(`tasks.json has been updated successfully.`);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Error updating tasks.json: ${error.message}`);
            }
        })));
        // Generate Swift format settings
        context.subscriptions.push(vscode.commands.registerCommand('swift-development.generateFormatterConfig', () => __awaiter(this, void 0, void 0, function* () {
            const vscodePath = ensureVscodeDirectoryExists();
            if (!vscodePath)
                return;
            const swiftFormatSettings = {
                "indentation": {
                    "spaces": 4
                },
                "insertSpaces": true,
                "spacesAroundRangeFormationOperators": false,
                "tabWidth": 8,
                "version": 1
            };
            const settingsPath = path.join(vscodePath, '.swift-format');
            try {
                // Ensure .vscode directory exists
                const vscodeDir = path.dirname(settingsPath);
                if (!fs.existsSync(vscodeDir)) {
                    fs.mkdirSync(vscodeDir);
                }
                // Write swift format settings to .swift-format
                fs.writeFileSync(settingsPath, JSON.stringify(swiftFormatSettings, null, 4));
                vscode.window.showInformationMessage(`.swift-format has been created/updated successfully.`);
            }
            catch (error) {
                vscode.window.showErrorMessage(`Error updating .swift-format: ${error.message}`);
            }
        })));
        // Register command to run sweetpad: launch task
        context.subscriptions.push(vscode.commands.registerCommand('swift-development.runSweetpadLaunch', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const taskName = 'sweetpad: launch';
                const taskExecutions = vscode.tasks.taskExecutions;
                // Find the task execution if it is already running
                for (const execution of taskExecutions) {
                    if (execution.task.name === taskName) {
                        // Terminate the running task
                        execution.terminate();
                        // Optionally, you can show a message that the task was terminated
                        vscode.window.showInformationMessage(`Terminating the existing ${taskName} task.`);
                        // Wait for the task to properly terminate before starting a new one
                        yield new Promise(resolve => setTimeout(resolve, 1000));
                        break;
                    }
                }
                // Fetch all tasks and find the specific task
                const task = (yield vscode.tasks.fetchTasks()).find(t => t.name === taskName);
                if (task) {
                    vscode.tasks.executeTask(task);
                    vscode.window.showInformationMessage(`Running ${taskName} task.`);
                }
                else {
                    vscode.window.showWarningMessage(`Could not find task labeled "${taskName}". Please ensure tasks.json is properly configured.`);
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`Error running sweetpad: launch task: ${error.message}`);
            }
        })));
        // Register command to run sweetpad: launch task
        context.subscriptions.push(vscode.commands.registerCommand('swift-development.runSweetpadBuild', () => __awaiter(this, void 0, void 0, function* () {
            try {
                const task = (yield vscode.tasks.fetchTasks()).find(t => t.name === 'sweetpad: build');
                if (task) {
                    vscode.tasks.executeTask(task);
                    vscode.window.showInformationMessage('Running sweetpad: launch task.');
                }
                else {
                    vscode.window.showWarningMessage('Could not find task labeled "sweetpad: launch". Please ensure tasks.json is properly configured.');
                }
            }
            catch (error) {
                vscode.window.showErrorMessage(`Error running sweetpad: launch task: ${error.message}`);
            }
        })));
        // Recursive function to check for xcodeproj files in a directory and its subdirectories
        function containsXcodeproj(dir) {
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                // Check if it's a directory
                if (fs.statSync(fullPath).isDirectory()) {
                    // Check if the directory name ends with '.xcodeproj'
                    if (file.endsWith('.xcodeproj')) {
                        return true;
                    }
                    // Recursive call to check inside subdirectories
                    if (containsXcodeproj(fullPath)) {
                        return true;
                    }
                }
            }
            return false;
        }
        const runAllStepsCommand = vscode.commands.registerCommand('swift-development.runAllSteps', () => __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('swift-development.installTools');
            yield vscode.commands.executeCommand('swift-development.generateSettings');
            yield vscode.commands.executeCommand('swift-development.generateFormatterConfig');
            yield vscode.commands.executeCommand('swift-development.generateTasks');
            yield vscode.commands.executeCommand('swift-development.generateLaunch');
            try {
                yield vscode.commands.executeCommand('sweetpad.build.generateBuildServerConfig');
            }
            catch (error) {
                console.log('SweetPad build server config command not available - SweetPad may not be installed yet');
            }
            try {
                yield vscode.commands.executeCommand('swift-development.runSweetpadLaunch');
            }
            catch (error) {
                vscode.window.showWarningMessage('Initial launch skipped. You can manually build and run using Cmd+R');
            }
        }));
        context.subscriptions.push(runAllStepsCommand);
        // Command to reset the Xcode project popup state
        const resetXcodePopupCommand = vscode.commands.registerCommand('swift-development.resetXcodePopup', () => __awaiter(this, void 0, void 0, function* () {
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (!workspaceFolders) {
                vscode.window.showWarningMessage('No workspace folder is open.');
                return;
            }
            const hasOpenedXcodeprojKeyPrefix = 'hasOpenedXcodeproj_';
            let clearedCount = 0;
            for (const folder of workspaceFolders) {
                const rootPath = folder.uri.fsPath;
                const hasOpenedXcodeprojKey = `${hasOpenedXcodeprojKeyPrefix}${rootPath}`;
                yield context.globalState.update(hasOpenedXcodeprojKey, undefined);
                clearedCount++;
            }
            vscode.window.showInformationMessage(`Reset Xcode popup state for ${clearedCount} workspace folder(s). Reload the window to see the popup again.`);
        }));
        context.subscriptions.push(resetXcodePopupCommand);
        const firstTimeKey = 'isFirstActivation';
        const hasOpenedXcodeprojKeyPrefix = 'hasOpenedXcodeproj_';
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (workspaceFolders) {
            for (const folder of workspaceFolders) {
                const rootPath = folder.uri.fsPath;
                const hasOpenedXcodeprojKey = `${hasOpenedXcodeprojKeyPrefix}${rootPath}`;
                if (!context.globalState.get(hasOpenedXcodeprojKey) && fs.existsSync(rootPath)) {
                    if (containsXcodeproj(rootPath)) {
                        // Build button options based on IDE
                        const buttons = ['Auto Setup (Recommended)'];
                        if (!isCursor()) {
                            buttons.push('Open Walkthrough');
                        }
                        buttons.push('Not Now');
                        const choice = yield vscode.window.showInformationMessage('This appears to be your first time opening an Xcode project in this workspace.\n\nWould you like to set up Swift Development?', { modal: true }, ...buttons);
                        if (choice === 'Auto Setup (Recommended)') {
                            yield vscode.commands.executeCommand('swift-development.runAllSteps');
                        }
                        else if (choice === 'Open Walkthrough') {
                            yield vscode.commands.executeCommand('swift-development.welcome');
                        }
                        context.globalState.update(hasOpenedXcodeprojKey, true);
                    }
                }
            }
        }
        if (context.globalState.get(firstTimeKey) === undefined) {
            context.globalState.update(firstTimeKey, false);
            yield vscode.commands.executeCommand('swift-development.welcome');
        }
    });
}
