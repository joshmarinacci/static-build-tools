import path from 'path'
import fs from 'fs'
import child_process from 'child_process'

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

export async function copyall(opts) {
    let files = await fs.promises.readdir(opts.src)
    files = files.filter(opts.include)
    await Promise.all(files.map(async (file) => {
        let pth = path.join(opts.builddir, file)
        let data = await fs.promises.readFile(path.join(opts.src, file))
        await fs.promises.writeFile(pth, data)
    }))
}

export async function async_map(PAGES, param2) {
    await Promise.all(PAGES.map(param2))
}

export async function exec_and_wait(cmd) {
    return new Promise((res, rej) => {
        log(`executing: ${cmd}`)
        child_process.exec(cmd, ((error, stdout) => {
            // console.log("error",error)//.split("\n").join("\nERRROR"));
            if (error) return rej(error)
            // console.log("stdout",stdout.split("\n").join("\nSTDOUT:"))
            res(stdout)
        }))
    })
}

export async function file_exists(pth) {
    try {
        let info = await fs.promises.stat(pth)
        return true
    } catch (e) {
        console.log(e)
        return false
    }
}
