const getScript = url => new Promise((resolve, reject) => {
	const script = document.createElement('script')
	script.src = url
	script.async = true
	script.onerror = reject
	script.onload = script.onreadystatechange = function() {
		const loadState = this.readyState
		if (loadState && loadState !== 'loaded' && loadState !== 'complete') return		
		script.onload = script.onreadystatechange = null
		resolve()
	}	
	document.head.appendChild(script)
})

let result_word=''

function checking(el){
	if(el.textContent==='Добавить'){
		let el_input=el.parentElement.querySelector('div>input'),word=el_input.value,placehold=el_input.placeholder
		const txt=/[^a-zа-яё]/gi
		if(word===""||txt.test(word)===true){alert('Заполните поле - только буквы')}
		else if(window.containsMat(word)){alert('Это слово нельзя использовать')}
		else{
			result_word=word
			getScript('https://speller.yandex.net/services/spellservice.json/checkText?text='+word+'&callback=fix_spell')
			.then(() => {
				if(placehold==='Введите базовый объект'){
					el.parentElement.querySelector('div>input').value=result_word
					save.insertAdjacentHTML('afterend',part_main_object)
					el.textContent='Очистить'
				}
				else if(placehold==='Добавьте часть объекта'){
					el.parentElement.querySelector('div>input').value=''
					el.insertAdjacentHTML('afterend',add_part_feature)
					el.parentElement.querySelector('label').textContent=result_word
				}
				else if(placehold==='Характеризуйте эту часть'){
					el.parentElement.querySelector('div>input').value=''
					el.insertAdjacentHTML('afterend',
						`<div>
						<input type="checkbox" name=${result_word} checked>
						<label for=${result_word}>${result_word}</label>
					</div>`)
				}
			})
			.catch((err) => {console.error('Could not load script', err.message)})
		}
	}
	else if(el.textContent==='Очистить'){
		el.parentElement.querySelector('input').value='';el.textContent='Добавить'
		el.parentElement.querySelectorAll('div').forEach(i=>{if(i.id!=='base_inp'){i.remove()}})
	}
	else if(el.textContent==='Убрать'){
		el.parentElement.remove()
	}
}

const simbols=[' ','/','\\','.','[',']','^','$','(',')','?',':','*','+','=','!','<','>','|','{','}',',',';','-','"',"`","'"]
function check(el){if(simbols.includes(el.value.slice(-1))===true){el.value=el.value.slice(0,-1)}}

function fix_spell(resp){if(resp[0]){result_word=resp[0].s[0]}}

function get_result(el){
	let d,len,aLL=[],val=[],key=[],r=document.getElementsByClassName('add_part_f');r=[...r]
	r.forEach(i=>{
		let z=i.querySelectorAll('[type="checkbox"]'),w=i.querySelector('label').textContent,c={[w]:[]};
		z.forEach(i=>{if(i.checked){c[w].push(i.name)}})
		aLL.push(c) 
	})	
	aLL.forEach(i=>{val.push(Object.values(i).flat());key.push(Object.keys(i))})	
	if(el.textContent==='Объединить'){
		if(val.length!=0){d=comb(val)}
		if(d&&d.length>1&&typeof(d[0])==='object'){
			d.forEach(i=>{i.forEach((v,j)=>{i[j]={[key[j]]:v}})})
			main_div.insertAdjacentHTML('beforeend',show_r)	
			show_room.insertAdjacentHTML('beforeend',`<div class="rooms">Объект: <b>${base_inp.querySelector('input').value}</b></div>`)
			d.forEach(i=>{			
				let str='',p
				i.forEach(j=>{for(let k in j){str=str+` <b>${k}:</b> ${j[k]},`}})
				p=`<div class="rooms">${str}
				<button class="child_close_but" onclick="closes(this)">❌</button>
				</div>`
				show_room.insertAdjacentHTML('beforeend',p)
			})
			parent_input.style.display='none'
		}
		else{alert('Нужно ввести минимум две части объекта и хотя бы у одной части две харакеристики')}
	}
	else if(el.textContent==='Сохранить'){
		if(base_inp.querySelector('input').value){
			key=key.flat().map((i,j)=>i={[i]:val[j]})
			localStorage.setItem(base_inp.querySelector('input').value,JSON.stringify(key))
		}
		else{alert('Для начала добавьте объект')}
	}
}

function comb(matrix){
	return matrix.reduceRight(function(combination, x){
		let r = [];
		x.forEach(a=>{combination.forEach(b=>{r.push([a].concat(b))})});
		return r;
	});
};

function closes(el){el.parentElement.remove();parent_input.style.display='block'}

function show_menu(el){
	main_div.insertAdjacentHTML('beforeend',menu)	
	parent_input.style.display='none'
	for(let i=0; i<localStorage.length; i++) {		
		let p=`<div class="save_data"><b>${localStorage.key(i)}</b>
		<button onclick="edit_saves(this)">Посмотреть</button>
		<button onclick="edit_saves(this)">Удалить</button>
		</div>`
		show_m.insertAdjacentHTML('beforeend',p)
	}
}

function edit_saves(el){
	let obj=el.parentElement.querySelector('div>b').textContent
	if(el.textContent==='Посмотреть'){
		let val=JSON.parse(localStorage.getItem(obj)).reverse()
		let c=document.getElementById('child_input'); if(c){c.remove()}
		el.parentElement.parentElement.remove();parent_input.style.display='block'		
		base_inp.querySelector('input').value=obj
		save.insertAdjacentHTML('afterend',part_main_object)
		parent_input.querySelector('button').textContent='Очистить'
		val.forEach(i=>{
			child_input.querySelector('button').insertAdjacentHTML('afterend',add_part_feature)			
			child_input.querySelector('label').textContent=Object.keys(i)[0]
			for(let j in i){				
				i[j].forEach(v=>{
					child_input.querySelector('.add_part_f').insertAdjacentHTML('beforeend',
							`<div>
							<input type="checkbox" name=${v} checked>
							<label for=${result_word}>${v}</label>
						</div>`)
				})
			}
		})
	}
	else if(el.textContent==='Удалить'){localStorage.removeItem(obj);el.parentElement.remove()}
}

window.addEventListener('load',async()=>{
    if(navigator.serviceWorker){
		const reg=await navigator.serviceWorker.register('sw.js')
		console.log('Registration successful, scope is:', reg.scope)

	}
})