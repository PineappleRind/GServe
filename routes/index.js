export default async function routes() {
    return {
        file: {
            get: await import('./file/get.js').then(d => d.default),
            post: await import('./file/post.js').then(d => d.default),
            delete: await import('./file/delete.js').then(d => d.default),
        }
    }
}