class GServer {
    constructor() {
        this.element = document.querySelector('.finder');
        this.fileList = document.querySelector('.finder-content');
        this.columns = [];
    }
    init(directory) {
        this.resizeHandle(0b11, this.element,10)
        this.loadFiles(directory);
    }
    loadFiles(directory) {
        let self = this;

        fetch(`/file?directory=${directory}`)
            .then(r => r.json())
            .then(json => {
                this.columns.push(json)
                this.loadColumns(1);
                populateDirectory(json)
            })

        function populateDirectory(json) {
            let column = self.fileList.children[self.columns.length - 1];
            for (const file of json.files) {
                // if (file.file.startsWith('.')) continue;

                let htmlFile = document.createElement('div');
                htmlFile.innerHTML = file.file;
                htmlFile.classList.add('finder-file', ...getFileType(file))
                htmlFile.dataset.ref = column.dataset.dir + file.file
                column.append(htmlFile)
            }
        }

        function getFileType(file) {
            let types = []
            if (file.file.startsWith('.')) types.push('invisible')
            if (file.stats.directory) types.push('directory')
            types.push(file.file.split('.')[file.file.split('.').length - 1])
            return types
        }
    }
    resizeHandle(bin, el, brc) {
        //bin: 0bwh
        //brc: bottom right corner area
        el.addEventListener('mousedown', () => {
            el.mousedown = true;
        })
        window.addEventListener('mouseup', () => {
            el.startedInBrc = false;
            el.mousedown = false;
        })
        window.addEventListener('mousemove', (e) => {
            if (!el.mousedown) return
            el.startedInBrc = true
            let bounds = el.getBoundingClientRect();
            let x = e.clientX - bounds.left;
            let y = e.clientY - bounds.top;
            el.style.cursor = 'resize';
            if (
                // Brc is enabled
                brc && (
                    // Mouse is higher than brc area
                    bounds.height - y > brc ||
                    // Mouse is farther left than brc area
                    bounds.width - x > brc ||
                        // If user didn't start dragging in brc,
                    !el.startedInBrc && (
                        // Stop if...
                        // Mouse is lower than window's height
                        bounds.height - y < -brc ||
                           // Mouse is farther right than window's width
                        bounds.width - x < -brc
                    )
                )
            ) return;

            el.style.width = Math.max(x, 300) + 'px';
            el.style.height = Math.max(y , 200) + 'px';
        })
    }
    loadColumns() {
        this.fileList.innerHTML = '';
        for (let i = 0; i < this.columns.length; i++) {
            let column = document.createElement('div');
            column.classList.add('finder-content-column');
            column.dataset.dir = this.columns[i].dir;

            let columnResize = document.createElement('div')
            columnResize.classList.add('finder-column-resize')
            this.resizeHandle(0b10, columnResize)
            column.append(columnResize)

            this.fileList.append(column)
        }
    }
}

const gserver = new GServer()
gserver.init('~');