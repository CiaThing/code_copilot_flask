// // The module 'vscode' contains the VS Code extensibility API
// // Import the module and reference it with the alias vscode in your code below
// import * as vscode from 'vscode';

// // This method is called when your extension is activated
// // Your extension is activated the very first time the command is executed
// export function activate(context: vscode.ExtensionContext) {

// 	// Use the console to output diagnostic information (console.log) and errors (console.error)
// 	// This line of code will only be executed once when your extension is activated
// 	console.log('Congratulations, your extension "codecopilotv2" is now active!');

// 	// The command has been defined in the package.json file
// 	// Now provide the implementation of the command with registerCommand
// 	// The commandId parameter must match the command field in package.json
// 	const disposable = vscode.commands.registerCommand('codecopilotv2.helloWorld', () => {
// 		// The code you place here will be executed every time your command is executed
// 		// Display a message box to the user
// 		vscode.window.showInformationMessage('Hello World from codecopilotv2!');
// 	});

// 	context.subscriptions.push(disposable);
// }

// // This method is called when your extension is deactivated
// export function deactivate() {}


import * as vscode from 'vscode';

interface GenerateResponse {
	result : string;
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('codecopilotv2.generateCode', async () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const selection = editor.selection;
            const document = editor.document;
            const codeSnippet = editor.document.getText(selection);
            const text = selection.isEmpty ? document.getText() : codeSnippet;

            try {
                const response = await fetch('http://localhost:5000/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code: text })
                });

                const data = await response.json() as GenerateResponse;
                const generatedCode = data.result;

                editor.edit(editBuilder => {
                    editBuilder.insert(selection.end, `\n${generatedCode}`);
                });
            } catch (error : unknown) {
				const ErrorMessage = error instanceof Error ? error.message : 'An unknown error occured';
                vscode.window.showErrorMessage('Failed to generate code: ' + ErrorMessage);
            }
        }
    });

    context.subscriptions.push(disposable);
}
