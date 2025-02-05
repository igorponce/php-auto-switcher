import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    // Verifica se há workspace aberto

    if (!vscode.workspace.workspaceFolders) {
        return;
    }
    
    const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const composerJsonPath = path.join(workspaceFolder, 'composer.json');

    // Verifica se o arquivo composer.json existe
    if (!fs.existsSync(composerJsonPath)) {
        vscode.window.showInformationMessage('composer.json não encontrado no projeto.');
        return;
    }
    
    // Lê o composer.json
    fs.readFile(composerJsonPath, 'utf8', (err, data) => {
        if (err) {
            vscode.window.showErrorMessage('Erro ao ler composer.json: ' + err.message);
            return;
        }
        
        try {
            const composer = JSON.parse(data);
            if (!composer.require || !composer.require.php) {
                vscode.window.showInformationMessage('Nenhuma dependência PHP encontrada no composer.json.');
                return;
            }
            
            const phpRequirement: string = composer.require.php; // ex: "^7.2.5|^8.0"
            // Separa os requisitos (usando "|" como separador)
            const versionRanges = phpRequirement.split('|').map(v => v.trim());
            
            // Para simplificar, vamos assumir que cada requisito é do formato "^X.Y.Z"
            // Extraímos a versão "base" removendo o '^'
            const versions = versionRanges.map(v => v.startsWith('^') ? v.substring(1) : v);
            
            // Seleciona a maior versão usando uma função de comparação simples
            const desiredVersion = versions.reduce((prev, curr) => {
                return compareVersions(prev, curr) >= 0 ? prev : curr;
            });
            
            vscode.window.showInformationMessage('Versão PHP desejada: ' + desiredVersion);
            
            // Caminhos fixos (poderiam ser configuráveis)
           
            const xamppFolder = vscode.workspace.getConfiguration('phpAutoSwitcher').get<string>('phpFolderPath', 'C:\\xampp');
            const phpFolderPath = `${xamppFolder}\\php`;
			const phpFolderPathSecondTry = `${xamppFolder}\\php\\windowsXamppPhp`;

            // Verifica a versão atual do PHP executável
			let phpExecutable = path.join(phpFolderPath, 'php.exe');
			if (!fs.existsSync(phpExecutable)) {
				phpExecutable = path.join(phpFolderPathSecondTry, 'php.exe');
				if (!fs.existsSync(phpExecutable)) {
					vscode.window.showErrorMessage('php.exe não encontrado nos caminhos especificados.');
					return;
				}
			}
			
            cp.exec(`"${phpExecutable}" -v`, (error, stdout, stderr) => {

                if (error) {
                    vscode.window.showErrorMessage('Erro ao executar o PHP: ' + error.message);
                    return;
                }
                
                // Exemplo de saída: "PHP 7.4.12 (cli) ..."
                const versionMatch = stdout.match(/PHP (\d+\.\d+\.\d+)/);
                if (!versionMatch) {
                    vscode.window.showErrorMessage('Não foi possível determinar a versão do PHP.');
                    return;
                }
                
                const currentVersion = versionMatch[1];

                vscode.window.showInformationMessage('Versão atual do PHP: ' + currentVersion);
                
                // Se a versão atual não for compatível com a desejada (definindo compatibilidade pelo major, por exemplo)
                if (!isVersionCompatible(currentVersion, desiredVersion)) {
                    // Renomeia a pasta atual de php para php_{major_minor}
                    // Exemplo: se currentVersion for "7.4.12", renomeia para "php_7_4"
                    const newNameCurrent = 'php_' + currentVersion.split('.').slice(0,2).join('_');
                    const newPathCurrent = path.join(path.dirname(phpFolderPath), newNameCurrent);
                    
                    fs.rename(phpFolderPath, newPathCurrent, (renameErr) => {
                        if (renameErr) {
                            vscode.window.showErrorMessage('Erro ao renomear a pasta do PHP: ' + renameErr.message);
                            return;
                        }
                        
                        vscode.window.showInformationMessage(`Pasta renomeada para ${newNameCurrent}`);
                        
                        // Procura pela pasta desejada. Supondo que ela esteja nomeada como "php_" + major version (ex.: "php_8_0")
                        const desiredFolderName = 'php_' + desiredVersion.split('.').slice(0, 2).join('_');
                        const desiredFolderPath = path.join(xamppFolder, desiredFolderName);
                        
                        if (!fs.existsSync(desiredFolderPath)) {
                            vscode.window.showErrorMessage(`Pasta ${desiredFolderName} não encontrada em ${xamppFolder}`);
                            return;
                        }
                        
                        // Renomeia a pasta desejada para "php" (no diretório C:\xampp)
                        const newPhpFolderPath = path.join(xamppFolder, 'php');
                        fs.rename(desiredFolderPath, newPhpFolderPath, (renameErr2) => {
                            if (renameErr2) {
                                vscode.window.showErrorMessage('Erro ao renomear a pasta do PHP desejada: ' + renameErr2.message);
                                return;
                            }
                            
                            vscode.window.showInformationMessage(`PHP atualizado para a versão ${desiredVersion}`);
                        });
                    });
                } else {
                    vscode.window.showInformationMessage('A versão do PHP já é compatível.');
                }
            });
        } catch(parseErr: any) {
            vscode.window.showErrorMessage('Erro ao interpretar o composer.json: ' + parseErr.message);
        }
    });
}

/**
 * Compara duas versões no formato X.Y.Z.
 * Retorna 1 se v1 > v2, -1 se v1 < v2 ou 0 se forem iguais.
 */
function compareVersions(v1: string, v2: string): number {
    const v1Parts = v1.split('.').map(n => parseInt(n, 10));
    const v2Parts = v2.split('.').map(n => parseInt(n, 10));
    
    for (let i = 0; i < 3; i++) {
        if (v1Parts[i] > v2Parts[i]) return 1;
        if (v1Parts[i] < v2Parts[i]) return -1;
    }
    return 0;
}

/**
 * Verifica se as versões são compatíveis.
 * Aqui, consideramos compatíveis se possuírem o mesmo número major.
 */
function isVersionCompatible(current: string, desired: string): boolean {
	return current.split('.').slice(0, 2).join('.') === desired.split('.').slice(0, 2).join('.');
}
