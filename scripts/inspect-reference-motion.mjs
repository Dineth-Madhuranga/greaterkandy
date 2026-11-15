import { chromium } from "@playwright/test";
import { writeFile, mkdir } from "node:fs/promises";
await mkdir("reference/sweet-tape/motion",{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true,args:["--enable-unsafe-swiftshader"]});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.route(/googletagmanager|google-analytics/,r=>r.abort());
 await page.goto("https://sweet-tape.com/",{waitUntil:"domcontentloaded",timeout:60000});
 await page.waitForFunction(()=>!document.documentElement.hasAttribute("data-loading"),{},{timeout:65000}).catch(()=>{});
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(1200);
 const report={pages:[],menu:[],animations:[]};
 report.animations=await page.evaluate(()=>document.getAnimations().map(a=>({name:a.animationName,duration:a.effect?.getTiming().duration,easing:a.effect?.getTiming().easing,target:a.effect?.target?.className})));
 for(const y of [0,650,1400,2200,3200,4500,6000,8000]){
  await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(700);
  await page.screenshot({path:`reference/sweet-tape/motion/home-${y}.png`});
  report.pages.push(await page.evaluate(()=>({scroll:scrollY,height:document.documentElement.scrollHeight,sections:[...document.querySelectorAll('main section')].map(s=>({class:s.className,top:s.getBoundingClientRect().top,height:s.getBoundingClientRect().height})),fixed:[...document.querySelectorAll('main *')].filter(s=>getComputedStyle(s).position==='fixed'||getComputedStyle(s).position==='sticky').slice(0,20).map(s=>({class:s.className,position:getComputedStyle(s).position,transform:getComputedStyle(s).transform}))})));
 }
 await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(500);
 const trigger=page.getByText("PULL ME",{exact:true}).first();
 await trigger.click();
 for(const delay of [100,250,600]){await page.waitForTimeout(delay);await page.screenshot({path:`reference/sweet-tape/motion/menu-${delay}.png`});}
 report.menu=await page.evaluate(()=>[...document.querySelectorAll('a')].filter(a=>a.innerText.includes('ABOUT')).map(a=>({text:a.innerText,html:a.outerHTML.slice(0,1200)})));
 await writeFile("reference/sweet-tape/motion/observations.json",JSON.stringify(report,null,2));
 console.log("Reference motion sequence and menu captured");
}finally{await browser.close()}
