// Field Unit AI proxy — deploy to Railway, set ANTHROPIC_API_KEY env var
const http=require('http');
const KEY=process.env.ANTHROPIC_API_KEY;
const PORT=process.env.PORT||3000;
http.createServer(async (req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  if(req.method==='OPTIONS'){res.writeHead(204);return res.end();}
  if(req.method!=='POST'||!req.url.startsWith('/api/chat')){res.writeHead(404);return res.end('{"error":"POST /api/chat"}');}
  if(!KEY){res.writeHead(500);return res.end('{"error":"ANTHROPIC_API_KEY not set on Railway"}');}
  let body='';req.on('data',c=>body+=c);
  req.on('end',async ()=>{
    try{
      const {system,messages}=JSON.parse(body||'{}');
      const r=await fetch('https://api.anthropic.com/v1/messages',{
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':KEY,'anthropic-version':'2023-06-01'},
        body:JSON.stringify({model:'claude-sonnet-4-6',max_tokens:600,system:system||'',messages:messages&&messages.length?messages:[{role:'user',content:'hi'}]})
      });
      const j=await r.json();
      const reply=(j.content||[]).filter(b=>b.type==='text').map(b=>b.text).join('\n')||j.error?.message||'No reply';
      res.writeHead(200,{'Content-Type':'application/json'});
      res.end(JSON.stringify({reply}));
    }catch(e){res.writeHead(500);res.end(JSON.stringify({error:String(e)}));}
  });
}).listen(PORT,()=>console.log('Field Unit proxy on :'+PORT));
