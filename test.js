import {make_element, make_custom_element, page, copy} from './src/index.js'

const html = make_element('html')
const meta = make_element('meta',{close:false})
const link = make_element('link',{close:false})
const h1 = make_element('h1');
const h2 = make_element('h2');
const h3 = make_element('h3');
const header = make_element('header');
const div = make_element('div')
const body = make_element('body')
const p = make_element('p')
const section = make_element('section')
const img = make_element('img',{close:false})
const a = make_element('a',{break_line:false})
const b = make_element('b',{break_line:false})
const i = make_element('i',{break_line:false})
const li = make_element('li',{break_line:true})
const ul = make_element('ul',{break_line:true})


const PAGES = [
    {name:"Mission Replay", slug:'mission_replay'},
    {name:"Sim Replay", slug:'sim_replay'},
    {name:'CarViz Pro', slug:'carviz_ide'},
    {name:'Copilot CV', slug:'copilot'},
    {name:'Passenger CV', slug:'passenger'},
    {name:'Web SDK', slug:'websdk'},
    {name:'Native SDK', slug:'cppsdk'},
    {name:'Cloud CV', slug:'carviz_cloud'},
    {name:'CarViz VR', slug:'webxr'},
]

const main_nav = make_custom_element(() => {
    let links = PAGES.map(({name,slug}) => {
        return li(a({href:'/'+slug+".html"},name))
    }).join("\n")
    return ul(links)
})






const BUILD_DIR = "build2"

async function runit() {
    await page({builddir:BUILD_DIR,file:'index.html'},
        html({lang:'en'},
            meta({charset:'utf-8'}),
            link({href:'main.css', rel:'stylesheet'}),
            body(
                main_nav(),
                div({class:"main"},
                    header(
                        h1(
                            b("AV"),i("STDIO"),
                        ),
                        p("for all your AV training and visualization needs."),
                    ),
                    section(
                        h2("Applications"),
                        div({class:'tool-panel'},
                            a({href:"mission_replay"},	img({src:"mission_replay_square.png"})),
                            h3("Mission Replay"),
                            p("review and triange any mission",b("instantly!"),),
                        ),
                    )
                )
            ),
        ),
    )

    await copy({builddir:BUILD_DIR, src:'test.css',dst:'main.css'})
    // await copy({builddir:BUILD_DIR, src:'tools/images/img1.png', dst:'images/img1.png'})
}



runit().then(()=>console.log("done!")).catch(e => console.error(e))
