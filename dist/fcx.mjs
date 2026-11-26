#!/usr/bin/env node
var Ae=Object.defineProperty;var E=(e,t)=>{for(var o in t)Ae(e,o,{get:t[o],enumerable:!0})};var C="2.7.0";var Ee=!!process.stdout.isTTY&&!process.env.NO_COLOR;function I(e,t){return Ee?`\x1B[${e}m${t}\x1B[0m`:String(t)}var d={dim:e=>I("2",e),bold:e=>I("1",e),red:e=>I("31",e),yellow:e=>I("33",e),green:e=>I("32",e),blue:e=>I("38;5;33",e)},h=class extends Error{constructor(t,o){super(t),this.name="FcxError",o&&(this.hint=o)}};function m(e,t){return e=String(e),e.length>=t?e:e+" ".repeat(t-e.length)}var Oe={ok:"OK",warn:"WARN",fail:"FAIL"};function R(e,t,o){let n=m(Oe[e]||String(e).toUpperCase(),4),a=`${e==="fail"?d.red(n):e==="warn"?d.yellow(n):d.green(n)}  ${t}`;o&&(a+=d.dim(`  (${o})`)),console.log(a)}function W(e){let t=e instanceof h?e.message:e&&e.message||String(e);process.stderr.write(`fcx: ${t}
`),e&&e.hint&&process.stderr.write(`fcx: hint: ${e.hint}
`),process.env.FCX_DEBUG&&e&&e.stack&&process.stderr.write(`${e.stack}
`)}function w(e,t=[]){let o=[],n={};for(let s=0;s<e.length;s++){let a=e[s];if(a==="--"){o.push(...e.slice(s+1));break}if(a.startsWith("--")){let i=a.indexOf("=");if(i>-1){n[a.slice(2,i)]=a.slice(i+1);continue}let c=a.slice(2);if(t.includes(c)){let r=e[s+1];if(r===void 0)throw new h(`Option --${c} needs a value.`);n[c]=r,s+=1}else n[c]=!0;continue}if(a.startsWith("-")&&a.length>1){let i=a.slice(1);if(t.includes(i)){let c=e[s+1];if(c===void 0)throw new h(`Option -${i} needs a value.`);n[i]=c,s+=1}else n[i]=!0;continue}o.push(a)}return{positionals:o,flags:n}}var ge="https://stromplayz.github.io/FocusCaseX",we="https://focuscasex.vercel.app",V=`FocusCaseX CLI \u2014 install and host the FocusCaseX registry anywhere.

Usage:
  fcx <command> [options]

Commands:
  doctor [--offline]                             Environment checklist for the clinic machine
  sync                                           Download the marketplace catalog into the local cache
  catalog [kind] [--json]                        List catalog items (code, kind, name)
  workbench list                                 List marketplace workbenches
  workbench show <id-or-code>                    Show a workbench bundle and its contents
  workbench install <id-or-code> [--dir D]       Install a workbench into the local workspace
  serve [--port 4319]                            Host a local registry mirror on the LAN
  open                                           Open the FocusCaseX workspace in a browser
  mcp                                            MCP endpoint, pairing steps and agent setup snippets
  version                                        Print the CLI version (same as fcx --version)

Options:
  --help, -h                                     Show help (per command: fcx <command> --help)
  --version                                      Print the CLI version

Environment:
  FCX_MARKET_URL                                 Marketplace base URL
                                                 (default: ${ge})
  FCX_HOME                                       Workspace root (default: ~/.focuscasex)

Files:
  ~/.focuscasex/cache/catalog.json               Synced marketplace catalog
  ~/.focuscasex/workspace/<id>/                  Installed workbench mirrors

Marketplace: ${ge}
Workspace:   ${we}
`,Le=`Usage: fcx workbench <subcommand> [options]

Subcommands:
  list                                           List workbenches (name, id, install code, description)
  show <id-or-code>                              Fetch the bundle and print the full contents
  install <id-or-code> [--dir D]                 Install the bundle into the local workspace

<id-or-code> accepts:
  an exact item id                               workbench:solo-optometry
  an install code                                FCX-2VJD2S
  a case-insensitive name substring              solo optometry

Options:
  --dir D                                        Install directory
                                                 (default: ~/.focuscasex/workspace/<workbench-id>)
  --json                                         JSON output (workbench list)
  --help, -h                                     Show this help

workbench install writes a local registry/workspace mirror. It does not touch any app data.
`,g={doctor:`Usage: fcx doctor [--offline]

Environment checklist for the clinic machine:

  OK/WARN/FAIL  Node >= 18
  OK/WARN/FAIL  Workspace ~/.focuscasex writable
  OK/WARN/FAIL  Cached catalog present (~/.focuscasex/cache/catalog.json)
  OK/WARN/FAIL  Marketplace reachability (catalog.json, 5s timeout)

Exit code 0 unless a check fails. Network problems are warnings, not crashes:
the CLI falls back to the cached catalog.

Options:
  --offline     Skip the marketplace check
  --help, -h    Show this help
`,sync:`Usage: fcx sync

Fetches the marketplace catalog and saves it to
~/.focuscasex/cache/catalog.json, then prints item and workbench counts.

Override the marketplace base URL with FCX_MARKET_URL.
`,catalog:`Usage: fcx catalog [kind] [--json]

Lists the cached catalog items with their install code, kind and name.
If no cache exists yet, the catalog is synced first (when the network is
available).

Options:
  [kind]        Filter by item kind, e.g. capsule, theme, template, workbench
  --json        Dump the listing as JSON
  --help, -h    Show this help
`,workbench:Le,serve:`Usage: fcx serve [--port 4319]

Hosts a local registry server so a clinic can run its own marketplace
mirror on the LAN. Reads the synced cache (fcx sync).

Endpoints:
  GET /health                  {"ok":true,...} \u2014 version, counts, uptime
  GET /api/catalog             Full cached marketplace catalog
  GET /api/workbenches         Workbenches array
  GET /api/workbenches/<id>    One workbench bundle JSON (id, code or name)
  GET /                        Small HTML index

Options:
  --port N      Port to listen on (default: 4319, binds 0.0.0.0)
  --help, -h    Show this help

Ctrl+C stops the server.
`,open:`Usage: fcx open

Opens ${we} \u2014 the full FocusCaseX workspace, same
features as the Android app \u2014 in the default browser.

macOS uses open, Linux xdg-open, Windows start. If no launcher exists,
the URL is printed instead.
`,mcp:`Usage: fcx mcp

Prints the FocusCaseX MCP server URL, the pairing flow (6-digit code + QR
from the app's Settings -> MCP) and setup snippets for eight agents:
Claude Code, Claude Desktop, Cursor, Windsurf, VS Code, Cline,
Gemini CLI and Codex CLI.
`};var re={};E(re,{run:()=>Te});import q from"node:fs";import Ne from"node:fs";import Me from"node:os";import S from"node:path";var O=process.env.FCX_HOME?S.resolve(process.env.FCX_HOME):S.join(Me.homedir(),".focuscasex");function ee(){return S.join(O,"cache")}function k(){return S.join(ee(),"catalog.json")}function ke(){return S.join(O,"workspace")}function L(e){return Ne.mkdirSync(e,{recursive:!0}),e}function _(e,t){let o=S.resolve(e),n=S.resolve(o,String(t).replace(/^\/+/,""));if(n!==o&&!n.startsWith(o+S.sep))throw new h(`Refusing to write outside ${o} \u2014 check the bundle paths.`);return n}import be from"node:fs";var Ie="https://stromplayz.github.io/FocusCaseX";function T(){return(String(process.env.FCX_MARKET_URL||"").trim()||Ie).replace(/\/+$/,"")}function P(){return`${T()}/catalog.json`}var F="Check the network, or set FCX_MARKET_URL to your own registry mirror. Run fcx sync once the marketplace is reachable.";async function te(e,{timeoutMs:t=1e4,method:o="GET"}={}){let n;try{n=await fetch(e,{method:o,redirect:"follow",signal:AbortSignal.timeout(t)})}catch(s){let a=s&&s.name==="TimeoutError"?"timed out":s&&s.message||"network error";throw new h(`Network error fetching ${e} (${a}).`,F)}if(!n.ok)throw new h(`HTTP ${n.status} ${n.statusText||""} \u2014 ${e}`.trim(),F);try{return await n.text()}catch(s){throw new h(`Could not read the response from ${e} (${s&&s.message}).`,F)}}async function ye(e,t={}){let o=await te(e,t);try{return JSON.parse(o)}catch{throw new h(`Invalid JSON from ${e}.`,F)}}async function oe({timeoutMs:e=1e4}={}){let t=await ye(P(),{timeoutMs:e});if(!t||!Array.isArray(t.items))throw new h(`${P()} returned no items array \u2014 not a FocusCaseX catalog.`);return Re(t),t}function Re(e){L(ee()),be.writeFileSync(k(),JSON.stringify(e,null,2)+`
`)}function ne(){let e;try{e=be.readFileSync(k(),"utf8")}catch{return null}try{return JSON.parse(e)}catch{return{__unreadable:!0}}}async function v({autoSync:e=!0}={}){let t=ne();if(t&&!t.__unreadable)return t;if(e)try{return await oe()}catch(o){throw t&&t.__unreadable?new h(`Cached catalog at ${k()} is unreadable and the marketplace is unreachable (${o.message}).`,o.hint||F):new h(`No cached catalog yet and the marketplace is unreachable \u2014 ${o.message}`,o.hint||F)}throw t&&t.__unreadable?new h(`Cached catalog at ${k()} is unreadable.`,"Run fcx sync."):new h(`No cached catalog at ${k()}.`,"Run fcx sync.")}function j(e){let t=Array.isArray(e&&e.items)?e.items:[],o=Array.isArray(e&&e.workbenches)?e.workbenches:t.filter(s=>s&&s.kind==="workbench"),n=Array.isArray(e&&e.snippets)?e.snippets:[];return{items:t.length,workbenches:o.length,snippets:n.length}}function G(e){return Array.isArray(e&&e.workbenches)&&e.workbenches.length?e.workbenches:(Array.isArray(e&&e.items)?e.items:[]).filter(t=>t&&t.kind==="workbench")}function _e(e){let t=e&&e.files&&e.files.bundle;if(!t)throw new h(`Workbench "${e&&e.id||"?"}" has no bundle file listed in the catalog.`);return`${T()}/${String(t).replace(/^\/+/,"")}`}function J(e,t={}){return ye(_e(e),t)}var se=18;function Fe(e){let t=Math.max(1,Math.floor((Date.now()-e)/1e3));if(t<60)return`${t}s ago`;let o=Math.floor(t/60);if(o<60)return`${o}m ago`;let n=Math.floor(o/60);return n<24?`${n}h ago`:`${Math.floor(n/24)}d ago`}async function Pe(){let e=P();try{let t=await fetch(e,{method:"HEAD",redirect:"follow",signal:AbortSignal.timeout(5e3)});return t.ok||(t=await fetch(e,{method:"GET",redirect:"follow",signal:AbortSignal.timeout(5e3)})),t.ok?{status:"ok",message:`Marketplace reachable \u2014 ${T()}`}:{status:"warn",message:"offline \u2014 cached catalog will be used",note:`marketplace answered HTTP ${t.status}`}}catch(t){return{status:"warn",message:"offline \u2014 cached catalog will be used",note:t&&t.message||"network error"}}}async function Te(e){let{flags:t}=w(e);if(t.help||t.h){process.stdout.write(g.doctor);return}console.log(d.bold("FocusCaseX doctor")),console.log(d.dim(`focuscasex ${C}`)),console.log("");let o=[];{let i=Number(process.versions.node.split(".")[0]);o.push(i>=se?{status:"ok",message:`Node ${process.versions.node} (>= ${se} required)`}:{status:"fail",message:`Node ${process.versions.node} \u2014 Node >= ${se} is required`})}try{q.mkdirSync(O,{recursive:!0});let i=`${O}/.doctor-probe`;q.writeFileSync(i,"ok"),q.unlinkSync(i),o.push({status:"ok",message:`Workspace writable \u2014 ${O}`})}catch(i){o.push({status:"fail",message:`Workspace not writable \u2014 ${O}`,note:i&&i.message||"write failed"})}{let i=ne();if(i&&!i.__unreadable){let c=j(i),r="";try{r=`, synced ${Fe(q.statSync(k()).mtimeMs)}`}catch{}o.push({status:"ok",message:`Cached catalog \u2014 ${c.items} items, ${c.workbenches} workbenches${r}`})}else i&&i.__unreadable?o.push({status:"warn",message:`Cached catalog unreadable \u2014 ${k()}`,note:"run fcx sync"}):o.push({status:"warn",message:`No cached catalog \u2014 ${k()}`,note:"run fcx sync"})}t.offline?o.push({status:"warn",message:"offline \u2014 cached catalog will be used",note:"--offline set"}):o.push(await Pe()),console.log("");for(let i of o)R(i.status,i.message,i.note);let n=o.filter(i=>i.status==="ok").length,s=o.filter(i=>i.status==="warn").length,a=o.filter(i=>i.status==="fail").length;console.log(""),console.log(d.dim(`${n} ok, ${s} warn, ${a} fail`)),a>0&&(process.exitCode=1)}var ie={};E(ie,{run:()=>je});async function je(e){let{flags:t}=w(e);if(t.help||t.h){process.stdout.write(g.sync);return}console.log(d.bold("Syncing marketplace catalog")),console.log(d.dim(`  ${P()}`));let o=await oe(),n=j(o);console.log(""),console.log(`  ${m("saved",13)}${k()}`),console.log(`  ${m("items",13)}${n.items}`),console.log(`  ${m("workbenches",13)}${n.workbenches}`),n.snippets&&console.log(`  ${m("snippets",13)}${n.snippets}`)}var ce={};E(ce,{run:()=>Xe});var ae="23456789ABCDEFGHJKMNPQRSTUVWXYZ";function Ue(e){let t=2166136261;for(let o=0;o<e.length;o++)t^=e.charCodeAt(o),t=Math.imul(t,16777619);return t>>>0}function x(e){let t=Ue(String(e||"")),o="";for(let n=0;n<6;n++)o+=ae[t%ae.length],t=Math.floor(t/ae.length)+(t>>>16);return"FCX-"+o}var De={extension:"plugin",plugin:"plugin",capsule:"capsule",template:"template",snippet:"snippet",theme:"theme",workbench:"workbench",page:"page"};function N(e,t){let o=De[e]||e||"item";return x(`${o}:${t}`)}function He(e){let t=String(e||"").toUpperCase().replace(/[^0-9A-Z]/g,"");return t.startsWith("FCX")&&(t=t.slice(3)),t.length===6&&/^[0-9A-Z]{6}$/.test(t)?t:null}function Z(e,t){let o=String(e||"").trim();if(!o||!t.length)return null;let n=o.match(/^fcx:\/\/install\?id=([\w:%-]+)$/i)||o.match(/[?&]id=([\w:%-]+)/i);if(n){let p=n[1];try{p=decodeURIComponent(p)}catch{}let l=t.find(f=>f.id===p);if(l)return{item:l}}if(/^(workbench|plugin|capsule|theme|template|snippet):[\w-]+$/.test(o)){let p=t.find(l=>l.id===o);if(p)return{item:p}}let s=He(o);if(s){let p=t.find(l=>x(l.id)==="FCX-"+s);if(p)return{item:p}}let a=t.find(p=>p.id===o);if(a)return{item:a};let i=o.toLowerCase(),c=t.filter(p=>String(p.name||"").toLowerCase().includes(i));if(c.length===1)return{item:c[0]};if(c.length>1)return{matches:c};let r=i.split(/[^a-z0-9]+/).filter(Boolean);if(r.length){let p=t.filter(l=>{let f=`${String(l.name||"").toLowerCase().replace(/[^a-z0-9]+/g," ")} ${String(l.id||"").toLowerCase().replace(/[^a-z0-9]+/g," ")}`;return r.every(y=>f.includes(y))});if(p.length===1)return{item:p[0]};if(p.length>1)return{matches:p}}return null}async function Xe(e){let{positionals:t,flags:o}=w(e);if(o.help||o.h){process.stdout.write(g.catalog);return}let n=await v(),s=Array.isArray(n.items)?n.items.slice():[],a=t[0];if(a){let r=a.toLowerCase();s=s.filter(p=>String(p&&p.kind||"").toLowerCase()===r)}if(o.json){console.log(JSON.stringify(s.map(r=>({id:r.id,kind:r.kind,name:r.name,code:x(r.id)})),null,2));return}if(!s.length){console.log(a?`No catalog items with kind "${a}".`:"The catalog is empty \u2014 run fcx sync.");return}let i=10,c=9;console.log(d.dim(m("CODE",i+2)+m("KIND",c+2)+"NAME"));for(let r of s){let p=x(r.id),l=String(r.kind||"-"),f=String(r.name||r.id||"-").split(`
`)[0];console.log(m(p,i+2)+m(l,c+2)+f)}console.log(d.dim(`
${s.length} item${s.length===1?"":"s"}${a?` \xB7 kind ${a}`:""} \xB7 fcx workbench show <id-or-code> for details`))}var pe={};E(pe,{run:()=>qe});import z from"node:fs";import A from"node:path";function Ce(e,t){let o=G(t),n=Z(e,o);if(n&&n.item)return n.item;if(n&&n.matches&&n.matches.length>1){process.stderr.write(`fcx: "${e}" matches ${n.matches.length} workbenches:
`);for(let s of n.matches)process.stderr.write(`  ${x(s.id)}  ${s.id}  ${s.name}
`);throw new h("Be more specific \u2014 use the exact id or the install code.")}throw new h(`No workbench matches "${e}".`,"Run fcx workbench list to see the available workbenches.")}function le(e){return e.help||e.h?(process.stdout.write(g.workbench),!0):!1}async function We(e){let{flags:t}=w(e);if(le(t))return;let o=await v(),n=G(o);if(!n.length){console.log("No workbenches in the catalog yet.");return}if(t.json){console.log(JSON.stringify(n.map(i=>({id:i.id,name:i.name,code:N("workbench",i.id),description:i.tagline||i.description||""})),null,2));return}let s=10,a=Math.max(...n.map(i=>String(i.id||"-").length))+2;console.log(d.dim(m("CODE",s+2)+m("ID",a)+"NAME"));for(let i of n){console.log(m(x(i.id),s+2)+m(String(i.id||"-"),a)+String(i.name||"-"));let c=String(i.tagline||i.description||"").split(`
`)[0];c&&console.log(d.dim(" ".repeat(s+2+a)+c))}console.log(d.dim(`
${n.length} workbench${n.length===1?"":"es"} \xB7 fcx workbench show <id-or-code> for details`))}function Ge(e,t){let o=new Map,n=e&&e.meta||{};for(let r of Array.isArray(n.list)?n.list:[])r&&r.kind&&r.id&&o.set(`${r.kind}:${r.id}`,r.name||r.id);let s=(r,p,l)=>o.get(`${r}:${p}`)||l||p,a=t&&t.contents||{},i=r=>Array.isArray(r)?r:[];return[{title:"EXTENSIONS",kind:"extension",entries:i(a.extensions).map(r=>({name:s("extension",r.id,r.name||r.id),code:N("extension",r.id),version:r.version}))},{title:"CAPSULES",kind:"capsule",entries:i(a.capsules).map(r=>({name:s("capsule",r.id,r.name||r.id),code:N("capsule",r.id),version:r.version}))},{title:"THEME",kind:"theme",entries:a.theme&&a.theme.id?[{name:s("theme",a.theme.id,a.theme.theme&&a.theme.theme.name||a.theme.id),code:N("theme",a.theme.id)}]:[]},{title:"TEMPLATES",kind:"template",entries:i(a.templates).map(r=>({name:s("template",r.id,r.name||r.id),code:N("template",r.id),version:r.version}))},{title:"SNIPPETS",kind:"snippet",entries:i(a.snippets).map(r=>({name:s("snippet",r.name||r.id,r.name||r.id),code:N("snippet",r.name||r.id)}))},{title:"PAGES",kind:"page",entries:i(a.starterPages).map(r=>({name:r.title?`${r.path||r.title} \u2014 ${r.title}`:String(r.path||"page"),code:null}))}].filter(r=>r.entries.length>0)}function Je(e,t){let o=e&&e.meta||{},n=Ge(e,t),s=n.reduce((r,p)=>r+p.entries.length,0)+(t.contents&&t.contents.settings?1:0),i=[`install code ${x(e.id)}`];(t.version||e.version)&&i.push(`version ${t.version||e.version}`),(e.author||t.author)&&i.push(`author ${e.author||t.author}`),e.category&&i.push(`category ${e.category}`),console.log(d.bold(`${e.name||t.name} \u2014 ${e.id}`)),console.log(d.dim(i.join(" \xB7 "))),console.log("");let c=String(e.description||t.description||"").trim();c&&console.log(c),console.log(""),console.log(d.bold(`Contents \u2014 ${s} items`)),console.log("");for(let r of n){let p=Math.min(Math.max(...r.entries.map(l=>l.name.length)),44)+2;console.log(d.bold(`${r.title} (${r.entries.length})`));for(let l of r.entries){let f=[`  ${m(l.name.slice(0,44),p)}`];l.code&&f.push(m(l.code,12)),l.version&&f.push(` v${l.version}`),console.log(f.join("").replace(/\s+$/,""))}console.log("")}t.contents&&t.contents.settings&&(console.log(d.bold("SETTINGS (1)")),console.log("  Editor, appearance and snippet defaults ship with the bundle."),console.log(""))}async function ze(e){let{positionals:t,flags:o}=w(e);if(le(o))return;if(!t.length){process.stderr.write(`fcx: workbench show needs an id or install code

`),process.stderr.write(g.workbench),process.exitCode=1;return}let n=await v(),s=Ce(t[0],n),a=await J(s);Je(s,a)}var xe=new Set(["file","main","manifest","bundle","css","cssSnippet","src","asset"]);function $e(e){return typeof e=="string"&&e.length>0&&!/^\s/.test(e)&&!/\s$/.test(e)&&!e.includes(" ")&&!/^[a-z]+:\/\//i.test(e)&&/\.[A-Za-z0-9]{1,6}$/.test(e)}function Ke(e){let t=new Set,o=e&&e.contents||{},n=["extensions","capsules","templates","snippets"];for(let a of n)for(let i of Array.isArray(o[a])?o[a]:[])if(!(!i||typeof i!="object"))for(let[c,r]of Object.entries(i))xe.has(c)&&$e(r)&&t.add(r);let s=o.theme&&o.theme.theme;if(s&&typeof s=="object")for(let[a,i]of Object.entries(s))xe.has(a)&&$e(i)&&t.add(i);return[...t]}function Be(e){let t=e&&e.contents||{},o=[];for(let n of Array.isArray(t.extensions)?t.extensions:[])o.push({kind:"extension",id:n.id,name:n.id});for(let n of Array.isArray(t.capsules)?t.capsules:[])o.push({kind:"capsule",id:n.id,name:n.id});t.theme&&t.theme.id&&o.push({kind:"theme",id:t.theme.id,name:t.theme.id});for(let n of Array.isArray(t.templates)?t.templates:[])o.push({kind:"template",id:n.id,name:n.id});for(let n of Array.isArray(t.snippets)?t.snippets:[])o.push({kind:"snippet",id:n.name||n.id,name:n.name||n.id});return Array.isArray(t.starterPages)&&t.starterPages.length&&o.push({kind:"pages",name:`${t.starterPages.length} starter pages`}),o}async function Ve(e){let{positionals:t,flags:o}=w(e,["dir"]);if(le(o))return;if(!t.length){process.stderr.write(`fcx: workbench install needs an id or install code

`),process.stderr.write(g.workbench),process.exitCode=1;return}let n=await v(),s=Ce(t[0],n),a=await J(s),i=a&&a.id||s.meta&&s.meta.workbenchId||String(s.id||"workbench").replace(/[^A-Za-z0-9._-]+/g,"-"),c=o.dir?A.resolve(String(o.dir)):A.join(ke(),i);L(c),z.writeFileSync(_(c,"workbench.json"),JSON.stringify(a,null,2)+`
`);let r=Array.isArray(a.contents&&a.contents.starterPages)?a.contents.starterPages:[],p=0;for(let u of r){if(!u||!u.path||typeof u.content!="string")continue;let b=_(A.join(c,"pages"),u.path);L(A.dirname(b)),z.writeFileSync(b,u.content.endsWith(`
`)?u.content:`${u.content}
`),p+=1}let l=a.contents&&a.contents.theme;if(l&&l.theme){let u=_(A.join(c,"theme"),`${l.id||"theme"}.json`);L(A.dirname(u)),z.writeFileSync(u,JSON.stringify(l.theme,null,2)+`
`)}let f=a.contents&&a.contents.settings;f&&z.writeFileSync(_(c,"settings.json"),JSON.stringify(f,null,2)+`
`);let y=0;for(let u of Ke(a))try{let b=await te(`${T()}/${String(u).replace(/^\/+/,"")}`),X=_(A.join(c,"files"),u);L(A.dirname(X)),z.writeFileSync(X,b),y+=1}catch{}let $=Array.isArray(s.meta&&s.meta.list)&&s.meta.list.length?s.meta.list:Be(a);console.log(d.bold(`Installing ${s.name||s.id}`)),console.log(d.dim(`  ${s.id} \xB7 install code ${x(s.id)}`)),console.log(d.dim(`  destination  ${c}`)),console.log("");let H=0;for(let u of $){if(!u)continue;let b="ok",X="";u.kind==="pages"&&(X=`${p}/${r.length} pages written`,p<r.length&&(b="warn")),b==="warn"&&(H+=1),R(b,m(String(u.kind||"item"),10)+String(u.name||u.id||"-"),X)}f&&R("ok",m("settings",10)+"Editor + appearance defaults"),y&&R("ok",m("files",10)+`${y} referenced file${y===1?"":"s"} fetched`),console.log("");let B=$.length+(f?1:0);console.log(`Installed ${B} items into ${c}`),console.log(d.dim("Local workspace mirror \u2014 this does not touch any app data.")),H>0&&(process.exitCode=1)}async function qe(e){let[t,...o]=e;if(!t||t==="--help"||t==="-h"||t==="help"){process.stdout.write(g.workbench);return}if(t==="list")return We(o);if(t==="show")return ze(o);if(t==="install")return Ve(o);process.stderr.write(`fcx: unknown workbench subcommand "${t}"

`),process.stderr.write(g.workbench),process.exitCode=1}var de={};E(de,{run:()=>ot});import Ze from"node:http";import Ye from"node:os";function M(e,t,o){e.writeHead(t,{"content-type":"application/json; charset=utf-8"}),e.end(JSON.stringify(o,null,2)+`
`)}function Y(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Qe(){let e=[],t=Ye.networkInterfaces();for(let o of Object.keys(t))for(let n of t[o]||[])n&&n.family==="IPv4"&&!n.internal&&e.push(n.address);return e}function et(e,t,o){let n=t.map(s=>{let a=`/api/workbenches/${encodeURIComponent(s.id||"")}`,i=Y(s.meta&&s.meta.code||""),c=Y(String(s.tagline||s.description||"").split(`
`)[0]);return`    <div class="card">
      <h2><a href="${a}">${Y(s.name||s.id)}</a></h2>
      <p>${c}</p>
      <p><span class="code">${i}</span> <a href="${a}">bundle JSON</a></p>
    </div>`}).join(`
`);return`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>FocusCaseX registry</title>
<style>
  body { background: #ffffff; color: #111111; margin: 0; padding: 40px 24px;
         font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  h1 { font-size: 22px; margin: 0 0 4px; }
  p.sub { color: #555555; font-size: 13px; margin: 0 0 28px; }
  .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 20px; margin-bottom: 12px; max-width: 720px; }
  .card h2 { font-size: 16px; margin: 0 0 6px; }
  .card h2 a { color: #0f62fe; text-decoration: none; }
  .card h2 a:hover { text-decoration: underline; }
  .card p { font-size: 13px; color: #444444; margin: 4px 0; }
  .code { background: #f4f4f5; border-radius: 6px; padding: 2px 6px; font-size: 12px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  .footer { max-width: 720px; margin-top: 28px; padding-top: 14px; border-top: 1px solid #e5e7eb;
            color: #666666; font-size: 12px; }
  .footer a { color: #0f62fe; text-decoration: none; }
  .footer a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <h1>FocusCaseX registry</h1>
  <p class="sub">Local marketplace mirror served by focuscasex ${Y(C)} \u2014 ${o.items} items, ${o.workbenches} workbenches.</p>
${n}
  <div class="footer">
    Endpoints: <a href="/health">/health</a> \xB7 <a href="/api/catalog">/api/catalog</a> \xB7
    <a href="/api/workbenches">/api/workbenches</a> \xB7 /api/workbenches/&lt;id&gt;
  </div>
</body>
</html>
`}function tt(e,t){let o=String(e||"").trim(),n=Z(o,t);if(n&&n.item)return n.item;if(n&&n.matches&&n.matches.length)return n.matches[0];let s=/^workbench:/i.test(o)?o:`workbench:${o}`;return t.find(a=>a.id===s)||null}async function ot(e){let{flags:t}=w(e,["port"]);if(t.help||t.h){process.stdout.write(g.serve);return}let o=t.port?Number(t.port):4319;if(!Number.isInteger(o)||o<1||o>65535)throw new h(`Invalid port "${t.port}" \u2014 use 1-65535.`);let n=await v(),s=j(n),a=G(n),i=new Map,c=Ze.createServer(async(l,f)=>{try{let $=new URL(l.url||"/","http://localhost").pathname;if($==="/health")return M(f,200,{ok:!0,name:"focuscasex-registry",version:C,items:s.items,workbenches:s.workbenches,catalog:k(),uptime_s:Math.floor(process.uptime())});if($==="/api/catalog")return M(f,200,n);if($==="/api/workbenches")return M(f,200,a);let H=$.match(/^\/api\/workbenches\/(.+)$/);if(H){let B=decodeURIComponent(H[1]),u=tt(B,a);if(!u)return M(f,404,{ok:!1,error:`No workbench matches "${B}"`});let b=i.get(u.id);return b||(b=await J(u),i.set(u.id,b)),M(f,200,b)}return $==="/"||$==="/index.html"?(f.writeHead(200,{"content-type":"text/html; charset=utf-8"}),f.end(et(n,a,s))):M(f,404,{ok:!1,error:"not found"})}catch(y){return M(f,502,{ok:!1,error:y&&y.message||String(y)})}});c.on("error",l=>{l&&l.code==="EADDRINUSE"?W(new h(`Port ${o} is already in use \u2014 try fcx serve --port ${o+1}.`)):W(new h(`Server error: ${l&&l.message||l}`)),process.exit(1)}),await new Promise(l=>c.listen(o,"0.0.0.0",l)),console.log(d.bold("FocusCaseX registry server")),console.log(d.dim(`  focuscasex ${C} \u2014 serving the synced marketplace catalog`)),console.log(`  catalog   ${k()} (${s.items} items, ${s.workbenches} workbenches)`),console.log(""),console.log(`  Local     http://localhost:${o}`);for(let l of Qe())console.log(`  LAN       http://${l}:${o}`);console.log(""),console.log(d.dim("  GET /health                  server health")),console.log(d.dim("  GET /api/catalog             full marketplace catalog")),console.log(d.dim("  GET /api/workbenches         workbench list")),console.log(d.dim("  GET /api/workbenches/<id>    workbench bundle JSON")),console.log(d.dim("  GET /                        HTML index")),console.log(""),console.log("  Ctrl+C to stop");let r=!1,p=()=>{r||(r=!0,console.log(`
Registry server stopped.`),c.close(()=>process.exit(0)),setTimeout(()=>process.exit(0),500).unref())};process.on("SIGINT",p),process.on("SIGTERM",p)}var he={};E(he,{WORKSPACE_URL:()=>Q,run:()=>rt});import{spawn as nt}from"node:child_process";var Q="https://focuscasex.vercel.app";function st(e){return new Promise(t=>{let o,n;process.platform==="darwin"?(o="open",n=[e]):process.platform==="win32"?(o="cmd",n=["/c","start","",e]):(o="xdg-open",n=[e]);try{let s=nt(o,n,{stdio:"ignore",detached:!0});s.on("spawn",()=>{s.unref(),t(!0)}),s.on("error",()=>t(!1))}catch{t(!1)}})}async function rt(e){let{flags:t}=w(e);if(t.help||t.h){process.stdout.write(g.open);return}console.log(`Opening ${Q}`),console.log("(the full FocusCaseX workspace \u2014 same features as the Android app)"),await st(Q)||console.log(`Could not open a browser on this machine. Open manually: ${Q}`)}var ue={};E(ue,{MCP_URL:()=>K,PAIR_URL:()=>Se,mcpText:()=>ve,run:()=>it});var K="https://focuscasex.vercel.app/api/mcp/server",Se="https://focuscasex.vercel.app/api/mcp/pair",fe="<your-token>";function U(e){return JSON.stringify({mcpServers:{focuscasex:{[e]:K,headers:{Authorization:`Bearer ${fe}`}}}},null,2)}function D(e){return e.split(`
`).map(t=>`  ${t}`).join(`
`)}function ve(){return["FocusCaseX MCP","",`Server URL    ${K}`,`Pairing URL   ${Se}`,"","Pairing","  1. In the app: Settings -> MCP -> Connect agent. Enter the agent name and scopes, then Generate code.","  2. You get a 6-digit code (and a QR holding the same payload).","  3. The agent POSTs that code to the pairing URL with its name and requested scopes, then polls.","  4. Approve the pairing in the app. The agent gets the scopes you approved.","  5. Create a per-agent access token in Settings -> MCP and paste it into the snippets below as <your-token>.","  Every write lands in the app as a pending action you approve or deny.","","Agent setup (8)","","Claude Code \u2014 one command",`  claude mcp add --transport http focuscasex ${K} --header "Authorization: Bearer ${fe}"`,"","Claude Desktop \u2014 claude_desktop_config.json",D(U("url")),"","Cursor \u2014 .cursor/mcp.json",D(U("url")),"","Windsurf \u2014 ~/.codeium/windsurf/mcp_config.json",D(U("url")),"","VS Code \u2014 .vscode/mcp.json",D(U("url")),"","Cline \u2014 cline_mcp_settings.json (VS Code globalStorage/saoudrizwan.claude-dev/settings)",D(U("url")),"","Gemini CLI \u2014 ~/.gemini/settings.json",D(U("httpUrl")),"","Codex CLI \u2014 ~/.codex/config.toml","  [mcp_servers.focuscasex]",`  url = "${K}"`,`  http_headers = { "Authorization" = "Bearer ${fe}" }`,"","Tool catalog, pairing guide and automation recipes: https://stromplayz.github.io/FocusCaseX/mcp/"].join(`
`)+`
`}async function it(e){let{flags:t}=w(e);if(t.help||t.h){process.stdout.write(g.mcp);return}process.stdout.write(ve())}var me={doctor:re,sync:ie,catalog:ce,workbench:pe,serve:de,open:he,mcp:ue};async function at(){let e=process.argv.slice(2),t=e[0];if(!t){process.stdout.write(V);return}if(t==="--version"||t==="-v"||t==="-V"||t==="version"){console.log(`focuscasex ${C}`);return}if(t==="--help"||t==="-h"||t==="help"){let n=e[1];n&&me[n]?process.stdout.write(g[n]):n&&n==="version"?console.log(`Usage: fcx version

Prints "focuscasex ${C}". Same as fcx --version.`):process.stdout.write(V);return}if(t.startsWith("-")&&t!=="-")throw new h(`Unknown option "${t}" \u2014 run fcx --help for the command list.`);if(!me[t]){process.stderr.write(`fcx: unknown command "${t}"

`),process.stderr.write(V),process.exitCode=1;return}let o=e.slice(1);await me[t].run(o)}at().catch(e=>{W(e),process.exit(process.exitCode||1)});
