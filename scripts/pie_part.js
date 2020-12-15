var selected_keys = ['大兴区'];
var data_file = 'data/data.csv';
var global_data;
let select_year='1997';

function draw_pie(div_id, keys, data_map) {
	var myChart = echarts.init(document.getElementById(div_id));
	selected = [];
	titles = [{text: String(select_year)+'年'+'产业分布图',left: '50%',textAlign: 'center'}];
	width = 90/keys.length;
	if (keys.length==1) rad = 45;
	else rad = width
	for (key_id=0; key_id<keys.length; key_id++) {
		tmp = [];
		key = keys[key_id];
		data = data_map[key][String(select_year)];
		if (data.hasOwnProperty('第一产业增加值(亿元)')) {
			first = parseFloat(data['第一产业增加值(亿元)']);
		}
		else first = 0;
		if (data.hasOwnProperty('第二产业增加值(亿元)')) {
			second = parseFloat(data['第二产业增加值(亿元)']);
		}
		else second = 0;
		if (data.hasOwnProperty('GDP(亿元)')) {
			third = parseFloat(data['GDP(亿元)'])-first-second;
			third = parseInt(third*100)/100;
		}
		else third = 0;
		tmp.push({'value':first, name: '第一产业'})
		tmp.push({'value':second, name: '第二产业'})
		tmp.push({'value':third, name: '第三产业'})
		selected[key_id] = {
			name: data['省份']+'\t'+key,
			type: 'pie',
			radius: String(rad)+'%',
			center: [String((key_id+0.5)*width+10)+'%', '50%'],
			label: {
				position: 'inner',
				show: false
			},
			labelLine: {
				show: false
			},
			data: tmp,
			left: String(key_id*width+10)+'%',
			right: String((keys.length-key_id-1)*width)+'%',
			top: 0,
			bottom: 0
		}
		titles.push({
        subtext: data['省份']+'\t'+key,
        left: String((key_id+0.5)*width+10)+'%',
        top: '75%',
        textAlign: 'center',
		subtextStyle: {color: 'black'}
		});
	}
	var option = {
            title: titles,
            tooltip: {
				trigger: 'item',
				formatter: '{a} <br/>{b}: {c} ({d}%)'
			},
            legend: {
				orient: 'vertical',
				top: '40%',
				left: 10,
                data:['第一产业', '第二产业', '第三产业']
            },
            series: selected
        };
	myChart.clear();
	myChart.setOption(option);
}

function flush_pie_fig() {
	tmp_data = {};
	for (i=0;i<selected_keys.length;i++) {
		tmp_data[selected_keys[i]] = {};
	}
	for (idx=0;idx<global_data.length;idx++) {
		for (i=0;i<selected_keys.length;i++) {
			if (global_data[idx]['区县']==selected_keys[i]) {
				tmp_data[selected_keys[i]][global_data[idx]['年份']]=global_data[idx];
				break;
			}
		}
	}
	draw_pie('pie_fig', selected_keys, tmp_data);
}

function key_update(key) {
	selected_keys = key;
	flush_pie_fig();
}

function year_update(year) {
	select_year = year;
	flush_pie_fig();
}

function pie_main(OM) {
	d3.csv(data_file).then(function(data) {
		data.splice(0,1);
		global_data = data;
		let div = d3.select('#pie_grid');
		let fig = div
		.append('div')
		.attr('id', 'pie_fig')
		.attr('style', 'width:100%;height:100%;');
		flush_pie_fig();
		OM.subscribe('key_update', key_update);
		OM.subscribe('year_update', year_update);
	});
}
 