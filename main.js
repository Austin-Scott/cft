#!/usr/bin/env node

const fs = require('fs')
const clipboard = require('clipboardy')
const path = require('path')
const ascii85 = require('ascii85')

function pasteFile() {
    try {
        console.log('Reading from your clipboard...')
        let clipboardContents = clipboard.readSync()
        let regex = /(.*)<~(.*)~>/
        let match = regex.exec(clipboardContents)
        if(match.length == 3) {
            let basename = match[1]
            let encodedFile = match[2]
            console.log('Decoding ascii85 file...')
            let fileBuffer = ascii85.decode(encodedFile)
            console.log(`Writting '${basename}' to your disk...`)
            fs.writeFileSync(basename, fileBuffer)
            console.log('...done!')
        } else {
            console.error('Error: there is not an ascii85 file in your clipboard right now.')
        }
    } catch (error) {
        console.error(error)
    }
}

function copyFile(pathname) {
    try {
        let basename = path.basename(pathname)
        console.log('Reading file...')
        let fileBuffer = fs.readFileSync(pathname)
        console.log('ascii85 encoding file...')
        let encodedBuffer = ascii85.encode(fileBuffer)
        console.log('Writing encoded file to clipboard...')
        clipboard.writeSync(`${basename}<~${encodedBuffer.toString()}~>`)
        console.log('...done!')
    } catch (error) {
        console.error(error)
    }
}

let argument = process.argv.slice(2)
if(argument.length > 0) {
    copyFile(argument[0])
} else {
    pasteFile()
}