#!/usr/bin/env node
var Ve=Object.defineProperty;var S=(t,e)=>{for(var o in e)Ve(t,o,{get:e[o],enumerable:!0})};var b="2.9.0";var qe=!!process.stdout.isTTY&&!process.env.NO_COLOR;function R(t,e){return qe?`\x1B[${t}m${e}\x1B[0m`:String(e)}var l={dim:t=>R("2",t),bold:t=>R("1",t),red:t=>R("31",t),yellow:t=>R("33",t),green:t=>R("32",t),blue:t=>R("38;5;33",t)},h=class extends Error{constructor(e,o){super(e),this.name="FcxError",o&&(this.hint=o)}};function u(t,e){return t=String(t),t.length>=e?t:t+" ".repeat(e-t.length)}var Ye={ok:"OK",warn:"WARN",fail:"FAIL"};function k(t,e,o){let n=u(Ye[t]||String(t).toUpperCase(),4),i=`${t==="fail"?l.red(n):t==="warn"?l.yellow(n):l.green(n)}  ${e}`;o&&(i+=l.dim(`  (${o})`)),console.log(i)}function J(t){let e=t instanceof h?t.message:t&&t.message||String(t);process.stderr.write(`fcx: ${e}
`),t&&t.hint&&process.stderr.write(`fcx: hint: ${t.hint}
`),process.env.FCX_DEBUG&&t&&t.stack&&process.stderr.write(`${t.stack}
`)}function w(t,e=[]){let o=[],n={};for(let s=0;s<t.length;s++){let i=t[s];if(i==="--"){o.push(...t.slice(s+1));break}if(i.startsWith("--")){let a=i.indexOf("=");if(a>-1){n[i.slice(2,a)]=i.slice(a+1);continue}let c=i.slice(2);if(e.includes(c)){let r=t[s+1];if(r===void 0)throw new h(`Option --${c} needs a value.`);n[c]=r,s+=1}else n[c]=!0;continue}if(i.startsWith("-")&&i.length>1){let a=i.slice(1);if(e.includes(a)){let c=t[s+1];if(c===void 0)throw new h(`Option -${a} needs a value.`);n[a]=c,s+=1}else n[a]=!0;continue}o.push(i)}return{positionals:o,flags:n}}var Ie="https://stromplayz.github.io/FocusCaseX",Oe="https://focuscasex.vercel.app",Z=`FocusCaseX CLI \u2014 install and host the FocusCaseX registry anywhere.

Usage:
  fcx <command> [options]

Commands:
  doctor [--offline]                             Environment checklist for the clinic machine
  sync                                           Download the marketplace catalog into the local cache
  activate                                       Exchange the owner-issued code for a device licence
  status                                         Show this device's licence and check it with the registry
  update                                         Check the registry for a newer CLI and print the install command
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
                                                 (default: ${Ie})
  FCX_ORIGIN                                     Activation API origin (default: https://focuscasex.vercel.app)
  FCX_HOME                                       Workspace root (default: ~/.focuscasex)

Files:
  ~/.focuscasex/activation.json                  Device licence token \u2014 internal, not synced
  ~/.focuscasex/device.uuid                      Stable machine id used by fcx activate
  ~/.focuscasex/cache/catalog.json               Synced marketplace catalog
  ~/.focuscasex/workspace/<id>/                  Installed workbench mirrors

Marketplace: ${Ie}
Workspace:   ${Oe}
`,Ze=`Usage: fcx workbench <subcommand> [options]

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
`,f={doctor:`Usage: fcx doctor [--offline]

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
`,activate:`Usage: fcx activate

Activates this machine against the FocusCaseX licence registry with
your clinic email + password and the owner-issued activation code.
All three are prompted for; the code accepts FCX-XXXXXX, FCX XXXXXX
or 6 bare digits, pasted with or without whitespace.

On success the device licence is written to
~/.focuscasex/activation.json (mode 0600 \u2014 internal to this machine,
never synced). Same device never re-asks after activation.

Override the activation API origin with FCX_ORIGIN (tests).
`,status:`Usage: fcx status

Prints this device's saved licence (email, deviceId, label, platform,
activated at) and re-checks it against the activation registry.

Exit code 1 when the device was revoked by the owner. Network
problems are warnings, not crashes \u2014 the saved licence stays on the
machine.
`,update:`Usage: fcx update

Compares this CLI against the registry's catalog.json (the cli block:
version + install command) and prints the registry's one-line installer
when a newer build is published:

  curl -fsSL https://stromplayz.github.io/FocusCaseX/install.sh | bash

That line replaces the fcx binary with the registry's dist bundle \u2014 no
package manager involved. When this build is current, fcx update says
so. Network problems are warnings, not crashes (exit code 0).

Override the registry base URL with FCX_MARKET_URL.
`,catalog:`Usage: fcx catalog [kind] [--json]

Lists the cached catalog items with their install code, kind and name.
If no cache exists yet, the catalog is synced first (when the network is
available).

Options:
  [kind]        Filter by item kind, e.g. capsule, theme, template, workbench
  --json        Dump the listing as JSON
  --help, -h    Show this help
`,workbench:Ze,serve:`Usage: fcx serve [--port 4319]

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

Opens ${Oe} \u2014 the full FocusCaseX workspace, same
features as the Android app \u2014 in the default browser.

macOS uses open, Linux xdg-open, Windows start. If no launcher exists,
the URL is printed instead.
`,mcp:`Usage: fcx mcp

Prints the FocusCaseX MCP server URL, the pairing flow (6-digit code + QR
from the app's Settings -> MCP) and setup snippets for eight agents:
Claude Code, Claude Desktop, Cursor, Windsurf, VS Code, Cline,
Gemini CLI and Codex CLI.
`};var le={};S(le,{run:()=>it});import ee from"node:fs";import Qe from"node:fs";import et from"node:os";import N from"node:path";var v=process.env.FCX_HOME?N.resolve(process.env.FCX_HOME):N.join(et.homedir(),".focuscasex");function se(){return N.join(v,"cache")}function y(){return N.join(se(),"catalog.json")}function Ne(){return N.join(v,"workspace")}function A(t){return Qe.mkdirSync(t,{recursive:!0}),t}function P(t,e){let o=N.resolve(t),n=N.resolve(o,String(e).replace(/^\/+/,""));if(n!==o&&!n.startsWith(o+N.sep))throw new h(`Refusing to write outside ${o} \u2014 check the bundle paths.`);return n}import Le from"node:fs";var tt="https://stromplayz.github.io/FocusCaseX";function L(){return(String(process.env.FCX_MARKET_URL||"").trim()||tt).replace(/\/+$/,"")}function O(){return`${L()}/catalog.json`}var X="Check the network, or set FCX_MARKET_URL to your own registry mirror. Run fcx sync once the marketplace is reachable.";async function re(t,{timeoutMs:e=1e4,method:o="GET"}={}){let n;try{n=await fetch(t,{method:o,redirect:"follow",signal:AbortSignal.timeout(e)})}catch(s){let i=s&&s.name==="TimeoutError"?"timed out":s&&s.message||"network error";throw new h(`Network error fetching ${t} (${i}).`,X)}if(!n.ok)throw new h(`HTTP ${n.status} ${n.statusText||""} \u2014 ${t}`.trim(),X);try{return await n.text()}catch(s){throw new h(`Could not read the response from ${t} (${s&&s.message}).`,X)}}async function Q(t,e={}){let o=await re(t,e);try{return JSON.parse(o)}catch{throw new h(`Invalid JSON from ${t}.`,X)}}async function ie({timeoutMs:t=1e4}={}){let e=await Q(O(),{timeoutMs:t});if(!e||!Array.isArray(e.items))throw new h(`${O()} returned no items array \u2014 not a FocusCaseX catalog.`);return ot(e),e}function ot(t){A(se()),Le.writeFileSync(y(),JSON.stringify(t,null,2)+`
`)}function ae(){let t;try{t=Le.readFileSync(y(),"utf8")}catch{return null}try{return JSON.parse(t)}catch{return{__unreadable:!0}}}async function _({autoSync:t=!0}={}){let e=ae();if(e&&!e.__unreadable)return e;if(t)try{return await ie()}catch(o){throw e&&e.__unreadable?new h(`Cached catalog at ${y()} is unreadable and the marketplace is unreachable (${o.message}).`,o.hint||X):new h(`No cached catalog yet and the marketplace is unreachable \u2014 ${o.message}`,o.hint||X)}throw e&&e.__unreadable?new h(`Cached catalog at ${y()} is unreadable.`,"Run fcx sync."):new h(`No cached catalog at ${y()}.`,"Run fcx sync.")}function j(t){let e=Array.isArray(t&&t.items)?t.items:[],o=Array.isArray(t&&t.workbenches)?t.workbenches:e.filter(s=>s&&s.kind==="workbench"),n=Array.isArray(t&&t.snippets)?t.snippets:[];return{items:e.length,workbenches:o.length,snippets:n.length}}function z(t){return Array.isArray(t&&t.workbenches)&&t.workbenches.length?t.workbenches:(Array.isArray(t&&t.items)?t.items:[]).filter(e=>e&&e.kind==="workbench")}function nt(t){let e=t&&t.files&&t.files.bundle;if(!e)throw new h(`Workbench "${t&&t.id||"?"}" has no bundle file listed in the catalog.`);return`${L()}/${String(e).replace(/^\/+/,"")}`}function K(t,e={}){return Q(nt(t),e)}var ce=18;function st(t){let e=Math.max(1,Math.floor((Date.now()-t)/1e3));if(e<60)return`${e}s ago`;let o=Math.floor(e/60);if(o<60)return`${o}m ago`;let n=Math.floor(o/60);return n<24?`${n}h ago`:`${Math.floor(n/24)}d ago`}async function rt(){let t=O();try{let e=await fetch(t,{method:"HEAD",redirect:"follow",signal:AbortSignal.timeout(5e3)});return e.ok||(e=await fetch(t,{method:"GET",redirect:"follow",signal:AbortSignal.timeout(5e3)})),e.ok?{status:"ok",message:`Marketplace reachable \u2014 ${L()}`}:{status:"warn",message:"offline \u2014 cached catalog will be used",note:`marketplace answered HTTP ${e.status}`}}catch(e){return{status:"warn",message:"offline \u2014 cached catalog will be used",note:e&&e.message||"network error"}}}async function it(t){let{flags:e}=w(t);if(e.help||e.h){process.stdout.write(f.doctor);return}console.log(l.bold("FocusCaseX doctor")),console.log(l.dim(`focuscasex ${b}`)),console.log("");let o=[];{let a=Number(process.versions.node.split(".")[0]);o.push(a>=ce?{status:"ok",message:`Node ${process.versions.node} (>= ${ce} required)`}:{status:"fail",message:`Node ${process.versions.node} \u2014 Node >= ${ce} is required`})}try{ee.mkdirSync(v,{recursive:!0});let a=`${v}/.doctor-probe`;ee.writeFileSync(a,"ok"),ee.unlinkSync(a),o.push({status:"ok",message:`Workspace writable \u2014 ${v}`})}catch(a){o.push({status:"fail",message:`Workspace not writable \u2014 ${v}`,note:a&&a.message||"write failed"})}{let a=ae();if(a&&!a.__unreadable){let c=j(a),r="";try{r=`, synced ${st(ee.statSync(y()).mtimeMs)}`}catch{}o.push({status:"ok",message:`Cached catalog \u2014 ${c.items} items, ${c.workbenches} workbenches${r}`})}else a&&a.__unreadable?o.push({status:"warn",message:`Cached catalog unreadable \u2014 ${y()}`,note:"run fcx sync"}):o.push({status:"warn",message:`No cached catalog \u2014 ${y()}`,note:"run fcx sync"})}e.offline?o.push({status:"warn",message:"offline \u2014 cached catalog will be used",note:"--offline set"}):o.push(await rt()),console.log("");for(let a of o)k(a.status,a.message,a.note);let n=o.filter(a=>a.status==="ok").length,s=o.filter(a=>a.status==="warn").length,i=o.filter(a=>a.status==="fail").length;console.log(""),console.log(l.dim(`${n} ok, ${s} warn, ${i} fail`)),i>0&&(process.exitCode=1)}var pe={};S(pe,{run:()=>at});async function at(t){let{flags:e}=w(t);if(e.help||e.h){process.stdout.write(f.sync);return}console.log(l.bold("Syncing marketplace catalog")),console.log(l.dim(`  ${O()}`));let o=await ie(),n=j(o);console.log(""),console.log(`  ${u("saved",13)}${y()}`),console.log(`  ${u("items",13)}${n.items}`),console.log(`  ${u("workbenches",13)}${n.workbenches}`),n.snippets&&console.log(`  ${u("snippets",13)}${n.snippets}`)}var ge={};S(ge,{DEFAULT_ACTIVATION_ORIGIN:()=>Te,FRIENDLY_ERRORS:()=>je,activationOrigin:()=>he,activationPath:()=>B,deviceInfo:()=>Pe,deviceUuidPath:()=>Me,machineUuid:()=>Re,normalizeCode:()=>Xe,postActivation:()=>ue,readActivation:()=>me,run:()=>ut,saveActivation:()=>De,verifyActivation:()=>fe});import D from"node:fs";import C from"node:os";import _e from"node:path";import Fe from"node:crypto";import ct from"node:readline/promises";var Te="https://focuscasex.vercel.app",lt=15e3;function he(){return(String(process.env.FCX_ORIGIN||"").trim()||Te).replace(/\/+$/,"")}function B(){return _e.join(v,"activation.json")}function Me(){return _e.join(v,"device.uuid")}function Re(){let t=Me(),e="";try{e=D.readFileSync(t,"utf8").trim()}catch{e=""}if(!e){e=Fe.randomUUID(),A(v),D.writeFileSync(t,e+`
`,{mode:384});try{D.chmodSync(t,384)}catch{}}return e}function Pe(){let t=C.cpus(),e=Math.round(C.totalmem()/(1024*1024*1024)*10)/10,o=[C.hostname(),C.platform(),C.arch(),C.release(),String(t.length)].join("|"),n=Re(),s=Fe.createHash("sha256").update(o+n).digest("hex");return{hostname:C.hostname(),osPlatform:C.platform(),arch:C.arch(),osRelease:C.release(),cpuModel:t[0]?t[0].model:"",cpuCount:t.length,totalMemGb:e,machineHash:s,uuid:n}}function Xe(t){let e=String(t||"").replace(/\s+/g,"").toUpperCase(),o=e.match(/^FCX[-_/]?([A-Z0-9]{6})$/);return o?`FCX-${o[1]}`:/^\d{6}$/.test(e)?`FCX-${e}`:e}function de(t){let e=ct.createInterface({input:process.stdin,output:process.stdout});return e.question(t).finally(()=>e.close())}function pt(t){return process.stdin.isTTY?new Promise((e,o)=>{let n=process.stdin;process.stdout.write(t),n.setRawMode(!0),n.resume(),n.setEncoding("utf8");let s="",i=!1,a=r=>{if(!i){i=!0;try{n.setRawMode(!1)}catch{}n.pause(),n.removeListener("data",c),process.stdout.write(`
`),r instanceof Error?o(r):e(r)}},c=r=>{if(r==="\r"||r===`
`)return a(s);if(r==="")return a(new h("Cancelled."));if(r==="\x7F"||r==="\b"){s.length>0&&(s=s.slice(0,-1),process.stdout.write("\b \b"));return}r>="\0"&&r<" "||(s+=r,process.stdout.write("*"))};n.on("data",c),n.on("error",r=>a(r))}):de(t)}var je={BAD_CREDENTIALS:"Email or password is incorrect.",BAD_CODE:"That code is not valid for this email or has expired.",DEVICE_LIMIT:"This licence reached its device limit \u2014 contact FocusCaseX support to move a device.",DEVICE_REVOKED:"This device was removed from the licence by the owner.","registry-not-configured":"The licence registry is not configured yet \u2014 contact FocusCaseX support."},dt="Check the network, or set FCX_ORIGIN to your own activation registry.";async function ht(t,e,{timeoutMs:o=lt}={}){let n;try{n=await fetch(t,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(e),redirect:"follow",signal:AbortSignal.timeout(o)})}catch{throw new h("Activation service unreachable \u2014 check your connection.",dt)}let s=null;try{s=await n.json()}catch{s=null}return{status:n.status,json:s}}async function ue(t,e,o={}){return ht(`${he()}${t}`,e,o)}async function fe(t,e={}){return ue("/api/activation/verify",{token:t.token,deviceId:t.deviceId},e)}function De(t){A(v);let e=B();D.writeFileSync(e,JSON.stringify(t,null,2)+`
`,{mode:384});try{D.chmodSync(e,384)}catch{}return e}function me(){let t;try{t=D.readFileSync(B(),"utf8")}catch{return null}try{let e=JSON.parse(t);return e&&typeof e=="object"?e:null}catch{return{__unreadable:!0}}}async function ut(t){let{flags:e}=w(t);if(e.help||e.h){process.stdout.write(f.activate);return}console.log(l.bold("FocusCaseX activation")),console.log(l.dim(`  ${he()}/api/activation/activate`)),console.log("");let o=(await de("Email: ")).trim();if(!o||!o.includes("@"))throw new h("Enter a valid email address.");let n=await pt("Password: ");if(!n)throw new h("Enter the clinic account password.");let s=Xe(await de("Activation code (FCX-XXXXXX): "));if(!s)throw new h("Enter the activation code from the FocusCaseX owner.");let i={email:o,password:n,code:s,device:{platform:"cli",label:`CLI \u2014 ${C.hostname()}`,info:Pe()}},{status:a,json:c}=await ue("/api/activation/activate",i),r=c&&c.ok===!1?String(c.error||""):"";if(r){let p=je[r];throw p?new h(p):new h(`Activation failed \u2014 ${r} (HTTP ${a}).`)}if(!c||c.ok!==!0)throw new h(`The activation service answered with an unexpected response (HTTP ${a}).`);let d=De({token:c.token,deviceId:c.deviceId,email:c.email||o,label:c.label||i.device.label,platform:"cli",at:new Date().toISOString()});console.log(""),k("ok","Activated \u2014 this device is licensed."),console.log(""),console.log(`  ${u("email",10)}${d&&c.email||o}`),console.log(`  ${u("deviceId",10)}${c.deviceId||""}`),console.log(`  ${u("label",10)}${c.label||i.device.label}`),console.log(`  ${u("saved to",10)}${d}`),console.log(""),console.log(l.dim("  Check it any time with fcx status. This device will not be asked again."))}var we={};S(we,{run:()=>ft});function Ue(t){let e=t?new Date(t):null;return e&&!Number.isNaN(e.getTime())?e.toISOString():"unknown"}async function ft(t){let{flags:e}=w(t);if(e.help||e.h){process.stdout.write(f.status);return}let o=me();if(!o||o.__unreadable){o&&o.__unreadable?(console.log("Not activated \u2014 run fcx activate."),console.log(l.dim(`  (the file at ${B()} could not be read \u2014 activate again)`))):console.log("Not activated \u2014 run fcx activate.");return}console.log(l.bold("FocusCaseX device licence")),console.log(""),console.log(`  ${u("email",12)}${o.email||""}`),console.log(`  ${u("deviceId",12)}${o.deviceId||""}`),console.log(`  ${u("label",12)}${o.label||""}`),console.log(`  ${u("platform",12)}${o.platform||"cli"}`),console.log(`  ${u("activated",12)}${Ue(o.at)}`);let n;try{n=await fe(o)}catch(i){console.log(""),k("warn","Licence service unreachable \u2014 status not checked.",i&&i.message||"network error");return}let s=n.json&&n.json.ok===!1?String(n.json.error||""):"";if(s){console.log(""),console.log(s==="REVOKED"?l.red("This device was revoked by the owner \u2014 run fcx activate with a new code."):l.red("The licence registry has no record of this device \u2014 run fcx activate with a new code.")),process.exitCode=1;return}if(n.json&&n.json.ok===!0){console.log(""),console.log(`  ${u("checked",12)}${Ue(new Date().toISOString())}`),k("ok","Licence verified with the registry.");return}console.log(""),k("warn","The registry answered with an unexpected response.",`HTTP ${n.status}`)}var ke={};S(ke,{registryInstallCommand:()=>Ge,run:()=>mt,versionGt:()=>He});function He(t,e){try{let o=String(t).trim().split("."),n=String(e).trim().split("."),s=Math.max(o.length,n.length);for(let i=0;i<s;i++){let a=Number.parseInt(i<o.length?o[i]:"0",10)||0,c=Number.parseInt(i<n.length?n[i]:"0",10)||0;if(a!==c)return a>c}return!1}catch{return!1}}function Ge(){return`curl -fsSL ${L()}/install.sh | bash`}async function mt(t){let{flags:e}=w(t);if(e.help||e.h){process.stdout.write(f.update);return}console.log(l.bold("FocusCaseX CLI update")),console.log(l.dim(`  ${O()}`)),console.log(""),console.log(`  ${u("installed",11)}focuscasex ${b}`);let o;try{o=await Q(O(),{timeoutMs:1e4})}catch(i){console.log(""),k("warn","Couldn't reach the registry \u2014 update not checked.",i&&i.message||"network error");return}let n=o&&typeof o=="object"?o.cli:null,s=n&&n.version?String(n.version).trim():"";if(!s){console.log(""),k("warn","The catalog lists no CLI release \u2014 nothing to compare against.","the registry may not be published yet");return}if(console.log(`  ${u("registry",11)}focuscasex ${s}`),!He(s,b)){console.log(""),k("ok",`You're up to date \u2014 focuscasex ${b} is the registry's current release.`);return}console.log(""),console.log(l.yellow("UPDATE")+`  New release \u2014 focuscasex ${s} (you have ${b}).`),console.log(""),console.log("  Paste this into a terminal to update:"),console.log(""),console.log(l.bold(`    ${Ge()}`)),console.log(""),console.log(l.dim("  The installer replaces the fcx binary with the registry's dist bundle."))}var be={};S(be,{run:()=>yt});var ye="23456789ABCDEFGHJKMNPQRSTUVWXYZ";function gt(t){let e=2166136261;for(let o=0;o<t.length;o++)e^=t.charCodeAt(o),e=Math.imul(e,16777619);return e>>>0}function E(t){let e=gt(String(t||"")),o="";for(let n=0;n<6;n++)o+=ye[e%ye.length],e=Math.floor(e/ye.length)+(e>>>16);return"FCX-"+o}var wt={extension:"plugin",plugin:"plugin",capsule:"capsule",template:"template",snippet:"snippet",theme:"theme",workbench:"workbench",page:"page"};function T(t,e){let o=wt[t]||t||"item";return E(`${o}:${e}`)}function kt(t){let e=String(t||"").toUpperCase().replace(/[^0-9A-Z]/g,"");return e.startsWith("FCX")&&(e=e.slice(3)),e.length===6&&/^[0-9A-Z]{6}$/.test(e)?e:null}function te(t,e){let o=String(t||"").trim();if(!o||!e.length)return null;let n=o.match(/^fcx:\/\/install\?id=([\w:%-]+)$/i)||o.match(/[?&]id=([\w:%-]+)/i);if(n){let d=n[1];try{d=decodeURIComponent(d)}catch{}let p=e.find(m=>m.id===d);if(p)return{item:p}}if(/^(workbench|plugin|capsule|theme|template|snippet):[\w-]+$/.test(o)){let d=e.find(p=>p.id===o);if(d)return{item:d}}let s=kt(o);if(s){let d=e.find(p=>E(p.id)==="FCX-"+s);if(d)return{item:d}}let i=e.find(d=>d.id===o);if(i)return{item:i};let a=o.toLowerCase(),c=e.filter(d=>String(d.name||"").toLowerCase().includes(a));if(c.length===1)return{item:c[0]};if(c.length>1)return{matches:c};let r=a.split(/[^a-z0-9]+/).filter(Boolean);if(r.length){let d=e.filter(p=>{let m=`${String(p.name||"").toLowerCase().replace(/[^a-z0-9]+/g," ")} ${String(p.id||"").toLowerCase().replace(/[^a-z0-9]+/g," ")}`;return r.every($=>m.includes($))});if(d.length===1)return{item:d[0]};if(d.length>1)return{matches:d}}return null}async function yt(t){let{positionals:e,flags:o}=w(t);if(o.help||o.h){process.stdout.write(f.catalog);return}let n=await _(),s=Array.isArray(n.items)?n.items.slice():[],i=e[0];if(i){let r=i.toLowerCase();s=s.filter(d=>String(d&&d.kind||"").toLowerCase()===r)}if(o.json){console.log(JSON.stringify(s.map(r=>({id:r.id,kind:r.kind,name:r.name,code:E(r.id)})),null,2));return}if(!s.length){console.log(i?`No catalog items with kind "${i}".`:"The catalog is empty \u2014 run fcx sync.");return}let a=10,c=9;console.log(l.dim(u("CODE",a+2)+u("KIND",c+2)+"NAME"));for(let r of s){let d=E(r.id),p=String(r.kind||"-"),m=String(r.name||r.id||"-").split(`
`)[0];console.log(u(d,a+2)+u(p,c+2)+m)}console.log(l.dim(`
${s.length} item${s.length===1?"":"s"}${i?` \xB7 kind ${i}`:""} \xB7 fcx workbench show <id-or-code> for details`))}var ve={};S(ve,{run:()=>Et});import V from"node:fs";import F from"node:path";function ze(t,e){let o=z(e),n=te(t,o);if(n&&n.item)return n.item;if(n&&n.matches&&n.matches.length>1){process.stderr.write(`fcx: "${t}" matches ${n.matches.length} workbenches:
`);for(let s of n.matches)process.stderr.write(`  ${E(s.id)}  ${s.id}  ${s.name}
`);throw new h("Be more specific \u2014 use the exact id or the install code.")}throw new h(`No workbench matches "${t}".`,"Run fcx workbench list to see the available workbenches.")}function xe(t){return t.help||t.h?(process.stdout.write(f.workbench),!0):!1}async function bt(t){let{flags:e}=w(t);if(xe(e))return;let o=await _(),n=z(o);if(!n.length){console.log("No workbenches in the catalog yet.");return}if(e.json){console.log(JSON.stringify(n.map(a=>({id:a.id,name:a.name,code:T("workbench",a.id),description:a.tagline||a.description||""})),null,2));return}let s=10,i=Math.max(...n.map(a=>String(a.id||"-").length))+2;console.log(l.dim(u("CODE",s+2)+u("ID",i)+"NAME"));for(let a of n){console.log(u(E(a.id),s+2)+u(String(a.id||"-"),i)+String(a.name||"-"));let c=String(a.tagline||a.description||"").split(`
`)[0];c&&console.log(l.dim(" ".repeat(s+2+i)+c))}console.log(l.dim(`
${n.length} workbench${n.length===1?"":"es"} \xB7 fcx workbench show <id-or-code> for details`))}function xt(t,e){let o=new Map,n=t&&t.meta||{};for(let r of Array.isArray(n.list)?n.list:[])r&&r.kind&&r.id&&o.set(`${r.kind}:${r.id}`,r.name||r.id);let s=(r,d,p)=>o.get(`${r}:${d}`)||p||d,i=e&&e.contents||{},a=r=>Array.isArray(r)?r:[];return[{title:"EXTENSIONS",kind:"extension",entries:a(i.extensions).map(r=>({name:s("extension",r.id,r.name||r.id),code:T("extension",r.id),version:r.version}))},{title:"CAPSULES",kind:"capsule",entries:a(i.capsules).map(r=>({name:s("capsule",r.id,r.name||r.id),code:T("capsule",r.id),version:r.version}))},{title:"THEME",kind:"theme",entries:i.theme&&i.theme.id?[{name:s("theme",i.theme.id,i.theme.theme&&i.theme.theme.name||i.theme.id),code:T("theme",i.theme.id)}]:[]},{title:"TEMPLATES",kind:"template",entries:a(i.templates).map(r=>({name:s("template",r.id,r.name||r.id),code:T("template",r.id),version:r.version}))},{title:"SNIPPETS",kind:"snippet",entries:a(i.snippets).map(r=>({name:s("snippet",r.name||r.id,r.name||r.id),code:T("snippet",r.name||r.id)}))},{title:"PAGES",kind:"page",entries:a(i.starterPages).map(r=>({name:r.title?`${r.path||r.title} \u2014 ${r.title}`:String(r.path||"page"),code:null}))}].filter(r=>r.entries.length>0)}function vt(t,e){let o=t&&t.meta||{},n=xt(t,e),s=n.reduce((r,d)=>r+d.entries.length,0)+(e.contents&&e.contents.settings?1:0),a=[`install code ${E(t.id)}`];(e.version||t.version)&&a.push(`version ${e.version||t.version}`),(t.author||e.author)&&a.push(`author ${t.author||e.author}`),t.category&&a.push(`category ${t.category}`),console.log(l.bold(`${t.name||e.name} \u2014 ${t.id}`)),console.log(l.dim(a.join(" \xB7 "))),console.log("");let c=String(t.description||e.description||"").trim();c&&console.log(c),console.log(""),console.log(l.bold(`Contents \u2014 ${s} items`)),console.log("");for(let r of n){let d=Math.min(Math.max(...r.entries.map(p=>p.name.length)),44)+2;console.log(l.bold(`${r.title} (${r.entries.length})`));for(let p of r.entries){let m=[`  ${u(p.name.slice(0,44),d)}`];p.code&&m.push(u(p.code,12)),p.version&&m.push(` v${p.version}`),console.log(m.join("").replace(/\s+$/,""))}console.log("")}e.contents&&e.contents.settings&&(console.log(l.bold("SETTINGS (1)")),console.log("  Editor, appearance and snippet defaults ship with the bundle."),console.log(""))}async function $t(t){let{positionals:e,flags:o}=w(t);if(xe(o))return;if(!e.length){process.stderr.write(`fcx: workbench show needs an id or install code

`),process.stderr.write(f.workbench),process.exitCode=1;return}let n=await _(),s=ze(e[0],n),i=await K(s);vt(s,i)}var We=new Set(["file","main","manifest","bundle","css","cssSnippet","src","asset"]);function Je(t){return typeof t=="string"&&t.length>0&&!/^\s/.test(t)&&!/\s$/.test(t)&&!t.includes(" ")&&!/^[a-z]+:\/\//i.test(t)&&/\.[A-Za-z0-9]{1,6}$/.test(t)}function Ct(t){let e=new Set,o=t&&t.contents||{},n=["extensions","capsules","templates","snippets"];for(let i of n)for(let a of Array.isArray(o[i])?o[i]:[])if(!(!a||typeof a!="object"))for(let[c,r]of Object.entries(a))We.has(c)&&Je(r)&&e.add(r);let s=o.theme&&o.theme.theme;if(s&&typeof s=="object")for(let[i,a]of Object.entries(s))We.has(i)&&Je(a)&&e.add(a);return[...e]}function St(t){let e=t&&t.contents||{},o=[];for(let n of Array.isArray(e.extensions)?e.extensions:[])o.push({kind:"extension",id:n.id,name:n.id});for(let n of Array.isArray(e.capsules)?e.capsules:[])o.push({kind:"capsule",id:n.id,name:n.id});e.theme&&e.theme.id&&o.push({kind:"theme",id:e.theme.id,name:e.theme.id});for(let n of Array.isArray(e.templates)?e.templates:[])o.push({kind:"template",id:n.id,name:n.id});for(let n of Array.isArray(e.snippets)?e.snippets:[])o.push({kind:"snippet",id:n.name||n.id,name:n.name||n.id});return Array.isArray(e.starterPages)&&e.starterPages.length&&o.push({kind:"pages",name:`${e.starterPages.length} starter pages`}),o}async function At(t){let{positionals:e,flags:o}=w(t,["dir"]);if(xe(o))return;if(!e.length){process.stderr.write(`fcx: workbench install needs an id or install code

`),process.stderr.write(f.workbench),process.exitCode=1;return}let n=await _(),s=ze(e[0],n),i=await K(s),a=i&&i.id||s.meta&&s.meta.workbenchId||String(s.id||"workbench").replace(/[^A-Za-z0-9._-]+/g,"-"),c=o.dir?F.resolve(String(o.dir)):F.join(Ne(),a);A(c),V.writeFileSync(P(c,"workbench.json"),JSON.stringify(i,null,2)+`
`);let r=Array.isArray(i.contents&&i.contents.starterPages)?i.contents.starterPages:[],d=0;for(let g of r){if(!g||!g.path||typeof g.content!="string")continue;let x=P(F.join(c,"pages"),g.path);A(F.dirname(x)),V.writeFileSync(x,g.content.endsWith(`
`)?g.content:`${g.content}
`),d+=1}let p=i.contents&&i.contents.theme;if(p&&p.theme){let g=P(F.join(c,"theme"),`${p.id||"theme"}.json`);A(F.dirname(g)),V.writeFileSync(g,JSON.stringify(p.theme,null,2)+`
`)}let m=i.contents&&i.contents.settings;m&&V.writeFileSync(P(c,"settings.json"),JSON.stringify(m,null,2)+`
`);let $=0;for(let g of Ct(i))try{let x=await re(`${L()}/${String(g).replace(/^\/+/,"")}`),W=P(F.join(c,"files"),g);A(F.dirname(W)),V.writeFileSync(W,x),$+=1}catch{}let I=Array.isArray(s.meta&&s.meta.list)&&s.meta.list.length?s.meta.list:St(i);console.log(l.bold(`Installing ${s.name||s.id}`)),console.log(l.dim(`  ${s.id} \xB7 install code ${E(s.id)}`)),console.log(l.dim(`  destination  ${c}`)),console.log("");let G=0;for(let g of I){if(!g)continue;let x="ok",W="";g.kind==="pages"&&(W=`${d}/${r.length} pages written`,d<r.length&&(x="warn")),x==="warn"&&(G+=1),k(x,u(String(g.kind||"item"),10)+String(g.name||g.id||"-"),W)}m&&k("ok",u("settings",10)+"Editor + appearance defaults"),$&&k("ok",u("files",10)+`${$} referenced file${$===1?"":"s"} fetched`),console.log("");let Y=I.length+(m?1:0);console.log(`Installed ${Y} items into ${c}`),console.log(l.dim("Local workspace mirror \u2014 this does not touch any app data.")),G>0&&(process.exitCode=1)}async function Et(t){let[e,...o]=t;if(!e||e==="--help"||e==="-h"||e==="help"){process.stdout.write(f.workbench);return}if(e==="list")return bt(o);if(e==="show")return $t(o);if(e==="install")return At(o);process.stderr.write(`fcx: unknown workbench subcommand "${e}"

`),process.stderr.write(f.workbench),process.exitCode=1}var $e={};S($e,{run:()=>Ft});import It from"node:http";import Ot from"node:os";function M(t,e,o){t.writeHead(e,{"content-type":"application/json; charset=utf-8"}),t.end(JSON.stringify(o,null,2)+`
`)}function oe(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Nt(){let t=[],e=Ot.networkInterfaces();for(let o of Object.keys(e))for(let n of e[o]||[])n&&n.family==="IPv4"&&!n.internal&&t.push(n.address);return t}function Lt(t,e,o){let n=e.map(s=>{let i=`/api/workbenches/${encodeURIComponent(s.id||"")}`,a=oe(s.meta&&s.meta.code||""),c=oe(String(s.tagline||s.description||"").split(`
`)[0]);return`    <div class="card">
      <h2><a href="${i}">${oe(s.name||s.id)}</a></h2>
      <p>${c}</p>
      <p><span class="code">${a}</span> <a href="${i}">bundle JSON</a></p>
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
  <p class="sub">Local marketplace mirror served by focuscasex ${oe(b)} \u2014 ${o.items} items, ${o.workbenches} workbenches.</p>
${n}
  <div class="footer">
    Endpoints: <a href="/health">/health</a> \xB7 <a href="/api/catalog">/api/catalog</a> \xB7
    <a href="/api/workbenches">/api/workbenches</a> \xB7 /api/workbenches/&lt;id&gt;
  </div>
</body>
</html>
`}function _t(t,e){let o=String(t||"").trim(),n=te(o,e);if(n&&n.item)return n.item;if(n&&n.matches&&n.matches.length)return n.matches[0];let s=/^workbench:/i.test(o)?o:`workbench:${o}`;return e.find(i=>i.id===s)||null}async function Ft(t){let{flags:e}=w(t,["port"]);if(e.help||e.h){process.stdout.write(f.serve);return}let o=e.port?Number(e.port):4319;if(!Number.isInteger(o)||o<1||o>65535)throw new h(`Invalid port "${e.port}" \u2014 use 1-65535.`);let n=await _(),s=j(n),i=z(n),a=new Map,c=It.createServer(async(p,m)=>{try{let I=new URL(p.url||"/","http://localhost").pathname;if(I==="/health")return M(m,200,{ok:!0,name:"focuscasex-registry",version:b,items:s.items,workbenches:s.workbenches,catalog:y(),uptime_s:Math.floor(process.uptime())});if(I==="/api/catalog")return M(m,200,n);if(I==="/api/workbenches")return M(m,200,i);let G=I.match(/^\/api\/workbenches\/(.+)$/);if(G){let Y=decodeURIComponent(G[1]),g=_t(Y,i);if(!g)return M(m,404,{ok:!1,error:`No workbench matches "${Y}"`});let x=a.get(g.id);return x||(x=await K(g),a.set(g.id,x)),M(m,200,x)}return I==="/"||I==="/index.html"?(m.writeHead(200,{"content-type":"text/html; charset=utf-8"}),m.end(Lt(n,i,s))):M(m,404,{ok:!1,error:"not found"})}catch($){return M(m,502,{ok:!1,error:$&&$.message||String($)})}});c.on("error",p=>{p&&p.code==="EADDRINUSE"?J(new h(`Port ${o} is already in use \u2014 try fcx serve --port ${o+1}.`)):J(new h(`Server error: ${p&&p.message||p}`)),process.exit(1)}),await new Promise(p=>c.listen(o,"0.0.0.0",p)),console.log(l.bold("FocusCaseX registry server")),console.log(l.dim(`  focuscasex ${b} \u2014 serving the synced marketplace catalog`)),console.log(`  catalog   ${y()} (${s.items} items, ${s.workbenches} workbenches)`),console.log(""),console.log(`  Local     http://localhost:${o}`);for(let p of Nt())console.log(`  LAN       http://${p}:${o}`);console.log(""),console.log(l.dim("  GET /health                  server health")),console.log(l.dim("  GET /api/catalog             full marketplace catalog")),console.log(l.dim("  GET /api/workbenches         workbench list")),console.log(l.dim("  GET /api/workbenches/<id>    workbench bundle JSON")),console.log(l.dim("  GET /                        HTML index")),console.log(""),console.log("  Ctrl+C to stop");let r=!1,d=()=>{r||(r=!0,console.log(`
Registry server stopped.`),c.close(()=>process.exit(0)),setTimeout(()=>process.exit(0),500).unref())};process.on("SIGINT",d),process.on("SIGTERM",d)}var Ce={};S(Ce,{WORKSPACE_URL:()=>ne,run:()=>Rt});import{spawn as Tt}from"node:child_process";var ne="https://focuscasex.vercel.app";function Mt(t){return new Promise(e=>{let o,n;process.platform==="darwin"?(o="open",n=[t]):process.platform==="win32"?(o="cmd",n=["/c","start","",t]):(o="xdg-open",n=[t]);try{let s=Tt(o,n,{stdio:"ignore",detached:!0});s.on("spawn",()=>{s.unref(),e(!0)}),s.on("error",()=>e(!1))}catch{e(!1)}})}async function Rt(t){let{flags:e}=w(t);if(e.help||e.h){process.stdout.write(f.open);return}console.log(`Opening ${ne}`),console.log("(the full FocusCaseX workspace \u2014 same features as the Android app)"),await Mt(ne)||console.log(`Could not open a browser on this machine. Open manually: ${ne}`)}var Ae={};S(Ae,{MCP_URL:()=>q,PAIR_URL:()=>Ke,mcpText:()=>Be,run:()=>Pt});var q="https://focuscasex.vercel.app/api/mcp/server",Ke="https://focuscasex.vercel.app/api/mcp/pair",Se="<your-token>";function U(t){return JSON.stringify({mcpServers:{focuscasex:{[t]:q,headers:{Authorization:`Bearer ${Se}`}}}},null,2)}function H(t){return t.split(`
`).map(e=>`  ${e}`).join(`
`)}function Be(){return["FocusCaseX MCP","",`Server URL    ${q}`,`Pairing URL   ${Ke}`,"","Pairing","  1. In the app: Settings -> MCP -> Connect agent. Enter the agent name and scopes, then Generate code.","  2. You get a 6-digit code (and a QR holding the same payload).","  3. The agent POSTs that code to the pairing URL with its name and requested scopes, then polls.","  4. Approve the pairing in the app. The agent gets the scopes you approved.","  5. Create a per-agent access token in Settings -> MCP and paste it into the snippets below as <your-token>.","  Every write lands in the app as a pending action you approve or deny.","","Agent setup (8)","","Claude Code \u2014 one command",`  claude mcp add --transport http focuscasex ${q} --header "Authorization: Bearer ${Se}"`,"","Claude Desktop \u2014 claude_desktop_config.json",H(U("url")),"","Cursor \u2014 .cursor/mcp.json",H(U("url")),"","Windsurf \u2014 ~/.codeium/windsurf/mcp_config.json",H(U("url")),"","VS Code \u2014 .vscode/mcp.json",H(U("url")),"","Cline \u2014 cline_mcp_settings.json (VS Code globalStorage/saoudrizwan.claude-dev/settings)",H(U("url")),"","Gemini CLI \u2014 ~/.gemini/settings.json",H(U("httpUrl")),"","Codex CLI \u2014 ~/.codex/config.toml","  [mcp_servers.focuscasex]",`  url = "${q}"`,`  http_headers = { "Authorization" = "Bearer ${Se}" }`,"","Tool catalog, pairing guide and automation recipes: https://stromplayz.github.io/FocusCaseX/mcp/"].join(`
`)+`
`}async function Pt(t){let{flags:e}=w(t);if(e.help||e.h){process.stdout.write(f.mcp);return}process.stdout.write(Be())}var Ee={doctor:le,sync:pe,activate:ge,status:we,update:ke,catalog:be,workbench:ve,serve:$e,open:Ce,mcp:Ae};async function Xt(){let t=process.argv.slice(2),e=t[0];if(!e){process.stdout.write(Z);return}if(e==="--version"||e==="-v"||e==="-V"||e==="version"){console.log(`focuscasex ${b}`);return}if(e==="--help"||e==="-h"||e==="help"){let n=t[1];n&&Ee[n]?process.stdout.write(f[n]):n&&n==="version"?console.log(`Usage: fcx version

Prints "focuscasex ${b}". Same as fcx --version.`):process.stdout.write(Z);return}if(e.startsWith("-")&&e!=="-")throw new h(`Unknown option "${e}" \u2014 run fcx --help for the command list.`);if(!Ee[e]){process.stderr.write(`fcx: unknown command "${e}"

`),process.stderr.write(Z),process.exitCode=1;return}let o=t.slice(1);await Ee[e].run(o)}Xt().catch(t=>{J(t),process.exit(process.exitCode||1)});
