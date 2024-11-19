import * as vscode from 'vscode';
import * as path from 'path';
import { exec } from 'child_process';
import { AlertsProvider, getJsonData } from './sidebar_json';



// 명령어 실행 시 -> 자동으로 wsl 터미널 창이 뜨고 newon 명령어를 실행하게 함
// 경로 -> wsl에 맞게 조정, newon 폴더는 newon fuzzer로 어느정도 custom한 cherrybomb fuzzer 폴더

export function activate(context: vscode.ExtensionContext) {

    const data={
        "active": {
            "AUTH BY PASS": [],
            "BROKEN OBJECT LEVEL AUTHORIZATION": [],
            "Check Content-type header": [],
            "METHOD PERMISSION": [],
            "NUMBER LIMITS ENFORCED": [],
            "OPEN REDIRECT": [],
            "PARAMETER POLLUTION": [],
            "SQL Injection": [],
            "SSL ENFORCED": [],
            "SSRF GET": [],
            "SSRF POST": [],
            "STRING LENGTH ENFORCED": []
        },
        "passive": {
            "401": [],
            "403": [],
            "ADDITIONAL PROPERTIES": [],
            "ARRAY ATTRIBUTES": [],
            "AUTH": [
                {
                    "certainty": "Passive",
                    "description": "The API doesn't have authentication defined",
                    "level": "Medium",
                    "location": "swagger root components"
                }
            ],
            "CHECK FORMAT": [],
            "CONTAINS OPERATION": [],
            "CONTAINS RESPONSE": [],
            "DEFAULT RESPONSE": [
                {
                    "certainty": "Passive",
                    "description": "No default response defined",
                    "level": "Low",
                    "location": "swagger path:/login operation:POST"
                },
                {
                    "certainty": "Passive",
                    "description": "No default response defined",
                    "level": "Low",
                    "location": "swagger path:/profile operation:GET"
                }
            ],
            "DEFAULT TYPE": [],
            "DESCRIPTION": [
                {
                    "certainty": "Passive",
                    "description": "Operation has no description",
                    "level": "Low",
                    "location": "swagger path:/login operation:POST"
                },
                {
                    "certainty": "Passive",
                    "description": "Operation has no description",
                    "level": "Low",
                    "location": "swagger path:/profile operation:GET"
                }
            ],
            "ENDPOINT AUTH": [],
            "ENUM TYPE": [],
            "INTEGER ATTRIBUTES": [
                {
                    "certainty": "Passive",
                    "description": "Number schema without a minimum",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json prop:age"
                },
                {
                    "certainty": "Passive",
                    "description": "Number schema without a maximum",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json prop:age"
                }
            ],
            "METHOD PERMISSIONS": [],
            "OBJECT ATTRIBUTES": [
                {
                    "certainty": "Passive",
                    "description": "Object schema without minimum properties",
                    "level": "Low",
                    "location": "swagger root path:/login method:POST response status:200  media type:application/json"
                },
                {
                    "certainty": "Passive",
                    "description": "Object schema without maximum properties",
                    "level": "Low",
                    "location": "swagger root path:/login method:POST response status:200  media type:application/json"
                },
                {
                    "certainty": "Passive",
                    "description": "Object schema without minimum properties",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json"
                },
                {
                    "certainty": "Passive",
                    "description": "Object schema without maximum properties",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json"
                }
            ],
            "RESPONSE BODY SCHEMA": [],
            "RESPONSE SUCCESSES (2xx)": [],
            "SERVER URL": [
                {
                    "certainty": "Passive",
                    "description": "Insecure transport, using http instead of https",
                    "level": "Low",
                    "location": "swagger root servers, address:http://localhost:3000"
                }
            ],
            "STRING ATTRIBUTES": [
                {
                    "certainty": "Passive",
                    "description": "String schema without a minimum length",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json prop:name"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a maximum length",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json prop:name"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a pattern",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json prop:name"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a minimum length",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json prop:email"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a maximum length",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json prop:email"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a pattern",
                    "level": "Low",
                    "location": "swagger root path:/profile method:GET response status:200  media type:application/json prop:email"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a minimum length",
                    "level": "Low",
                    "location": "swagger root path:/login method:POST response status:200  media type:application/json prop:message"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a maximum length",
                    "level": "Low",
                    "location": "swagger root path:/login method:POST response status:200  media type:application/json prop:message"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a pattern",
                    "level": "Low",
                    "location": "swagger root path:/login method:POST response status:200  media type:application/json prop:message"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a minimum length",
                    "level": "Low",
                    "location": "swagger root path:/login method:POST response status:200  media type:application/json prop:token"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a maximum length",
                    "level": "Low",
                    "location": "swagger root path:/login method:POST response status:200  media type:application/json prop:token"
                },
                {
                    "certainty": "Passive",
                    "description": "String schema without a pattern",
                    "level": "Low",
                    "location": "swagger root path:/login method:POST response status:200  media type:application/json prop:token"
                }
            ],
            "UNUSED SCHEMA": [],
            "VALID ENCODINGS": [],
            "VALID RESPONSES": []
        }
    }
    //installNewon(context);

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
                    const wslSpecFile = specFile.replace('C:', '/mnt/c').replace(/\\/g, '/');

                    // WSL이 설치되어 있는지 확인
                    //exec('wsl --version', (error, stdout, stderr) => {
                        let terminalCommand: string;
                        /*
                        //원래주석
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
                            /*
                            const terminal = vscode.window.createTerminal({
                                name: 'Newon Terminal',
                            }); 
                            
                            terminalCommand = `newon --file "${wslSpecFile}" --profile ${profile}`;
                            terminal.show();
                            terminal.sendText(terminalCommand); */
                            runCommand(wslSpecFile,profile);
                        }
                    //});
                
                
                } 
                else {
                    vscode.window.showErrorMessage('Please select both a file and a profile.');
                }
            }
        });
    });

    // JSON 데이터와 사이드바 등록 관련 코드

    const jsonData=getJsonData(JSON.stringify(data)); //여기 부분을 getJsonData가 아니라 exec으로 퍼저 돌렸을 떄 화면에 출력되는 값
    const alertsProvider = new AlertsProvider(jsonData);

    // 사이드바 ID를 패키지 설정의 ID와 일치하게 등록
    vscode.window.createTreeView('FuzzingResultView', {
        treeDataProvider: alertsProvider
    });

    context.subscriptions.push(alertsProvider);

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

function runCommand(specFile: string, profile: string): void {
    const command = `wsl bash -c newon --file "${specFile}" --profile ${profile}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Command error output: ${stderr}`);
            return;
        }

    });

    
    exec(command,{ shell: "bash" }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error.message}`);
            return;
        }

        if (stderr) {
            console.error(`Command error output: ${stderr}`);
            return;
        }

        // stdout에 출력된 JSON 형식의 문자열을 처리
        try {
            const jsonData = getJsonData(stdout);
            console.log("Parsed JSON Data:", jsonData);
        } catch (parseError) {
            console.error("Failed to parse JSON");
        }
    });
}


export function deactivate() {}
