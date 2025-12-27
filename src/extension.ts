import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Helper function to ensure .vscode directory exists
const ensureVscodeDirectoryExists = (): string | undefined => {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
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
        const vscodePath = ensureVscodeDirectoryExists();
        if (!vscodePath) return;
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
        const vscodePath = ensureVscodeDirectoryExists();
        if (!vscodePath) return;
        const settingsPath = path.join(vscodePath, 'launch.json');

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
        const vscodePath = ensureVscodeDirectoryExists();
        if (!vscodePath) return;
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
        const vscodePath = ensureVscodeDirectoryExists();
        if (!vscodePath) return;
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
        } catch (error) {
            vscode.window.showErrorMessage(`Error updating .swift-format: ${(error as any).message}`);
        }
    }));

    // Register command to run sweetpad: launch task
    context.subscriptions.push(vscode.commands.registerCommand('swift-development.runSweetpadLaunch', async () => {
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
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    break;
                }
            }

            // Fetch all tasks and find the specific task
            const task = (await vscode.tasks.fetchTasks()).find(t => t.name === taskName);

            if (task) {
                vscode.tasks.executeTask(task);
                vscode.window.showInformationMessage(`Running ${taskName} task.`);
            } else {
                vscode.window.showWarningMessage(`Could not find task labeled "${taskName}". Please ensure tasks.json is properly configured.`);
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

    // Recursive function to check for xcodeproj files in a directory and its subdirectories
    function containsXcodeproj(dir: string): boolean {
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

    const runAllStepsCommand = vscode.commands.registerCommand('swift-development.runAllSteps', async () => {
        await vscode.commands.executeCommand('swift-development.installTools');
        await vscode.commands.executeCommand('swift-development.generateSettings');
        await vscode.commands.executeCommand('swift-development.generateFormatterConfig');
        await vscode.commands.executeCommand('swift-development.generateTasks');
        await vscode.commands.executeCommand('swift-development.generateLaunch');

        try {
            await vscode.commands.executeCommand('sweetpad.build.generateBuildServerConfig');
        } catch (error) {
            console.log('SweetPad build server config command not available - SweetPad may not be installed yet');
        }

        try {
            await vscode.commands.executeCommand('swift-development.runSweetpadLaunch');
        } catch (error) {
            vscode.window.showWarningMessage('Initial launch skipped. You can manually build and run using Cmd+R');
        }
    });
    context.subscriptions.push(runAllStepsCommand);

    const firstTimeKey = 'isFirstActivation';
    const hasOpenedXcodeprojKeyPrefix = 'hasOpenedXcodeproj_';
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders) {
        for (const folder of workspaceFolders) {
            const rootPath = folder.uri.fsPath;
            const hasOpenedXcodeprojKey = `${hasOpenedXcodeprojKeyPrefix}${rootPath}`;
            if (!context.globalState.get(hasOpenedXcodeprojKey) && fs.existsSync(rootPath)) {
                if (containsXcodeproj(rootPath)) {
                    const runAllSteps = await vscode.window.showInformationMessage(
                        'This appears to be your first time opening an Xcode project file in this workspace.\n\nWould you like to prepare the Swift Development environment?',
                        { modal: true },
                        'Yes',
                        'No'
                    );
                    if (runAllSteps === 'Yes') {
                        await vscode.commands.executeCommand('swift-development.runAllSteps');
                    }
                    context.globalState.update(hasOpenedXcodeprojKey, true);
                }
            }
        }
    }

    if (context.globalState.get(firstTimeKey) === undefined) {
        context.globalState.update(firstTimeKey, false);
        await vscode.commands.executeCommand('workbench.action.openWalkthrough', 'alishobeiri.swift-development#swiftdevelopment-getting-started');
    }    
}

