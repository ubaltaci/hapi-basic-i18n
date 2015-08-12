##hapi-basic-i18n

* Plugin options w/ registration;

	```js
	server.register([
    {
        register: require("hapi-basic-i18n"),
        options: {
			locale_path: "<absolutePath>",
			cookie_name: "language",
			default_language: "EN",
			available_languages: ["EN"]
        }
    }], cb);
    
   ```

* In view context:

	```js
	{{i18n "wtf"}}
	```

* In route handler:

	```js
	function(request, reply) {
		reply(request.i18n("wtf"));
	}
	```




* Simply

	```js
	// en.js
	module.exports = {
		"Hello": "Hello {0}!",
	};
	
	// in route handler
	console.log(request.i18n("Hello", "John"));
	
	// in view 
	{{i18n "Hello" "John"}}
	
	// Both outputs are "Hello John!"
	```
	
	


