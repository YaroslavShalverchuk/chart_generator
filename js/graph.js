function Graphics() {

	this.init = function(width, height, id, options) {
		this._padding = (options.padding) ? options.padding : 40;
		this._pointRadius = (options.pointRadius) ? options.pointRadius : 2;
		this._height = height;
		this._width = width;
		this.id = id;
		this.layer = false;
		this.main_options = options;
		this.getStage();
	};




	this.setStage = function() {
		var self = this;

		this._stage = new Konva.Stage({
			container: self.id,
			width: self._width,
			height: self._height,
		});
	};



	this.getStage = function() {
		var self = this;

		if(!this._stage) {
			self.setStage();
			return this._stage;
		}

		return this._stage;
	};




	this.drawTriangle = function(configs) {
		configs['sides'] = 3;
		var triangle = new Konva.RegularPolygon(configs);
		this.layer.add(triangle);
	}




	this.drawLine = function(line, configs) {
		var self = this;
		configs['points'] = line;

		var lines = new Konva.Line(configs);

		this.layer.add(lines);
	};

	this.drawText = function(configs, obj_layer) {
		var text = new new Konva.Text(configs);
		this.layer.add(text);
	};




	this.drawCircle = function(position, configs, obj_layer) {

		if(!configs)
			configs = {};

		configs.x = position.x;
		configs.y = position.y;

		var circle = new Konva.Circle(configs);
		this.layer.add(circle);

		return circle;
	};




	this.generateXLine = function(x) {
		var self = this;

		var line = [
			self._padding,
			self.start_coord_y,
			(self.length_x  * self.ratio + self._padding),
			self.start_coord_y,
		];

		var center = (self.length_x  * self.ratio + self._padding - self._padding) / 2 + self._padding;

		var conf = {
			x: center,
			y: self._height - self.main_options.fontSize + 2 - 15,
			text: self.main_options.x_name,
			fontSize: self.main_options.fontSize + 2,
			fontFamily: 'Arial',
			fill: self.main_options.lines,
		};

		var simpvarext = new Konva.Text(conf);

		simpvarext.setOffset({
			x : simpvarext.getWidth() / 2,
		})

		self.layer.add(simpvarext);

		if(this.cordCongigs.x) {
			self.drawLine(line, {stroke: self.main_options.lines, strokeWidth: 1}, 'cords');
		}
	};

	this.getMaxOfArray = function(numArray) {
	  return Math.max.apply(null, numArray);
	};

	this.getMinOfArray = function(numArray) {
	  return Math.min.apply(null, numArray);
	};


	this.drawMultyGistogram = function(data, configs) {
		var self = this;
		var key_x = configs['x'];
		var type  = (configs['y']) ? 'y' : 'y2';
		var key_y = configs[type];

		var x_val = [];
		var y_val = [];

		for(var i=0; i<data.length; i++) {
			if(data[i] && data[i][key_x])
				x_val[x_val.length] = data[i][key_x];

			for(var j=0; j<key_y.length; j++) {
					if(data[i] && data[i][key_y[j]])
						y_val[y_val.length] = data[i][key_y[j]];
			}
		}

		this.drawXCordValues(x_val);
		this.drawYCordValues(y_val, type);

		for(var i = 0 ; i < data.length; i++) {
			var width = (self.x_ratio -  (self.x_ratio / 4)) / key_y.length;
			var x = (self.x_ratio * i) +  (self.x_ratio / 8) + self._padding ;

			for(var j = 0; j < key_y.length; j++ ) {

				var y = self.start_coord_y - (data[i][key_y[j]] / self.y_steap * self.y_ratio);
				var tmp_x = x + (width * j);

				var rectangle = new Konva.Rect({
					 x: tmp_x,
					 y: y,
					 width: width,
					 height: (self.start_coord_y - y),
					 fill: configs['colors'][j],
					 stroke: configs['colors'][j],
					 strokeWidth: 0,
					 opacity : 0.8,
					 data : data[i],
					 key :  key_y[j],
					 type:type,
					 x_off : true,
					 multi : true,
					 shadowColor : configs['colors'][j],
					 shadowBlur: 6,
					 shadowOffset: {x : 3, y : -3},
					 shadowOpacity: 0.5
				 });

				 rectangle.on('mouseover', function(evt) {
					this.opacity(1);
				 	self.pointMouseOver(evt, key_y[j]);
				 });

				rectangle.on('mouseout', function(evt) {
				 	this.opacity(0.8);
					self.removeAdditional();
				});

				this.layer.add(rectangle);
			}

		}

		this.layer.draw();
	};


	this.removeAdditional = function() {
		this.greenLine.remove();
		this.greenLine2.remove();
		this.rect.remove();
		this.simpvarext.remove();
		this.layer.draw();
	};

	this.drawHorizontalGistogram = function(data, configs) {
		var self = this;

		var type  = (configs['y']) ? 'y' : 'y2';
		var key_y = configs[type];
		var key_x = configs['x'];

		var x_val = [];
		var y_val = [];


		for(var i=0; i<data.length; i++) {
			if(data[i] && data[i][key_y])
				y_val[y_val.length] = data[i][key_y];

			for(var j=0; j<key_x.length; j++) {
					if(data[i] && data[i][key_x[j]])
						x_val[x_val.length] = data[i][key_x[j]];
			}
		}


		this.drawXCordValues(x_val, true);
		this.drawYCordValues(y_val, type, true);

		for(var i = 0 ; i < data.length; i++) {
			var height = (self.y_ratio -  (self.y_ratio / 4)) / key_x.length;
			var y = this.start_coord_y - (this.y_ratio * i) - this.y_ratio -  (key_x.length * height) / 2;

			for(var j = 0; j < key_x.length; j++ ) {

				y = y + (height *  j);
				var width =  data[i][key_x[j]] * self.x_ratio / self.x_step;


				var rectangle = new Konva.Rect({
					 x: self.start_coord_x,
					 y: y,
					 width: width,
					 height: height,
					 fill: configs['colors'][j],
					 stroke: configs['colors'][j],
					 strokeWidth: 0,
					 opacity : 0.8,
					 data : data[i],
					 type:type,
					 key_x : key_x[j],
					 x_off : true,
					 multi : true,
					 horizontal : true,
					 shadowColor : configs['colors'][j],
					 shadowBlur: 6,
					 shadowOffset: {x : 3, y : -3},
					 shadowOpacity: 0.5
				 });


				 rectangle.on('mouseover', function(evt) {
					this.opacity(1);
				 	self.pointMouseOver(evt, key_y[j]);
				 });

				rectangle.on('mouseout', function(evt) {
				 	this.opacity(0.8);
					self.removeAdditional();
				});

				this.layer.add(rectangle);
			}

		}


		this.layer.draw();
	};

	this.drawGistogram = function(data, configs) {
		var self = this;

		var key_x = configs['x'];
		var type  = (configs['y']) ? 'y' : 'y2';
		var key_y = configs[type];


		var x_val = [];
		var y_val = [];
		for(var i=0; i<data.length; i++) {
			if(data[i] && data[i][key_x])
				x_val[x_val.length] = data[i][key_x];
			if(data[i] && data[i][key_y])
				y_val[y_val.length] = data[i][key_y];
		}

		this.drawXCordValues(x_val);
		this.drawYCordValues(y_val, type);

		for(var i = 0 ; i < data.length; i++) {
			var width = self.x_ratio -  (self.x_ratio / 4);
			var x = (self.x_ratio * i) +  (self.x_ratio / 8) + self._padding;
			var y = self.start_coord_y - (data[i][key_y] / self.y_steap * self.y_ratio);

			var rectangle = new Konva.Rect({
				 x: x,
				 y: y,
				 width: width,
				 height: (self.start_coord_y - y),
				 fill: configs['color'],
				 stroke: '#ccc',
				 strokeWidth: 1,
				 opacity : 0.8,
				 data : data[i],
				 type:type,
				 x_off : true,
				 shadowColor : configs['color'],
				 shadowBlur: 5,
				 shadowOffset: {x : 3, y : -3},
				 shadowOpacity: 0.5
			 });


			 rectangle.on('mouseover', function(evt) {
				this.opacity(1);
			 	self.pointMouseOver(evt, key_y);
			 });

			rectangle.on('mouseout', function(evt) {
				this.opacity(0.8);
				self.removeAdditional();
			});

			this.layer.add(rectangle);

		}


		this.layer.draw();
	};


	this.drawLinear = function(data, configs) {
		var self = this;



		var key_x = configs['x'];
		var type  = (configs['y']) ? 'y' : 'y2';
		var key_y = configs[type];

		var x_val = [];
		var y_val = [];
		for(var i=0; i<data.length; i++) {
			if(data[i] && data[i][key_x])
				x_val[x_val.length] = data[i][key_x];
			if(data[i] && data[i][key_y])
				y_val[y_val.length] = data[i][key_y];
		}

		this.drawXCordValues(x_val);
		this.drawYCordValues(y_val, type);

		var xy_cords = [];
		for(var i=0; i<data.length; i++) {
			var x = (this.x_ratio * i) + this.x_ratio / 2 + self._padding;
			var y = self.start_coord_y - (data[i][key_y] / self.y_steap * this.y_ratio);


			xy_cords[xy_cords.length] = x;
			xy_cords[xy_cords.length] = y;

			if(configs['points'] !== false) {
				var circle = new Konva.Circle(
					{ x: x,
						y : y,
						radius : self._pointRadius,
						fill:configs['color'],
						stroke: configs['color'],
				});
				var circle2 = new Konva.Circle({ x: x, y : y, radius : 6,  opacity: 0, type:type, data: data[i], fill:configs['color'], stroke: configs['color']});


				circle2.on('mouseover', function(evt) {
					self.pointMouseOver(evt, key_y);
		    });

				circle2.on('mouseout', function(evt) {
					self.removeAdditional();
				});

				this.layer.add(circle);
				this.layer.add(circle2);
			}
		}

		var fill  = (configs['fill']) ? true : false;

		if(fill) {
			var tmp = xy_cords;
			var xy_cords = [(self.start_coord_x) + this.x_ratio / 2, self.start_coord_y];
			xy_cords = xy_cords.concat(tmp, [tmp[tmp.length -2], self.start_coord_y]);
		}


		var dash = (configs['dash']) ? [20, 5] : false;

		self.drawLine(xy_cords, {
			stroke: configs['color'],
			fill: configs['color'],
			opacity: 0.7,
			strokeWidth: 2,
			lineCap: 'round',
			lineJoin: 'round',
			closed : fill,
			dash: dash,
			shadowColor : configs['color'],
			shadowBlur: 4,
			shadowOffset: {x : 2, y : -2},
			shadowOpacity: 0.5
		}, 'graph');

		this.layer.draw();
	}


	this.pointMouseOver = function(evt, key_y) {
		var self = this;
		var shape = evt.target;

		if(shape.attrs.type == 'y2') {
			var x = (self.length_x * self.ratio + self._padding);
		} else {
			var x = self._padding;
		}

		self.greenLine = new Konva.Line({
			points : [shape.attrs.x, shape.attrs.y, x, shape.attrs.y],
			stroke: self.main_options.lines,
			strokeWidth: 1,
			lineJoin: 'round',
			dash: [20, 5],
		});

		if(!shape.attrs.x_off) {
			self.greenLine2 = new Konva.Line({
				points : [shape.attrs.x, shape.attrs.y, shape.attrs.x, self.start_coord_y],
				stroke: self.main_options.lines,
				strokeWidth: 1,
				lineJoin: 'round',
				dash: [20, 5],
			});
	} else {
		self.greenLine2 = new Konva.Line({});
	}

	if(shape.attrs.horizontal) {
		var text = shape.attrs.data[shape.attrs.key_x] + "";
	} else {
		var key = (shape.attrs.key) ? shape.attrs.key : key_y;
		var text = shape.attrs.data[key] + "";
	}
	text = Math.round(text * 100) / 100;

		self.simpvarext = new Konva.Text({
			x: (x + 10),
			y: (shape.attrs.y - self.main_options.fontSize / 2),
			text: text,
			fontSize: self.main_options.fontSize,
			fontFamily: 'Arial',
			fill: 'green',
		});

		if(shape.attrs.type == 'y') {
			self.simpvarext.setOffset({ x: (self.simpvarext.getWidth() + 20)});
			var x2 = x - self.simpvarext.getOffset().x + 5;
		} else {
			var x2 = x + 5;
		}

		self.rect = new Konva.Rect({
		 x: x2,
		 y: (shape.attrs.y - self.main_options.fontSize),
		 width: (self.simpvarext.getWidth() + 10),
		 height: (self.simpvarext.getHeight() + 10),
		 fill: '#fff',
		 stroke: '#ccc',
		 strokeWidth: 1
	 });


		self.layer.add(self.greenLine);
		self.layer.add(self.greenLine2);
		self.layer.add(self.rect);
		self.layer.add(self.simpvarext);
		self.layer.draw();
	}


	this.drawYCordValues = function(y_val, type, horizontal) {
		if(this[type + '_titles_generated']) {
			return false;
		}

		var self = this;

		if(type == "y") {
			var max = (this.max == 0) ? 1 : this.max;
			var min = this.min;
		} else {
			var max = (this.max_y2 == 0) ? 1 : this.max_y2;
			var min = this.min_y2;
		}


		if(Math.abs(min) > Math.abs(max)) {
			max = Math.abs(min);
		}

		var lng = 11;
		var delimetr = (this.negative) ? 5 : 10;

		if(!horizontal) {
				this.y_steap = (max > 10) ? Math.ceil(max / delimetr) : Math.ceil(max) / delimetr;
				this.y_ratio = Math.round(this.length_y * self.ratio / 10);
		} else {
			this.y_ratio = this.length_y / (y_val.length + 1) *  this.ratio;
			this.y_steap = 1
			min = this.getMinOfArray(y_val) - 1;
			lng = y_val.length + 1;
		}


		if(type == 'y2') {
			var x =  (self.length_x * self.ratio + self._padding) - self._pointRadius;
			var x2 = (self.length_x * self.ratio + self._padding) + self._pointRadius;
			var offset = 5;
		} else {
			var x =  self.start_coord_x - self._pointRadius;
			var x2 = self.start_coord_x + self._pointRadius;
			var offset = - 5;
		}

		if(this.negative) {
			var plusVal = Math.ceil(self.y_proportions[1] * 11);
			var minusVal = Math.ceil(self.y_proportions[0] * 11) - 1;


			for(var i = 0; i < plusVal ; i++) {
				var y = self.start_coord_y - ((i) * this.y_ratio);
				var line = [ x, y, x2, y ];


				self.drawLine(line, {stroke: self.main_options.lines, strokeWidth: 1}, 'graph');

				var simpvarext = new Konva.Text({
					x: (x2 + offset),
					y: y,
					text: Math.round(this.y_steap *  (i) * 100)/ 100 + " ",
					fontSize: self.main_options.fontSize,
					fontFamily: 'Arial',
					fill: self.main_options.lines,
				});

				simpvarext.setOffset({ y: (self.y_ratio - simpvarext.getHeight()) /  2.5 });

				if(type == 'y') {
					simpvarext.setOffset({ x: (simpvarext.getWidth() + 5)});
				}

				this.layer.add(simpvarext);
			}

				for(var i = -1; i > minusVal ; i--) {
					var y = self.start_coord_y - ((i) * this.y_ratio);
					var line = [ x, y, x2, y ];


					self.drawLine(line, {stroke: self.main_options.lines, strokeWidth: 1}, 'graph');

					var simpvarext = new Konva.Text({
						x: (x2 + offset),
						y: y,
						text: Math.round(this.y_steap *  (i) * 100)/ 100 + " ",
						fontSize: self.main_options.fontSize,
						fontFamily: 'Arial',
						fill: self.main_options.lines,
					});

					simpvarext.setOffset({ y: (self.y_ratio - simpvarext.getHeight()) /  2.5 });

					if(type == 'y') {
						simpvarext.setOffset({ x: (simpvarext.getWidth() + 5)});
					}

					this.layer.add(simpvarext);
				}
		} else {
			for(var i = 0; i < lng; i++) {
				var y = self.start_coord_y - ((i) * this.y_ratio);
				var line = [ x, y, x2, y ];


				self.drawLine(line, {stroke: self.main_options.lines, strokeWidth: 1}, 'graph');

				var simpvarext = new Konva.Text({
					x: (x2 + offset),
					y: y,
					text: Math.round(this.y_steap *  (i + min) * 100)/ 100 + " ",
					fontSize: self.main_options.fontSize,
					fontFamily: 'Arial',
					fill: self.main_options.lines,
				});

				simpvarext.setOffset({ y: (self.y_ratio - simpvarext.getHeight()) /  2.5 });

				if(type == 'y') {
					simpvarext.setOffset({ x: (simpvarext.getWidth() + 5)});
				}

				this.layer.add(simpvarext);
			}
		}


		this[type + '_titles_generated'] = true;
	}


	this.drawXCordValues = function(x_val, horizontal) {
		if(this.x_titles_generated) {
			return false;
		}

		var self = this;

		var max = this.getMaxOfArray(x_val);

		if(!horizontal) {
			this.x_ratio = this.length_x / (x_val.length) *  this.ratio;
			if(self.x_ratio > this.ratio * this.length_x / 5) {
				this.x_ratio = this.ratio * this.length_x / 10
			}

			this.x_step = 1;
			var min = this.getMinOfArray(x_val);
			var lng = x_val.length;
		} else {
			var min = 0;
			this.x_step = Math.ceil((max - min) / 10);
			this.x_ratio = Math.round(this.length_x * self.ratio / 10);
			var lng = 10;
		}

		var y =  self.start_coord_y - self._pointRadius;
		var y2 = self.start_coord_y + self._pointRadius;

		for(var i = 0; i < lng; i++) {
			var x = self.start_coord_x + ((i) * this.x_ratio);
			var line = [ x, y, x, y2 ];


			if(horizontal)  {
				var text = this.x_step * i;
			}	else {
				var text = min + i;
			}

			self.drawLine(line, {stroke: self.main_options.lines, strokeWidth: 1}, 'graph');

			x += this.x_ratio / 2
			var simpvarext = new Konva.Text({
			  x: x,
			  y: self.start_coord_y + 15,
			  text: text + "",
			  fontSize: self.main_options.fontSize,
			  fontFamily: 'Arial',
			  fill: self.main_options.lines,
			});

			if(self.x_ratio < simpvarext.getWidth() + 6) {
				simpvarext.fontSize(self.main_options.fontSize * self.x_ratio / (simpvarext.getWidth()  + 6));
			}

			simpvarext.setOffset({ x: (simpvarext.getWidth() / 2), });

			this.layer.add(simpvarext);
		}

		this.x_titles_generated = true;
		this.layer.draw();
	}


	this.sortConfigs = function(data, configs) {

			var order = {};
			for(var i=0; i<configs.length; i++) {
				var max = 0;
				var key = (configs[i].y2) ? configs[i].y2 : configs[i].y;
				var key_name = (configs[i].y2) ? 'y2' : 'y';
				if(Array.isArray(key)) {
					for(var k=0; k < key.length; k++) {
						for(var j=0; j < data.length; j++) {
							if(max < data[j][key[k]] ) {
								max =  data[j][key[k]];
							}
						}
					}
				} else {
					for(var j=0; j < data.length; j++) {
						if(max < data[j][key] ) {
							max =  data[j][key];
						}

					}
				}

				order[i] = max;
			}

			var sortable = [];
			for (var v in order) {
					sortable.push([v, order[v]]);
			}

			sortable.sort(function(a, b) {
					return a[1] - b[1];
			});

			var new_configs = [];
			var new_configs_linear = [];
			var new_configs_other = [];
			for(var i=0; i<sortable.length; i++) {
				if(configs[sortable[i][0]].type == "linear") {
					new_configs_linear.push(configs[sortable[i][0]]);
				} else {
					new_configs_other.push(configs[sortable[i][0]]);
				}
			}

			for(i=new_configs_other.length - 1; i>=0; i--)
				new_configs.push(new_configs_other[i]);

			for(i=new_configs_linear.length - 1; i>=0; i--)
				new_configs.push(new_configs_linear[i]);

				return new_configs;
	};

	this.checkEmpty = function(data, configs) {
		var keys = [];
		var data_new = [];
		var kk = ['y', 'y2', 'x'];
		for(var j = 0; j < configs.length; j++) {
			for(var i = 0; i<kk.length; i++) {
				if(configs[j][kk[i]]) {
					if(Array.isArray(configs[j][kk[i]])) {
						keys.concat(configs[j][kk[i]]);
					} else {

						if(configs[j][kk[i]] !== 'year' || (configs[j][kk[i]] == 'year' && kk[i] == 'y')) {
							keys.push(configs[j][kk[i]]);
						}
					}
				}
			}
		}

		for(var i = 0; i < data.length; i++) {
			var dataExsist = false;
			for(var j = 0; j < keys.length; j++) {
					if(data[i][keys[j]]) {
						dataExsist = true;
					}
			}

			if(dataExsist) {
				data_new.push(data[i]);
			}
		}


		return data_new;

	};

	this.makeGraph = function(data, configs) {
		var self = this;
		var stage = this.getStage();

		configs = this.sortConfigs(data, configs);
		var data = self.checkEmpty(data.slice(), configs);

		stage.add(self.layer);
		self.drawHistory(configs);


		for(var i=0; i<configs.length; i++) {
			if(configs[i].type == "linear") {
				this.drawLinear(data, configs[i]);
			} else if(configs[i].type == "Gistogram") {
				this.drawGistogram(data, configs[i]);
			} else if(configs[i].type == "multi_gistogram") {
				this.drawMultyGistogram(data, configs[i]);
			} else if(configs[i].type == "horizontal_multi_gistogram") {
				this.drawHorizontalGistogram(data, configs[i]);
			}
		}

		//console.log($.parseJSON(self._stage.toJSON()));
		//$('.konvajs-content canvas').get(1).toDataURL('image/svg', 1);
	}

	this.getLengthY = function() {
		if(this.negative) {
			return this.length_y / 2;
		} else {
			return this.length_y / 2;
		}
	}




	this.generateYLine = function(y) {
		var self = this;

		this.y_line_length = (self.length_y * self.ratio + self._padding) + 5 - self._padding  - 5;

		var line = [
			self.start_coord_x,
			self._padding - 5,
			self.start_coord_x,
			(self.length_y * self.ratio + self._padding) + 5,
		];


		var center = (self.length_y * self.ratio + self._padding - self._padding) / 2 + self._padding;

		var conf = {
			x: 10,
			y: center,
			text: self.main_options.y_name,
			fontSize: self.main_options.fontSize + 2,
			fontFamily: 'Arial',
			fill: self.main_options.lines,
			rotation: 270,
		};

		var simpvarext = new Konva.Text(conf);
		simpvarext.offsetX( simpvarext.getWidth() / 2);

		self.layer.add(simpvarext);

		if(this.cordCongigs.y) {
			self.drawLine(line, {stroke: self.main_options.lines, strokeWidth: 1}, 'cords');
		}
	}



	this.generateY2Line = function(y) {
		var self = this;

		this.y_line_length = (self.length_y * self.ratio + self._padding) + 5 - self._padding  - 5;

		var line = [
			(self.length_x * self.ratio + self._padding),
			self._padding  - 5,
			(self.length_x * self.ratio + self._padding),
			(self.length_y * self.ratio + self._padding) + 5,
		];

		var center = (self.length_y * self.ratio + self._padding - self._padding) / 2 + self._padding;

		var conf = {
			x: self._width - self.main_options.fontSize - 2 - 5,
			y: center,
			text: self.main_options.y2_name,
			fontSize: self.main_options.fontSize + 2,
			fontFamily: 'Arial',
			fill: self.main_options.lines,
			rotation: 90,
		};

		var simpvarext = new Konva.Text(conf);
		simpvarext.offsetX( simpvarext.getWidth() / 2);

		self.layer.add(simpvarext);

		if(this.cordCongigs.y2) {
			self.drawLine(line, {stroke: self.main_options.lines, strokeWidth: 1}, 'cords');
		}
	}



	//x and y is array some  as [0,1] where is 0 - start coordinate, 1 - end
	this.drawCoordinates = function(x, y, configs, minMax) {
		var self = this;
		var stage = self.getStage();

		this.y_proportions = y;
		this.min = minMax.y[0];
		this.max = minMax.y[1];
		this.min_y2 = minMax.y2[0];
		this.max_y2 = minMax.y2[1];

		if(this.min < 0 ||  this.min_y2 < 0) {
			this.negative = true;
		} else {
			this.negative = false;
		}

		this.countRatio(x,y);
		this.cordCongigs = configs;
		this.layer = new Konva.Layer();


		if(self.main_options.fill) {

			var rect = new Konva.Rect({
				x: 0,
				y: 0,
				width: self._width,
				height: self._height,
				fill: self.main_options.fill,
			  strokeWidth: 0,
			});
			this.layer.add(rect);
		}

		self.getNullCord(x,y);

		self.generateXLine(x);
		self.generateYLine(y);
		self.generateY2Line(y);


		stage.add(this.layer);

	}


	this.drawHistory = function(configs) {
		var self = this;

		var currentX = self._padding * 1;

		for(var i=0; i<configs.length; i++) {
			if(configs[i].type == 'horizontal_multi_gistogram') {
				var key = configs[i].x;
			} else {
				var key = (configs[i].y2) ? configs[i].y2 : configs[i].y;
			}

			var y = (this.negative) ? self.y_line_length + 60 : self.start_coord_y;


			if(Array.isArray(key)) {
				var c = configs[i];

				for(var j=0; j<key.length; j++) {

					var text = new Konva.Text({
						x: currentX + 30,
						y: y + self._padding,
						text: c.title[j],
						fontSize: self.main_options.fontSize + 1,
						fontFamily: 'Arial',
						fill: self.main_options.lines,
					});


					var rect = new Konva.Rect({
						x: currentX,
						y: y + self._padding - 5,
						width: 20,
						height: 20,
						fill: c.colors[j],
	  				stroke: '#656565',
						strokeWidth: 1,
					});

					this.layer.add(rect);
					this.layer.add(text);

					currentX += 50 +  text.getWidth();
				 }
			} else {
				var rect = new Konva.Rect({
					x: currentX,
					y: y + self._padding - 5,
					width: 20,
					height: 20,
					fill: configs[i].color,
  				stroke: '#656565',
					strokeWidth: 1,
				});

				this.layer.add(rect);

				var text = {
					x: currentX + 30,
					y: y + self._padding,
					text: configs[i].title,
					fontSize: self.main_options.fontSize + 1,
					fontFamily: 'Arial',
					fill: self.main_options.lines,
				};


				var text = new Konva.Text(text);
				this.layer.add(text);

				currentX += 50 +  text.getWidth();
			}

		}

	}



	this.getNullCord = function(x, y) {
		var self = this;
		self.start_coord_y = y[1] * self.ratio + self._padding;
		self.start_coord_x = Math.abs(x[0]) * self.ratio + self._padding;
	}



	this.countRatio = function(x,y) {
		var self = this;

		this.length_x = self.getLength(x);
		this.length_y = self.getLength(y);

		var xRatio = Math.round( ( self._width - this._padding * 2 ) / this.length_x * 100) / 100;
		var yRatio = Math.round( ( self._height - this._padding * 3 ) / this.length_y * 100) / 100;

		this.ratio = Math.min(xRatio, yRatio);
	}



	this.getLength = function(line) {
		if(typeof(line) != 'object')
			return 0;

		return line[1] - line[0];
	}

}