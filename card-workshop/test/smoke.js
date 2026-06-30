#!/usr/bin/env node
/* Dependency-free headless smoke test for the Card Game Workshop.
   Loads the inline <script> behind a minimal DOM stub, then:
     - asserts the engine (deck building + poker evaluator) is correct
     - mounts every game once to confirm mount() doesn't throw
   Exit 0 = pass, 1 = fail. Mirrors the Ronin Survivor smoke-test approach. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

let fails = 0;
function test(name, fn){ try{ fn(); console.log('  ok  ', name); }catch(e){ fails++; console.log('  FAIL', name, '—', e.message); } }
function assert(c, m){ if(!c) throw new Error(m||'assertion failed'); }

// ---- minimal DOM stub -------------------------------------------------
function makeNode(tag){
  const node = {
    tag, _children:[], style:{}, dataset:{}, classList:new Set(),
    _cls:'', innerHTML:'', textContent:'', title:'', value:'', disabled:false, onclick:null, onchange:null,
  };
  node.classList = { _s:new Set(),
    add(...c){ c.forEach(x=>this._s.add(x)); }, remove(...c){ c.forEach(x=>this._s.delete(x)); },
    contains(c){ return this._s.has(c); }, toggle(c){ this._s.has(c)?this._s.delete(c):this._s.add(c); } };
  Object.defineProperty(node,'className',{ get(){ return node._cls; }, set(v){ node._cls=v; } });
  node.appendChild = ch => { node._children.push(ch); return ch; };
  node.append = (...ch)=> ch.forEach(c=>node._children.push(c));
  node.removeChild = ch => { node._children = node._children.filter(c=>c!==ch); };
  node.replaceWith = ()=>{};
  node.remove = ()=>{};
  node.addEventListener = (ev,cb)=>{ (node._ev||(node._ev={}))[ev]=cb; };
  node.setAttribute = ()=>{}; node.getAttribute = ()=>null;
  node.querySelector = () => makeNode('stub');       // permissive: any lookup returns a fresh node
  node.querySelectorAll = () => [];
  node.focus = ()=>{};
  return node;
}
const elements = {};
const document = {
  createElement: makeNode,
  getElementById: id => elements[id] || (elements[id]=makeNode('#'+id)),
  head: makeNode('head'), body: makeNode('body'),
  addEventListener: ()=>{},
};
const window = {};
const sandbox = { window, document, console, setTimeout:()=>0, clearTimeout:()=>{}, clearInterval:()=>{}, setInterval:()=>0, Math, Date };
sandbox.globalThis = sandbox;

// ---- extract and run the inline <script> ------------------------------
const html = fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
assert(m, 'could not find <script> block');
test('script loads without throwing', ()=>{
  vm.createContext(sandbox);
  vm.runInContext(m[1], sandbox, { filename:'card-workshop.js' });
  assert(window.__cw, 'window.__cw dev hatch missing');
});
const cw = window.__cw || {};

// ---- engine: deck building -------------------------------------------
test('standard deck = 52 unique cards', ()=>{
  const d = cw.makeDeck();
  assert(d.length===52, 'len '+d.length);
  assert(new Set(d.map(c=>c.id)).size===52, 'not unique');
});
test('A–J deck = 44, royals+jokers = 10', ()=>{
  const aj = cw.makeDeck({ranks:['A','2','3','4','5','6','7','8','9','10','J']});
  assert(aj.length===44, 'A-J len '+aj.length);
  const ro = cw.makeDeck({ranks:['K','Q'],jokers:2});
  assert(ro.length===10, 'royals len '+ro.length);
  assert(ro.filter(c=>c.joker).length===2, 'jokers');
});

// ---- engine: poker evaluator -----------------------------------------
const C = (r,s)=>cw.mkCard(r,s);
function nameOf(cards){ return cw.best7(cards).name; }
test('royal flush beats four of a kind', ()=>{
  const royal=[C('A','S'),C('K','S'),C('Q','S'),C('J','S'),C('10','S')];
  assert(cw.score5(royal)[0]===8, 'royal cat '+cw.score5(royal)[0]);
  const quads=[C('9','S'),C('9','H'),C('9','D'),C('9','C'),C('2','S')];
  assert(cw.cmpScore(cw.score5(royal),cw.score5(quads))>0, 'royal !> quads');
});
test('category names from best7 (5-of-7)', ()=>{
  // full house from 7
  assert(nameOf([C('K','S'),C('K','H'),C('K','D'),C('2','S'),C('2','H'),C('7','C'),C('9','D')])==='Full House');
  // flush
  assert(nameOf([C('2','H'),C('5','H'),C('9','H'),C('J','H'),C('K','H'),C('3','S'),C('4','C')])==='Flush');
  // wheel straight (A-2-3-4-5)
  assert(nameOf([C('A','S'),C('2','H'),C('3','D'),C('4','C'),C('5','S'),C('K','H'),C('Q','D')])==='Straight');
  // pair
  assert(nameOf([C('A','S'),C('A','H'),C('5','D'),C('9','C'),C('J','S'),C('2','H'),C('7','D')])==='Pair');
});
test('higher pair wins, kickers break ties', ()=>{
  const aces=cw.score5([C('A','S'),C('A','H'),C('5','D'),C('9','C'),C('J','S')]);
  const kings=cw.score5([C('K','S'),C('K','H'),C('5','D'),C('9','C'),C('J','S')]);
  assert(cw.cmpScore(aces,kings)>0, 'AA !> KK');
  const hiKick=cw.score5([C('A','S'),C('A','H'),C('K','D'),C('9','C'),C('2','S')]);
  const loKick=cw.score5([C('A','S'),C('A','H'),C('Q','D'),C('9','C'),C('2','S')]);
  assert(cw.cmpScore(hiKick,loKick)>0, 'kicker fail');
});

// ---- Kingmaker duel: the King ▸ Queen ▸ Wyld ▸ King cycle ----------------
test('fae duel cycle resolves correctly', ()=>{
  const fb=cw.faeBeats, K=s=>C('K',s), Q=s=>C('Q',s), W=()=>cw.mkJoker(1), W2=()=>cw.mkJoker(2);
  assert(fb(K('S'),Q('S'))>0, 'King should fell Queen');
  assert(fb(Q('S'),W())>0, 'Queen should bind the Wyld');
  assert(fb(W(),K('S'))>0, 'Wyld should topple King');
  // same rank → higher suit S>H>D>C
  assert(fb(K('S'),K('H'))>0 && fb(K('D'),K('C'))>0 && fb(Q('C'),Q('S'))<0, 'suit tiebreak');
  // two Wylds clash → tie
  assert(fb(W(),W2())===0, 'Wyld vs Wyld should tie');
  // antisymmetry across the cycle
  assert(fb(Q('S'),K('S'))<0 && fb(W(),Q('S'))<0 && fb(K('S'),W())<0, 'cycle antisymmetry');
});

// ---- games: mount every game without throwing -------------------------
test('every game has required fields', ()=>{
  assert(Array.isArray(cw.GAMES) && cw.GAMES.length>=4, 'GAMES count');
  cw.GAMES.forEach(g=>{ ['id','title','players','tag','blurb'].forEach(k=>assert(g[k]!=null,g.id+' missing '+k)); assert(typeof g.mount==='function', g.id+' mount'); });
});
cw.GAMES && cw.GAMES.forEach(g=>{
  test('mount(): '+g.id+' does not throw', ()=>{ const root=makeNode('root'); g.mount(root,{}); });
});

// ---- result -----------------------------------------------------------
console.log(fails ? `\n${fails} test(s) FAILED` : '\nAll smoke tests passed.');
process.exit(fails?1:0);
