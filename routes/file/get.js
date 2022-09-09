import fs from 'fs';
import path from 'path'

export default function (req, res) {
    // Directory, absolute
    let directory = process.env.HOME;
    if (req.query.directory[0] === '~') directory = path.resolve(directory, req.query.directory.slice(2))
    else directory = path.resolve(directory, req.query.directory)
    // No directory?
    if (!directory) res.status(400).send('No directory (pass it into the query string)');

    // Read files
    let dir = fs.readdirSync(directory)
    // For each file, replace it with a stats object
    let stats = dir.map(file => {
        return {
            file, stats: {
                ...fs.statSync(directory + '/' + file),
                directory: fs.lstatSync(directory + '/' + file).isDirectory()
            }
        }
    })
    return res.status(200).send(JSON.stringify({
        dir: directory,
        files: stats
    }))
}