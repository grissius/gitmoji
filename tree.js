//@ts-check
const { readFileSync } = require('fs');
const emoji = require('github-emoji');

/** @type Array<{ name: string, parentName: string, description: string }> */
const gitmojis = JSON.parse(readFileSync('./src/data/gitmojis.json', 'utf8')).gitmojis;

const mapRec = gm => ({
    node: gm,
    children: gitmojis.filter(x => x.parentName === gm.name).map(mapRec)
})

const printRec = (gm, prefix = '**') => `${prefix} <img:${emoji.of(gm.node.code.replace(/:/g,'')).url}> \\n <b>${gm.node.name}</b> \\n ${gm.node.description}
${gm.children.map(x => printRec(x, `*${prefix}`)).join('\n')}`

const createPlantuml = gitmojis => `
@startwbs
skinparam defaultTextAlignment center
* <img:https://cloud.githubusercontent.com/assets/7629661/20073135/4e3db2c2-a52b-11e6-85e1-661a8212045a.gif> \\n
${gitmojis}
@endwbs
` 

const output = gitmojis
    .filter(gitmoji => !gitmoji.parentName)
    .map(mapRec)
    .map(x => printRec(x))
    .join('')

console.log(createPlantuml(output))