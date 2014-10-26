##hapi-basic-i18n

* Plugin Options w/ registration;

	```js
	server.pack.register([
    {
        plugin: require("hapi-basic-i18n"),
        options: {
			locale_path: "./config/language",
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






