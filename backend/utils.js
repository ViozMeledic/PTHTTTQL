export function getNextId(id) {
    let numPart = String(parseInt(id.slice(2))+1)
    return id.slice(0, 2).concat(numPart.padStart(3, '0'))
}