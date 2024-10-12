import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Helper function to ensure .vscode directory exists
const ensureVscodeDirectoryExists = () => {
    const vscodePath = path.join(vscode.workspace.rootPath || '', '.vscode');
    if (!fs.existsSync(vscodePath)) {
        fs.mkdirSync(vscodePath);
    }
};

function cleanJSON(jsonString: string): string {
    return jsonString.replace(/^\uFEFF/, '');
}

function deepMerge(target: any, source: any) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target) {
            Object.assign(source[key], deepMerge(target[key], source[key]));
        }
    }
    Object.assign(target || {}, source);
    return target;
}

export async function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "swift-development" is now active!');

    const openWelcomeCommand = vscode.commands.registerCommand('swift-development.welcome', () => {
        // Use the walkthrough API to open the walkthrough if you're using walkthroughs
        vscode.commands.executeCommand('workbench.action.openWalkthrough', 'alishobeiri.swift-development#swiftdevelopment-getting-started');
    });
    
    context.subscriptions.push(openWelcomeCommand);

    // Register command for each step in the package.json walkthrough
    context.subscriptions.push(vscode.commands.registerCommand('swift-development.installTools', async () => {
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
    }));


    // Register command for generating settings.json
    context.subscriptions.push(vscode.commands.registerCommand('swift-development.generateSettings', async () => {
        ensureVscodeDirectoryExists();
        const settingsPath = path.join(vscode.workspace.rootPath || '', '.vscode', 'settings.json');

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
                } catch (jsonError) {
                    vscode.window.showErrorMessage(`Error parsing existing settings.json: ${(jsonError as any).message}`);
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
        } catch (error) {
            vscode.window.showErrorMessage(`Error updating settings.json: ${(error as any).message}`);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('swift-development.generateLaunch', async () => {
        ensureVscodeDirectoryExists();
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
                } catch (jsonError) {
                    vscode.window.showErrorMessage(`Error parsing existing launch.json: ${(jsonError as any).message}`);
                    return;
                }
            }

            const updatedConfigurations = newLaunchConfig.configurations.filter(
                (newConfig) => !currentLaunchConfig.configurations.some((currentConfig) => (currentConfig as any).name === newConfig.name)
            ).concat(currentLaunchConfig.configurations);

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
        } catch (error) {
            vscode.window.showErrorMessage(`Error updating launch.json: ${(error as any).message}`);
        }
    }));

    context.subscriptions.push(vscode.commands.registerCommand('swift-development.generateTasks', async () => {
        ensureVscodeDirectoryExists();
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
                } catch (jsonError) {
                    vscode.window.showErrorMessage(`Error parsing existing tasks.json: ${(jsonError as any).message}`);
                    return;
                }
            }

            const updatedTasks = newTaskConfig.tasks.filter(
                (newTask) => !currentTaskConfig.tasks.some((currentTask) => (currentTask as any).label === newTask.label)
            ).concat(currentTaskConfig.tasks);

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
        } catch (error) {
            vscode.window.showErrorMessage(`Error updating tasks.json: ${(error as any).message}`);
        }
    }));

    // Generate Swift format settings
    context.subscriptions.push(vscode.commands.registerCommand('swift-development.generateFormatterConfig', async () => {
        ensureVscodeDirectoryExists();
        const swiftFormatSettings = {
            "indentation": {
                "spaces": 4
            },
            "insertSpaces": true,
            "spacesAroundRangeFormationOperators": false,
            "tabWidth": 8,
            "version": 1
        };
    
        const settingsPath = path.join(vscode.workspace.rootPath || '', '.vscode', '.swift-format');
    
        try {
            // Ensure .vscode directory exists
            const vscodeDir = path.dirname(settingsPath);
            if (!fs.existsSync(vscodeDir)) {
                fs.mkdirSync(vscodeDir);
            }
    
            // Write swift format settings to .swift-format
            fs.writeFileSync(settingsPath, JSON.stringify(swiftFormatSettings, null, 4));
            vscode.window.showInformationMessage(`.swift-format has been created/updated successfully.`);
        } catch (error) {
            vscode.window.showErrorMessage(`Error updating .swift-format: ${(error as any).message}`);
        }
    }));

    // Register command to run sweetpad: launch task
    context.subscriptions.push(vscode.commands.registerCommand('swift-development.runSweetpadLaunch', async () => {
        try {
            const task = (await vscode.tasks.fetchTasks()).find(t => t.name === 'sweetpad: launch');
            if (task) {
                vscode.tasks.executeTask(task);
                vscode.window.showInformationMessage('Running sweetpad: launch task.');
            } else {
                vscode.window.showWarningMessage('Could not find task labeled "sweetpad: launch". Please ensure tasks.json is properly configured.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error running sweetpad: launch task: ${(error as any).message}`);
        }
    }));

    // Register command to run sweetpad: launch task
    context.subscriptions.push(vscode.commands.registerCommand('swift-development.runSweetpadBuild', async () => {
        try {
            const task = (await vscode.tasks.fetchTasks()).find(t => t.name === 'sweetpad: build');
            if (task) {
                vscode.tasks.executeTask(task);
                vscode.window.showInformationMessage('Running sweetpad: launch task.');
            } else {
                vscode.window.showWarningMessage('Could not find task labeled "sweetpad: launch". Please ensure tasks.json is properly configured.');
            }
        } catch (error) {
            vscode.window.showErrorMessage(`Error running sweetpad: launch task: ${(error as any).message}`);
        }
    }));

    context.globalState.update('isFirstActivation', undefined);
    if (context.globalState.get('isFirstActivation') === undefined) {
        context.globalState.update('isFirstActivation', false);
        await vscode.commands.executeCommand('workbench.action.openWalkthrough', 'alishobeiri.swift-development#swiftdevelopment-getting-started');
    }    
}

