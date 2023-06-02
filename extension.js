
const vscode = require('vscode');
function transform(s) {
	let lines = s.split("\n")
	let result = lines.reduce((accu,current)=> {
		accu += "<tr>\n<td>" + current.replaceAll(";","</td>\n<td>") + "</td>\n</tr>\n"
		return accu
	},"")

	return "<table>\n"+result+"</table>"
}


function activate(context) {

	console.log('Congratulations, your extension "csv2table" is now active!');

	let disposable = vscode.commands.registerCommand('csv2table.toHTML', function () {
		vscode.window.showInformationMessage('Hello World from CSV2Table!');
		let textEditor = vscode.window.activeTextEditor
		let selection = textEditor.selection
		let document = textEditor.document
		let start = selection.start
		let end = selection.end
		let text = document.getText(new vscode.Range(start,end))
		let result = transform(text)
		textEditor.edit(async (ed)=> {
			await ed.replace(selection,result)
			vscode.commands.executeCommand("editor.action.formatDocument")
		})
	});

	context.subscriptions.push(disposable);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
