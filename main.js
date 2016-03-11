var path = "./";
var include_path = "include/"

requirejs.config({
	paths : {
		"jquery" : include_path + "jquery.2.1.4",
		"diff" : "diff"
	}
})


requirejs(['gloomy'],function(gloomy) {
	gloomy.test();
});
