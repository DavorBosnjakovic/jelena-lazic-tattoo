import sharp from 'sharp'
const names=['instagram','facebook','tiktok','whatsapp','telegram']
const preview=[]
for (const n of names) {
  const src=`public/social/${n}.webp`
  const meta=await sharp(src).metadata()
  const w=meta.width,h=meta.height
  // alpha = white glyph (flatten on black -> glyph bright, tile dark, corners black; threshold keeps glyph)
  const alpha=await sharp(src).flatten({background:'#000000'}).greyscale().toColourspace('b-w').threshold(110).raw().toBuffer()
  const glyph=await sharp({create:{width:w,height:h,channels:3,background:'#ffffff'}})
    .joinChannel(alpha,{raw:{width:w,height:h,channels:1}})
    .png().toBuffer()
  // preview on red + gray to check shape/recolor
  const onGray=await sharp(glyph).resize(90,90,{fit:'contain'}).flatten({background:'#666'}).extend({top:8,bottom:8,left:8,right:8,background:'#666'}).png().toBuffer()
  // recolor to red: tint white glyph red by multiplying
  const red=await sharp(glyph).resize(90,90,{fit:'contain'}).tint('#cc0000').flatten({background:'#141414'}).extend({top:8,bottom:8,left:8,right:8,background:'#141414'}).png().toBuffer()
  preview.push(onGray,red)
}
await sharp({create:{width:106*2,height:106*5,channels:3,background:'#444'}})
  .composite(preview.map((b,i)=>({input:b,top:Math.floor(i/2)*106,left:(i%2)*106}))).png().toFile('gtmp.png')
console.log('preview ready')
