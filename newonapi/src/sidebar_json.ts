import * as vscode from 'vscode';

// JSON 데이터를 표현할 인터페이스
interface Alert {
    certainty: string;
    level: string;
    description: string;
    location: string;
}

interface ActiveAlerts {
    [key: string]: Alert[];
}

interface PassiveAlerts {
    [key: string]: Alert[];
}

interface JsonData {
    active: ActiveAlerts;
    passive: PassiveAlerts;
}

class AlertTreeItem extends vscode.TreeItem {
    constructor(label: string, public alerts: Alert[]) {
        super(label);
        this.tooltip = `Click to see alerts`;
    }

    contextValue = 'alertItem';
}

export class AlertsProvider implements vscode.TreeDataProvider<AlertTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<AlertTreeItem | undefined> = new vscode.EventEmitter<AlertTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<AlertTreeItem | undefined> = this._onDidChangeTreeData.event;

    private alertsData: JsonData;

    constructor(alertsData: JsonData) {
        this.alertsData = alertsData;
    }

    getTreeItem(element: AlertTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(): AlertTreeItem[] {
        const activeItems = Object.entries(this.alertsData.active).map(([key, alerts]) => new AlertTreeItem(key, alerts));
        const passiveItems = Object.entries(this.alertsData.passive).map(([key, alerts]) => new AlertTreeItem(key, alerts));
        
        return [...activeItems, ...passiveItems];
    }

    // dispose 메서드 추가
    dispose(): void {
        // 필요한 경우 리소스 해제 로직 추가
    }
}

// JSON 데이터를 가져오는 함수
export function getJsonData(): JsonData {
    return {
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
    };
}
