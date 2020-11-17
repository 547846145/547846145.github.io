const fs = require('fs')
const path = require('path')
const ROOT_PATH = path.resolve(__dirname, '../')
const DOC_FOLDER_NAME = 'documents'
const DOC_PATH = path.resolve(__dirname, `../${DOC_FOLDER_NAME}`)
const SIDE_BAR_JSON_PATH = path.resolve(__dirname, './sidebar.json')
const SIDE_BAR_MARKDOWN_PATH = path.resolve(DOC_PATH, '_sidebar.md')

class BuildTools {
    constructor () {
        this.summaryTree = []
        this.summaryMarkdownContent = ''
    }

    build () {
        this.summaryTree = this.readDocumentDir(DOC_PATH)
        this.buildSummaryContent(this.summaryTree, 0)
        this.writeContentToFile()
    }

    readDocumentDir (dirPath) {
        let dirList = []
        let output = []
        try {
            dirList = fs.readdirSync(dirPath, { withFileTypes: true })
        }
        catch (e) {
        }

        dirList.forEach(item => {
            let fileNode = {
                title: item.name.replace(/\.md$/, ''),
                collapsable: true,
                path: path.resolve(dirPath, item.name).replace(path.join(ROOT_PATH, DOC_FOLDER_NAME), '').replace(/\\/gi, '/')
            }
            // 排除 . 开头的文件或文件夹
            if (/^\.|^_/.test(item.name)) return
            if (item.isDirectory() && !/^image[s]/.test(item.name)) {
                output.push({
                    ...fileNode,
                    path: fileNode.path,
                    children: this.readDocumentDir(path.resolve(dirPath, item.name))
                })
            }
            else if (/\.md$/.test(item.name) && !/^README\.md$/.test(item.name)) {
                output.push(fileNode)
            }
        })

        return output
    }

    buildSummaryContent (list, level) {
        list.forEach(item => {
            if (item.children) {
                this.summaryMarkdownContent += `${_addPrefix(level)}* [${item.title}](${item.path}/README.md)\n`
                this.buildSummaryContent(item.children, level + 1)
            }
            else if (!/^README\.md$/.test(item.title) && /\.md$/.test(item.path)) {
                this.summaryMarkdownContent += `${_addPrefix(level)}* [${item.title.replace(/\.md$/, '')}](${item.path})\n`
            }
        })
    }

    writeContentToFile () {
        try {
            fs.writeFileSync(SIDE_BAR_MARKDOWN_PATH, this.summaryMarkdownContent)
            console.log('_sidebar.md ok')
        }
        catch (e) {
            throw e
        }
        try {
            fs.writeFileSync(SIDE_BAR_JSON_PATH, JSON.stringify(this.summaryTree))
            console.log('sidebar.json ok')
        }
        catch (e) {
            throw e
        }
    }
}

let ins = new BuildTools()

ins.build()

function _addPrefix (level) {
    let output = ''
    for (let i = 0; i < level; i++) {
        output += '  '
    }
    return output
}

