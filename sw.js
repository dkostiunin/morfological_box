const stat_cache='v1'
const stat_files=['./','./func.js','./index.html','./styles.css','./policy.html','./terms.html','./const.js','./antimat.js','./favicon.svg','./manifest.json','./maskable_icon.png','./48.png','./72.png','./96.png','./144.png','./192.png','./512.png']


self.addEventListener('install',ev=>{
    ev.waitUntil(caches.open(stat_cache).then(cache=>cache.addAll(stat_files)))
})

 self.addEventListener('activate',async ev=>{
    const cache_names = await caches.keys()	
	await Promise.all(cache_names.filter(n=>n!==stat_cache).map(n=>caches.delete(n)))	
})

self.addEventListener('fetch',ev=>{
	ev.respondWith(cachefirst(ev.request))
})

async function cachefirst(req){
	const c= await caches.match(req)
	return c ?? await fetch(req)
}
