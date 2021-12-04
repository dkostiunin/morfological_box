const part_main_object = `
	<div id="child_input">
		<div>
			<input type="text" maxlength="25" oninput="check(this)" placeholder="Добавьте часть объекта" class="input_text"/>
		</div>
		<button onclick="checking(this)">Добавить</button>		
	</div>`,
	
add_part_feature = `
	<div class="add_part_f">
		<div class="add_part_f_label">
			<label for="q"></label>
			<input type="text" maxlength="25" oninput="check(this)" name="q" placeholder="Характеризуйте эту часть" class="input_text"/>
		</div>	
		<button onclick="checking(this)">Убрать</button>
		<button onclick="checking(this)">Добавить</button>	
	</div>`,

show_r=`<div id="show_room">
		<button id="but_close" class="buttons" onclick="closes(this)">❌</button>
	</div>`,
	
menu=`<div id="show_m">
		<button id="but_close" class="buttons" onclick="closes(this)">❌</button>
		<p><a href="https://igra.cf/terms.html">Политика конфиденциальности</a></p>
		<p><a href="https://igra.cf/policy.html">Пользовательское соглашение</a></p>
		<p style="color: white">Сохраненные объекты:</p>
	</div>`,

add_obj=`<div id="add_o">Сохранено</div>`