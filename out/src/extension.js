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
function activate(context) {
    console.log('Congratulations, your extension "swift-development" is now active!');
    const openWelcomeCommand = vscode.commands.registerCommand('swift-development.welcome', () => {
        // Use the walkthrough API to open the walkthrough if you're using walkthroughs
        vscode.commands.executeCommand('workbench.action.openWalkthrough', 'alishobeiri.swift-development#swiftdevelopment-getting-started');
    });
    context.subscriptions.push(openWelcomeCommand);
    // Register command for generating settings.json
    context.subscriptions.push(vscode.commands.registerCommand('swift-development.generateSettings', () => __awaiter(this, void 0, void 0, function* () {
        const settingsPath = path.join(vscode.workspace.rootPath || '', '.vscode', 'settings.json');
        const newSettings = {
            "triggerTaskOnSave.runonsave": {
                "sweetpad: build": ["**/*.swift"]
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
        const settingsPath = path.join(vscode.workspace.rootPath || '', '.vscode', 'launch.json');
        const newLaunchConfig = {
            "version": "0.2.0",
            "configurations": [
                {
                    "type": "sweetpad-lldb",
                    "request": "launch",
                    "name": "Attach to running app (SweetPad)",
                    "preLaunchTask": "sweetpad: launch"
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
        const settingsPath = path.join(vscode.workspace.rootPath || '', '.vscode', 'tasks.json');
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
    // Register command to run sweetpad: launch task
    context.subscriptions.push(vscode.commands.registerCommand('swift-development.runSweetpadLaunch', () => __awaiter(this, void 0, void 0, function* () {
        try {
            const task = (yield vscode.tasks.fetchTasks()).find(t => t.name === 'sweetpad: launch');
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
}
