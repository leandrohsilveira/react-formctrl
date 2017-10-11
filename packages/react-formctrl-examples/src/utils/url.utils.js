export function composeUrl(url, path) {
    return `${url.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
}