
const vscode = require('vscode');


function transform(document,selection) {
	let config = vscode.workspace.getConfiguration('csv2table')
	let delimiter = config.get("delimiter",";")
	let header = config.get("header", false)
	let footer = config.get("footer", false)

	let st = selection.start.line
	let e = selection.end.line
	let lines = []
	for (let i = st;i<=e;i++) {
		lines.push(document.lineAt(i).text)
	}
	let result = ""
	if (header) {
		let firstline="";
		[firstline,...lines] = lines
		result = "<thead><tr>\n<th>" + firstline.replaceAll(delimiter,"</th>\n<th>") + "</th>\n</tr>\n</thead>" 
	}
	footerresult = ""
	if (footer) {
		let lastline="";
		lastline=lines.pop()
		footerresult = "<tfoot><tr>\n<td>" + lastline.replaceAll(delimiter,"</td>\n<td>") + "</td>\n</tr>\n</tfoot>" 
	}
	result = lines.reduce((accu,current)=> {
		accu += "<tr>\n<td>" + current.replaceAll(delimiter,"</td>\n<td>") + "</td>\n</tr>\n"
		return accu
	},result)

	return "<table>\n"+result+footerresult+"</table>"
}


function toggleBar(bar) {
	let config = vscode.workspace.getConfiguration('csv2table')
	let statusbar = config.get("statusbar")

	if (statusbar) {
		bar.show()
	} else {
		bar.hide()
	}

} 

function activate(context) {
	
	let bar = vscode.window.createStatusBarItem()
	bar.text="📅 csv2table"
	bar.command = 'csv2table.toHTML'
	toggleBar(bar)


	let disposable = vscode.commands.registerCommand('csv2table.toHTML', function () {
		//vscode.window.showInformationMessage('Hello World from CSV2Table!');
		let textEditor = vscode.window.activeTextEditor
		let selection = textEditor.selection
		let document = textEditor.document
		let result = transform(document,selection)
		textEditor.edit(async (ed)=> {
			await ed.replace(selection,result)
			vscode.commands.executeCommand("editor.action.formatDocument")
		})
	});

	let events = vscode.workspace.onDidChangeConfiguration((event) => {
		if (event.affectsConfiguration('csv2table.statusbar')) {
			toggleBar(bar)
		}
	})

	context.subscriptions.push(disposable,events);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
