initials = ['b'
	,'p'
	,'m'
	,'f'
	,'d'
	,'t'
	,'n'
	,'l'
	,'g'
	,'k'
	,'h'
	,'j'
	,'q'
	,'x'
	,'zh'
	,'ch'
	,'sh'
	,'r'
	,'z'
	,'c'
	,'s'
];
finals = ['a'
	,'o'
	,'e'
	,'i'
	,'u'
	,'ü'
	,'ai'
	,'ei'
	,'ao'
	,'ou'
	,'ia'
	,'ie'
	,'ua'
	,'uo'
	,'üe'
	,'iao'
	,'iu'
	,'uai'
	,'ui'
	,'an'
	,'ian'
	,'uan'
	,'üan'
	,'en'
	,'in'
	,'un'
	,'ün'
	,'ang'
	,'iang'
	,'uang'
	,'eng'
	,'ing'
	,'ueng'
	,'ong'
	,'iong'
];

function init() {
	const t = document.getElementById('viewer');
	{
		const row = document.createElement('tr');
		row.innerHTML = '<tr><td>&nbsp;</td></tr>';
		t.appendChild(row);
	}
	for (const e of initials) {
		const row = document.createElement('tr');
		row.innerHTML = `<tr><td class="initial">${e}</td></tr>`;
		t.appendChild(row);
	}
	for (const e of finals) {
		const row = document.createElement('tr');
		row.innerHTML = `<tr><td class="final">${e}</td></tr>`;
		t.appendChild(row);
	}

	const inputElement = document.getElementById('t');
	inputElement.addEventListener('input', function (event) {
		updateTable(event.target.value);
	});
}

init();

function postProcessPY(initial, final) {
	const specialInitials = ['j', 'q', 'x', 'y'];
	if (initial == '' && final == '')
		return {initial: '', final: ''};
	if (final == 'u' && specialInitials.includes(initial)) {
		final = 'ü';
	} 
	else if (final == 'un' && specialInitials.includes(initial)) {
		final = 'ün';
	} 
	else if (final == 'uan' && specialInitials.includes(initial)) {
		final = 'üan';
	}

	if (final == 'ue')
		final = 'üe';
	if (initial == 'y')
	{
		initial = '';
		const cat1 = ['i', 'in', 'ing', 'ü', 'üe', 'ün', 'üan'];
		const cat2 = ['a', 'e', 'an', 'ang', 'ao', 'ong'];
		if (cat1.includes(final)) {
			final = final;
		}
		else if (cat2.includes(final)) {
			final = 'i' + final;
		}
		else if (final == 'ou') {
			final = 'iu';
		}
		else {
			throw 'y ' + final;
		}
	}
	else if (initial == 'w') {
		initial = '';
		const cat1 = ['ai', 'an', 'ang', 'eng', 'a', 'o'];
		if (cat1.includes(final)) {
			final = 'u' + final;
		}
		else if (final == 'en') {
			final = 'un';
		}
		else if (final == 'u') {
			final = 'u';
		}
		else if (final == 'ei') {
			final = 'ui';
		}
		else {
			throw 'y ' + final;
		}
	}

	return {initial: initial, final: final};
}

function updateTable(text) {
	console.log(text);

	let py_initial = pinyinPro.pinyin(text, { toneType: 'none', pattern: 'initial', type: 'array' });
	let py_final = pinyinPro.pinyin(text, { toneType: 'none', pattern: 'final', type: 'array' });
	console.log(py_initial);
	console.log(py_final);

	if (text.length != py_initial.length || text.length != py_final.length) {
		throw "Text and pinyin length mismatch";
	}

	const rows = document.getElementById('viewer').rows;
	for (let i = 0; i < rows.length; i++) { // Start from 1 to skip the header row
	  const row = rows[i];
	  
	  const cells = row.cells; // Get all cells in the current row
	  cells[0].classList.remove('chosen');

	  for (let j = cells.length - 1; j > 0; j--) {
		row.deleteCell(j); // Remove the cell
	  }
	}

	for (let i = 0; i < text.length; i++) {
		const cell = document.createElement('td');
		cell.innerHTML = text[i];
		rows[0].appendChild(cell);

		for (let j = 1; j < rows.length; j++)
			rows[j].appendChild(document.createElement('td'));

		const {initial, final} = postProcessPY(py_initial[i], py_final[i]);
		for (const py of [initial, final]) {
			if (py == '')
				continue;
			let found = false;
			for (let j = 1; j < rows.length; j++)
				if (rows[j].cells[0].innerHTML == py) {
					rows[j].cells[0].classList.add('chosen');
					rows[j].cells[rows[j].cells.length - 1].classList.add('chosen');
					found = true;
					break;
				}
			if (!found)
				console.warn(py);
		}
	}
}
