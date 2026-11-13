(()=>{const $=x=>document.getElementById(x),c=$('renderCanvas');let eng,sc,cam,door,started=false,open=false,move={x:0,y:0},sens=.0025,run=false,ceilingLamp,flash,flashlight,flashOn=true,fpsLimit=60,lastFrame=0,quality='medium';function material(n,col){let m=new BABYLON.StandardMaterial(n,sc);m.diffuseColor=BABYLON.Color3.FromHexString(col);m.specularColor=new BABYLON.Color3(.06,.06,.06);return m}function box(n,p,s,m){let b=BABYLON.MeshBuilder.CreateBox(n,{width:s[0],height:s[1],depth:s[2]},sc);b.position.set(...p);b.material=m;return b}function build(){sc=new BABYLON.Scene(eng);sc.clearColor=new BABYLON.Color4(.018,.019,.022,1);sc.fogMode=BABYLON.Scene.FOGMODE_EXP2;sc.fogDensity=.012;sc.fogColor=new BABYLON.Color3(.025,.028,.035);cam=new BABYLON.UniversalCamera('player',new BABYLON.Vector3(0,1.65,-3.7),sc);cam.minZ=.05;cam.fov=.92;cam.rotation.y=Math.PI;cam.inputs.clear();let wood=material('aged wood','#40372c'),plaster=material('aged plaster','#48433b'),dark=material('dark timber','#211b16'),cloth=material('fabric','#29282a'),metal=material('metal','#8a7658');box('floor',[0,-.12,0],[12,.24,14],wood);box('ceiling',[0,3.5,0],[12,.2,14],dark);box('rear wall',[0,1.7,7],[12,3.5,.25],plaster);box('left wall',[-6,1.7,0],[.25,3.5,14],plaster);box('right wall',[6,1.7,0],[.25,3.5,14],plaster);box('doorway left',[-3.7,1.7,-7],[4.6,3.5,.25],plaster);box('doorway right',[3.7,1.7,-7],[4.6,3.5,.25],plaster);box('doorway lintel',[0,3.05,-7],[2.8,.8,.25],plaster);door=box('bedroom door',[0,1.35,-6.88],[2.7,2.7,.14],dark);let h=BABYLON.MeshBuilder.CreateSphere('handle',{diameter:.12},sc);h.position.set(.95,1.3,-6.78);h.material=metal;box('bed base',[-3.7,.42,-3.9],[3.1,.55,4.1],dark);box('mattress',[-3.7,.78,-3.9],[3,.28,4],cloth);box('pillow',[-3.7,1,-5.25],[1.2,.22,.65],plaster);
box('headboard',[-3.7,1.05,-6.02],[3.15,1.35,.18],dark);
let blanket=material('worn blanket','#55504a');box('folded blanket',[-3.7,.96,-3.1],[2.92,.13,1.05],blanket);
for(let x of [-5.05,-2.35])for(let z of [-5.55,-2.25]){let leg=box('bed leg',[x,.18,z],[.16,.36,.16],dark)}
box('bedside drawer',[-1.3,.45,-5.2],[.85,.9,.8],wood);box('drawer front',[-1.3,.48,-4.78],[.72,.22,.035],dark);
let bookPages=material('yellowed pages','#b6a47c');box('book pages',[-1.3,1.19,-5.2],[.43,.035,.29],bookPages);
box('wardrobe',[4.55,1.35,-4.8],[1.8,2.7,1.2],dark);box('wardrobe door seam',[4.55,1.35,-4.17],[.025,2.5,.02],metal);
box('window recess',[-5.84,2.05,-1.2],[.03,1.55,2.3],dark);box('window glass',[-5.81,2.05,-1.2],[.025,1.35,2.1],material('night glass','#17212b'));
box('window crossbar',[-5.77,2.05,-1.2],[.04,.07,2.15],metal);box('window mullion',[-5.77,2.05,-1.2],[.04,1.4,.07],metal);
box('nightstand',[-1.3,.55,-5.2],[.9,1.1,.8],dark);box('old book',[-1.3,1.14,-5.2],[.5,.08,.35],material('book','#71392c'));for(let i=0;i<6;i++){let q=box('broken board',[2.3+i*.3,.05,-2+i*.7],[1.1,.07,.14],dark);q.rotation.y=i*.29}for(let i=0;i<3;i++){let q=box('scattered book',[2.7+i*.5,.08,2+i*.45],[.42,.12,.32],material('book'+i,['#5b2923','#34404a','#665239'][i]));q.rotation.y=i*.5}box('hall floor',[0,-.13,-11],[7,.2,8],wood);box('hall left',[-3.5,1.6,-11],[.2,3.2,8],plaster);box('hall right',[3.5,1.6,-11],[.2,3.2,8],plaster);box('hall end',[0,1.6,-15],[7,3.2,.2],plaster);// Ceiling lamp fixture with a visible shade and glowing bulb
let fixtureMat=material('aged brass','#6e5735'),shadeMat=material('lamp shade','#a58a61');
let ceilingBase=BABYLON.MeshBuilder.CreateCylinder('ceiling lamp base',{height:.09,diameter:.38,tessellation:20},sc);ceilingBase.position.set(-1.8,3.35,-4.5);ceilingBase.material=fixtureMat;
let shade=BABYLON.MeshBuilder.CreateCylinder('ceiling lamp shade',{height:.28,diameterTop:.22,diameterBottom:.62,tessellation:24},sc);shade.position.set(-1.8,3.15,-4.5);shade.material=shadeMat;
let bulbMat=new BABYLON.StandardMaterial('warm bulb',sc);bulbMat.emissiveColor=new BABYLON.Color3(1,.65,.28);let bulb=BABYLON.MeshBuilder.CreateSphere('visible bulb',{diameter:.18},sc);bulb.position.set(-1.8,2.98,-4.5);bulb.material=bulbMat;
let amb=new BABYLON.HemisphericLight('ambient',new BABYLON.Vector3(0,1,0),sc);amb.intensity=.30;amb.diffuse=new BABYLON.Color3(.72,.75,.82);amb.groundColor=new BABYLON.Color3(.12,.11,.10);
ceilingLamp=new BABYLON.PointLight('warm ceiling lamp',new BABYLON.Vector3(-1.8,2.8,-4.5),sc);ceilingLamp.diffuse=new BABYLON.Color3(1,.72,.42);ceilingLamp.intensity=.72;ceilingLamp.range=8;
let bodyMat=material('flashlight black metal','#17191d'),rimMat=material('flashlight steel','#777b80'),glassMat=material('flashlight lens','#e8dfbd');
flashlight=new BABYLON.TransformNode('held flashlight',sc);flashlight.parent=cam;flashlight.position=new BABYLON.Vector3(.34,-.29,.62);flashlight.rotation.x=-.08;
let handle=BABYLON.MeshBuilder.CreateCylinder('flashlight handle',{height:.42,diameter:.105,tessellation:16},sc);handle.rotation.x=Math.PI/2;handle.parent=flashlight;handle.position.z=.02;handle.material=bodyMat;
let head=BABYLON.MeshBuilder.CreateCylinder('flashlight head',{height:.14,diameter:.17,tessellation:20},sc);head.rotation.x=Math.PI/2;head.parent=flashlight;head.position.z=.27;head.material=rimMat;
let lens=BABYLON.MeshBuilder.CreateCylinder('flashlight lens',{height:.012,diameter:.135,tessellation:20},sc);lens.rotation.x=Math.PI/2;lens.parent=flashlight;lens.position.z=.347;lens.material=glassMat;
let grip=BABYLON.MeshBuilder.CreateCylinder('flashlight grip',{height:.18,diameter:.112,tessellation:12},sc);grip.rotation.x=Math.PI/2;grip.parent=flashlight;grip.position.z=-.12;grip.material=bodyMat;
flash=new BABYLON.SpotLight('focused flashlight beam',cam.position,new BABYLON.Vector3(0,0,1),.38,14,sc);flash.parent=cam;flash.position=new BABYLON.Vector3(.34,-.27,.55);flash.intensity=2.1;flash.range=15;flash.diffuse=new BABYLON.Color3(1,.94,.82);flash.specular=new BABYLON.Color3(.75,.72,.64);
flash.angle=.38;
sc.onBeforeRenderObservable.add(()=>{flash.direction=cam.getDirection(BABYLON.Vector3.Forward());let t=performance.now()*.001;let bob=(Math.abs(move.x)+Math.abs(move.y)>.08)?Math.sin(t*9)*.012:0;flashlight.position.y=-.29+bob;flashlight.rotation.x=-.08+bob*.7;flash.position.x=.34+Math.sin(t*1.7)*.008;});}
let audioCtx=null,masterGain=null,lastStep=0,ambOsc=null;
function startAudio(){
 try{
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
  if(!audioCtx){audioCtx=new AC();masterGain=audioCtx.createGain();masterGain.gain.value=.22;masterGain.connect(audioCtx.destination);
   const osc=audioCtx.createOscillator(),gain=audioCtx.createGain(),filter=audioCtx.createBiquadFilter();
   osc.type='triangle';osc.frequency.value=48;filter.type='lowpass';filter.frequency.value=95;gain.gain.value=.10;
   osc.connect(filter);filter.connect(gain);gain.connect(masterGain);osc.start();ambOsc=osc;
  } else if(audioCtx.state==='suspended')audioCtx.resume();
 }catch(e){}
}
function sound(type){
 if(!audioCtx||!masterGain)return;
 const now=audioCtx.currentTime,osc=audioCtx.createOscillator(),g=audioCtx.createGain(),filter=audioCtx.createBiquadFilter();
 filter.type='lowpass';filter.frequency.value=type==='step'?170:500;
 osc.type=type==='step'?'triangle':'sawtooth';
 osc.frequency.setValueAtTime(type==='step'?72:105,now);
 osc.frequency.exponentialRampToValueAtTime(type==='step'?38:55,now+.12);
 g.gain.setValueAtTime(type==='step'?.0001:.0001,now);
 g.gain.exponentialRampToValueAtTime(type==='step'?.20:.10,now+.012);
 g.gain.exponentialRampToValueAtTime(.0001,now+.18);
 osc.connect(filter);filter.connect(g);g.connect(masterGain);osc.start(now);osc.stop(now+.2);
}
function interact(){if(!started)return;if(BABYLON.Vector3.Distance(cam.position,new BABYLON.Vector3(0,1.5,-6.8))<3.4){open=!open;door.rotation.y=open?-1.25:0;sound('door');$('hint').textContent=open?'الباب مفتوح… ادخل إلى الممر':'الباب مغلق';$('objective').textContent=open?'ادخل الممر':'افتح الباب'}else $('hint').textContent='اقترب من الباب أولاً'}function touch(){let st=$('stick'),kn=$('knob'),active=false,cx=0,cy=0;st.onpointerdown=e=>{active=true;st.setPointerCapture(e.pointerId);let r=st.getBoundingClientRect();cx=r.left+r.width/2;cy=r.top+r.height/2};st.onpointermove=e=>{if(!active)return;let x=e.clientX-cx,y=e.clientY-cy,l=Math.hypot(x,y),k=Math.min(34,l),a=Math.atan2(y,x);kn.style.left=34+Math.cos(a)*k+'px';kn.style.top=34+Math.sin(a)*k+'px';move={x:Math.cos(a)*k/34,y:Math.sin(a)*k/34}};let reset=()=>{active=false;move={x:0,y:0};kn.style.left='34px';kn.style.top='34px'};st.onpointerup=st.onpointercancel=reset;c.onpointerdown=e=>{if(e.clientX<innerWidth*.42)return;c.setPointerCapture(e.pointerId);c.dataset.x=e.clientX;c.dataset.y=e.clientY};c.onpointermove=e=>{if(!c.hasPointerCapture(e.pointerId)||c.dataset.x===undefined)return;let dx=e.clientX-Number(c.dataset.x),dy=e.clientY-Number(c.dataset.y);cam.rotation.y+=dx*sens;cam.rotation.x=Math.max(-1.2,Math.min(1.2,cam.rotation.x+dy*sens));c.dataset.x=e.clientX;c.dataset.y=e.clientY};c.onpointerup=()=>{delete c.dataset.x;delete c.dataset.y};$('interact').onclick=interact;$('run').onpointerdown=()=>run=true;$('run').onpointerup=$('run').onpointercancel=()=>run=false}let velocity=new BABYLON.Vector3(0,0,0),walkPhase=0;
function frame(){eng.runRenderLoop(()=>{if(!sc)return;let stamp=performance.now();if(stamp-lastFrame<1000/fpsLimit)return;let dt=Math.min((stamp-lastFrame)/1000,.04);lastFrame=stamp;if(started){
 let f=new BABYLON.Vector3(Math.sin(cam.rotation.y),0,Math.cos(cam.rotation.y)),r=new BABYLON.Vector3(f.z,0,-f.x);
 let input=f.scale(-move.y).add(r.scale(move.x));if(input.length()>1)input.normalize();
 let target=input.scale(run?3.15:1.75),blend=1-Math.pow(.0008,dt);
 velocity.x+=(target.x-velocity.x)*blend;velocity.z+=(target.z-velocity.z)*blend;
 let nx=cam.position.x+velocity.x*dt,nz=cam.position.z+velocity.z*dt;
 // simple solid boundaries; doorway remains passable when opened
 if(nx>-5.55&&nx<5.55)cam.position.x=nx;
 let doorPass=open&&Math.abs(nx)<1.25&&nz<-6.65&&nz>-7.15;
 if(nz>-14.1&&nz<5.7&&(nz>-6.75||doorPass||Math.abs(nx)>1.55))cam.position.z=nz;
 let moving=Math.hypot(velocity.x,velocity.z)>.55;
 if(moving){walkPhase+=dt*(run?9:6.2);if(audioCtx&&performance.now()-lastStep>(run?340:520)){sound('step');lastStep=performance.now();}}
 cam.position.y=1.65+(moving?Math.sin(walkPhase*2)*.018:0);
 }sc.render()})}$('start').onclick=()=>{startAudio();$('menu').classList.add('hide');started=true};let settingsFromGame=false;function showSettings(){settingsFromGame=started;started=false;$('menu').classList.add('hide');$('settings').classList.remove('hide');}
$('settingsOpen').onclick=showSettings;$('quickSettings').onclick=showSettings;
$('settingsClose').onclick=()=>{$('settings').classList.add('hide');if(settingsFromGame){started=true;settingsFromGame=false;}else $('menu').classList.remove('hide');sens=Number($('sensitivity').value)*.0005;fpsLimit=Number($('fps').value);quality=$('quality').value;let b=Number($('brightness').value)/10;let hemi=sc.lights.find(l=>l.name==='ambient');if(hemi)hemi.intensity=.15+b*.42;masterGain&&(masterGain.gain.value=Number($('volume').value)/10*.42);eng.setHardwareScalingLevel(quality==='high'?1:quality==='medium'?1.35:1.8);eng.setSize(innerWidth,innerHeight);};
$('lampToggle').onclick=()=>{if(ceilingLamp){ceilingLamp.setEnabled(!ceilingLamp.isEnabled());$('lampToggle').textContent=ceilingLamp.isEnabled()?'إطفاء لمبة السقف':'تشغيل لمبة السقف'}};
$('flashToggle').onclick=()=>{flashOn=!flashOn;if(flash)flash.setEnabled(flashOn);if(flashlight)flashlight.setEnabled(flashOn);$('flashToggle').textContent=flashOn?'إطفاء الكشاف':'تشغيل الكشاف'};window.gameBack=()=>{started=false;$('menu').classList.remove('hide');$('settings').classList.add('hide')};try{eng=new BABYLON.Engine(c,true,{antialias:true});build();touch();frame();onresize=()=>eng.resize()}catch(e){$('hint').textContent='خطأ تشغيل 3D: '+e.message}})();