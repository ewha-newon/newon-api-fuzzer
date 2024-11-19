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
    constructor(label: string, public children: (AlertTreeItem | AlertDetailItem)[] | undefined, collapsibleState: vscode.TreeItemCollapsibleState) {
        super(label, collapsibleState);
        this.contextValue = 'alertItem';
    }
}

class AlertDetailItem extends vscode.TreeItem {
    originalKey: string;

    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, originalKey: string) {
        super(label, collapsibleState);
        this.originalKey = originalKey; // vulnerability와 구분되는 / original key 생성 -> 해당 key 이용해서 json 매칭
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
            // active / passive
            const activeItems = Object.keys(this.alertsData.active)
                .filter(key => this.alertsData.active[key].length > 0)
                .map(key => {
                    const alerts = this.alertsData.active[key].map((alert, index) => 
                        new AlertDetailItem(`VULNERABILITY ${index + 1}`, vscode.TreeItemCollapsibleState.Collapsed, key)
                    );
                    return new AlertTreeItem(key, alerts, vscode.TreeItemCollapsibleState.Collapsed);
                });

            const passiveItems = Object.keys(this.alertsData.passive)
                .filter(key => this.alertsData.passive[key].length > 0)
                .map(key => {
                    const alerts = this.alertsData.passive[key].map((alert, index) => 
                        new AlertDetailItem(`VULNERABILITY ${index + 1}`, vscode.TreeItemCollapsibleState.Collapsed, key)
                    );
                    return new AlertTreeItem(key, alerts, vscode.TreeItemCollapsibleState.Collapsed);
                });

            return [
                new AlertTreeItem("Active", activeItems, vscode.TreeItemCollapsibleState.Collapsed),
                new AlertTreeItem("Passive", passiveItems, vscode.TreeItemCollapsibleState.Collapsed)
            ];
        } else if (element instanceof AlertTreeItem) {
            // 하위 항목 반환
            return element.children ?? [];
        } else if (element instanceof AlertDetailItem) {
            // 특정 Alert의 상세 정보 반환
            const key = element.originalKey; // originalKey 사용 -> 데이터 검색
            const alert: Alert | undefined = this.alertsData.active[key]?.[0] || this.alertsData.passive[key]?.[0];
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
export function getJsonData(jsonString: string): JsonData { //getJsonData(JSON.stringify(data))
    return JSON.parse(jsonString) as JsonData;
}