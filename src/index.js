import path from 'path'
import fs from 'fs'

export function make_custom_element(fn) {
    return async function(opts,...children) {
        if(!opts) opts = {}
        if(!children) children = []
        opts.children = await Promise.all(children)
        return await fn(opts)
    }
}

export function make_element(name, settings) {
    settings = settings || {}
    let close = settings.hasOwnProperty('close')?settings.close:true;
    let break_line = settings.hasOwnProperty('break_line')?settings.break_line:true;
    // console.log(`${name} is close=${close} break_line =${break_line}`)
    return async function(opts,...children) {
        opts = await Promise.resolve(opts)
        children = await Promise.all(children)
        if(typeof opts !== 'object') {
            children.unshift(opts)
            opts = {}
        }
        let atts = Object.entries(opts).map(([key,value]) => {
            return ` ${key}="${value}"`
        }).join("")

        let begin = `<${name}${atts}>`
        let end = `</${name}>`
        if(!close) end = ''
        return begin
            + ((break_line&&close)?"\n":"")
            + (children.join("\n"))
            + end
    }
}


function log(...args) {
    console.log(...args)
}

export async function page(opts,content) {
    let pth = path.join(opts.builddir,opts.file)
    log("building dir",opts.builddir)
    await fs.promises.mkdir(opts.builddir,{recursive:true})
    log("rendering page to",pth)
    content = await Promise.resolve(content)
    await fs.promises.writeFile(pth,content);
}

export async function copy(opts) {
    let pth = path.join(opts.builddir,opts.dst)
    log(`copying ${opts.src} to ${pth}`)
    let data = await fs.promises.readFile(opts.src)
    await fs.promises.writeFile(pth,data)
}

