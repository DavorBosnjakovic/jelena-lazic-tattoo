import sharp from 'sharp'
const tiles=[]
for (const [n] of [['instagram'],['facebook'],['whatsapp']]) {
  for (const bg of [{r:180,g:180,b:180},{r:20,g:20,b:20}]) {
    const t = await sharp(`public/social/${n}.webp`).resize(90,90,{fit:'contain',background:{...bg,alpha:1}})
      .flatten({background:bg}).extend({top:8,bottom:8,left:8,right:8,background:bg}).png().toBuffer()
    tiles.push(t)
  }
}
await sharp({create:{width:106*2,height:106*3,channels:3,background:'#666'}})
  .composite(tiles.map((b,i)=>({input:b,top:Math.floor(i/2)*106,left:(i%2)*106}))).png().toFile('vtmp.png')
