import * as vscode from 'vscode';

interface Alert {
    certainty: string;
    level: string;
    description: string;
    location: string;
}

interface JsonData {
    active: { [key: string]: Alert[] };
    passive: { [key: string]: Alert[] };
}

class AlertTreeItem extends vscode.TreeItem {
    constructor(label: string, public children: AlertDetailItem[] | undefined, collapsibleState: vscode.TreeItemCollapsibleState) {
        super(label, collapsibleState);
        this.contextValue = 'alertItem';
    }
}



class AlertDetailItem extends vscode.TreeItem {
    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Expanded) {
        super(label, collapsibleState);
    }
}


class AlertPropertyItem extends vscode.TreeItem {
    constructor(label: string, value: string) {
        super(`${label}`, vscode.TreeItemCollapsibleState.None);
        this.description = value;
    }
}

export class AlertsProvider implements vscode.TreeDataProvider<AlertTreeItem | AlertDetailItem | AlertPropertyItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<AlertTreeItem | undefined> = new vscode.EventEmitter<AlertTreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<AlertTreeItem | undefined> = this._onDidChangeTreeData.event;

    private alertsData: JsonData;

    constructor(alertsData: JsonData) {
        this.alertsData = alertsData;
    }

    getTreeItem(element: AlertTreeItem | AlertDetailItem | AlertPropertyItem): vscode.TreeItem {
        return element;
    }
    getChildren(element?: AlertTreeItem | AlertDetailItem): vscode.ProviderResult<(AlertTreeItem | AlertDetailItem | AlertPropertyItem)[]> {
        if (!element) {
            // 최상위 항목: Active와 Passive를 반환하며, 빈 배열이 아닌 항목들만 반환
            const activeItems = Object.keys(this.alertsData.active)
                .filter(key => this.alertsData.active[key].length > 0)
                .map(key => {
                    const alerts = this.alertsData.active[key].map(alert => new AlertDetailItem(key, vscode.TreeItemCollapsibleState.Collapsed));
                    return new AlertTreeItem(key, alerts, vscode.TreeItemCollapsibleState.Collapsed);
                });
                
    
            const passiveItems = Object.keys(this.alertsData.passive)
                .filter(key => this.alertsData.passive[key].length > 0)
                .map(key => {
                    const alerts = this.alertsData.passive[key].map(alert => new AlertDetailItem(key, vscode.TreeItemCollapsibleState.Collapsed));
                    return new AlertTreeItem(key, alerts, vscode.TreeItemCollapsibleState.Collapsed);
                });
    
            return [
                new AlertTreeItem("Active", activeItems, vscode.TreeItemCollapsibleState.Collapsed),
                new AlertTreeItem("Passive", passiveItems, vscode.TreeItemCollapsibleState.Collapsed)
            ];
        } else if (element instanceof AlertTreeItem) {
            // 최상위 Active 또는 Passive 항목의 하위 AlertDetailItem 반환
            return element.children ?? [];
        } else if (element instanceof AlertDetailItem && typeof element.label === 'string') {
            // element.label이 string 타입일 때만 접근
            const alert: Alert | undefined = this.alertsData.active[element.label]?.[0] || this.alertsData.passive[element.label]?.[0];
            if (alert) {
                return [
                    new AlertPropertyItem("Certainty", alert.certainty),
                    new AlertPropertyItem("Level", alert.level),
                    new AlertPropertyItem("Description", alert.description),
                    new AlertPropertyItem("Location", alert.location)
                ];
            }
        }
        return [];
    }
    dispose(): void {
        this._onDidChangeTreeData.dispose();
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


