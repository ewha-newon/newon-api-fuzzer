import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';

// 명령어 실행 시 -> 자동으로 wsl 터미널 창이 뜨고 newon 명령어를 실행하게 함
// 경로 -> wsl에 맞게 조정, newon 폴더는 newon fuzzer로 어느정도 custom한 cherrybomb fuzzer 폴더

export function activate(context: vscode.ExtensionContext) {

    installNewon(context);

    let disposable = vscode.commands.registerCommand('newonapi.startFuzzing', () => {
        const panel = vscode.window.createWebviewPanel(
            'newonFuzzer', 
            'Newon API Fuzzer', 
            vscode.ViewColumn.One, 
            { enableScripts: true }
        );

        panel.webview.html = getWebViewContent();

        panel.webview.onDidReceiveMessage(message => {
            if (message.action === 'startFuzzing') {
                const specFile = message.specFile;
                const profile = message.profile;

                if (specFile && profile) {
                    
                    // WSL이 설치되어 있는지 확인
                    exec('wsl --version', (error, stdout, stderr) => {
                        let terminalCommand: string;
                        
                        /*
                        if (!error) {
                            // WSL이 설치된 경우 WSL에서 명령 실행
                            vscode.window.showErrorMessage("wsl 설치잼");
                            const wslSpecFile = specFile.replace('C:', '/mnt/c').replace(/\\/g, '/');

                            const terminal = vscode.window.createTerminal({
                                name: 'WSL Newon Terminal',
                                //shellPath: 'wsl'  -> 잠깐 주석 처리
                            });
                            terminalCommand = `newon --file ${wslSpecFile} --profile ${profile}`;
                            terminal.show();
                            terminal.sendText(terminalCommand);
                        }
                        */
                        //원래 여기else였음
                         {
                            vscode.window.showErrorMessage("wsl 설치안됨요");

                            // WSL이 설치되지 않은 경우, 현재 쉘에서 명령 실행
                            const terminal = vscode.window.createTerminal({
                                name: 'Newon Terminal',
                            });
                            terminalCommand = `newon --file "${specFile}" --profile ${profile}`;
                            terminal.show();
                            terminal.sendText(terminalCommand);
                        }
                    });
                } else {
                    vscode.window.showErrorMessage('Please select both a file and a profile.');
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}

function getWebViewContent(): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Newon API Fuzzer</title>
        </head>
        <body>
            <h1>API Fuzzer</h1>
            <label for="specFile">Select OpenAPI Spec File:</label>
            <input type="file" id="specFile" name="specFile"><br><br>

            <label for="profile">Select Profile</label>
            <select id="profile">
                <option value="normal">Normal</option>
                <option value="active">Active</option>
                <option value="passive">Passive</option>
                <option value="info">Info</option>
            </select><br><br>

            <button type="button" onclick="startFuzzing()">Start Fuzzing</button>

            <script>
                const vscode = acquireVsCodeApi();
                function startFuzzing() {
                    const specFileInput = document.getElementById('specFile');
                    const specFile = specFileInput.files.length > 0 ? specFileInput.files[0].path : null;
                    const profile = document.getElementById('profile').value;

                    if (specFile) {
                        vscode.postMessage({
                            action: 'startFuzzing',
                            specFile,
                            profile
                        });
                    } else {
                        alert("Please select a file.");
                    }
                }
            </script>
        </body>
        </html>
    `;
}

function installNewon(context: vscode.ExtensionContext) {
    const newonPath = path.join(context.extensionPath, '../newon');

    try {
        const terminal = vscode.window.createTerminal({
            name: 'WSL Newon Installation',
            shellPath: 'wsl'  
        });

        terminal.sendText('cargo build --release');
        terminal.sendText(`sudo cp ${path.join(newonPath, 'target/release/newon')} /usr/local/bin/`);
        terminal.show(); 
    } 
    catch {
        vscode.window.showInformationMessage('Error during Newon installation');
    }
}

export function deactivate() {}
