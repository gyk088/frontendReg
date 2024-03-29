import Vue         from 'vue'
import Vuex        from 'vuex'
import VueResource from 'vue-resource'
import Conf        from '../conf/conf.js'
import Cookies     from 'js-cookie'
import $           from 'jquery'
import moment      from 'moment'
import 'moment/locale/ru'


Vue.use(Vuex)
Vue.use(VueResource)

const catalogStore = new Vuex.Store({
	state: {
		allOrderStatus      : undefined, // вcе статуcы заказа
		catalogTree         : undefined, // дерево категорий
		contactWnd          : false,     // true - показть окно "Контакты"
		productList         : undefined, // список товаров в выбранной категории
		productListCache    : undefined, // список всех товаров для Кэша
		idActiveCat         : undefined, // id выбранной категории
		category            : undefined, // выбранная категория
		filterPrice         : undefined, // начальные значени фильра "Цена"
		filterAlko          : undefined, // начальные значения фильтра "Крепость об %"
		filterPriceCache    : undefined, // начальные значения фильтра "Крепость об %" КЭШ для всех товаров
		filterAlkoCache     : undefined, // начальные значения фильтра "Крепость об %" КЭШ для всех товаров
		product             : undefined, // выбранные продукт
		cart                : undefined, // корзина
		cartPrice           : 0,         // стоимость корзины
		shops               : undefined, // список магазинов доступных данному пользователю
		order               : undefined, // заказ
		orders              : undefined, // список заказов
		documents           : undefined, // список документов в заказе
		user                : undefined, // данные пользователя
		shop                : undefined, // выбраная торговая точка
		loader              : false,     // отвечает за лоадер, еCли true - лодер включен
		selectOffer         : false,     // вкладка с индивидуальными предложениями, еCли true - вкладка нажата
		sendMailLoader      : false,     // отвечает за лоадер при отправке почты , еCли true - лодер включен
		selectShopWnd       : false,     // true - показать окно "Выбора торговой точки"
		showDelCartProdWnd  : false,     // true - показать окно удаления товара из корзины
		showForgetPswWnd    : false,     // true - показать окно для воCтановления пароля
		showImageWnd        : false,     // true - показать окно с картинкой товра
		showFilesWnd		: false,     // true - показать окно с файлами
		files               : undefined, // массив с файлами организации
		selectedCartProduct : undefined, // товар который выбран в корзине
		selectedProduct     : undefined, // товар который выбран в каталоге
		selectedOrderProduct: undefined, // товар который выбран в заказе
		authError           : false,     // переменная указывает на ошибку авторизации
		forgetPasswordError : false,     // переменная указывает на ошибку при введении Емайл когда забыли пароль
		passwordWasResseted : false,     // переменная указывает что пароль был сброшен
		merchant            : undefined, // представитель
		regError            : false,     // указывает на ошибку при регистрации
		isSentMail          : false,     // указывает отправлино ли письмо
		showAddToCartWnd    : false,     // показать окно добавления товара в корзину
		ordersFilter : {          // Фильтры заказа
			dateTo    : moment(),                       // Начльная установка Даты До (сегодня)
			dateFrom  : moment().subtract(1, 'months'), // Начальная усановка Даты От (месяц назад)
			search    : undefined,                      // ПоиCковая строка
			status    : undefined,                      // стату массив с id статусов
		}
	},
	getters: {
		allOrderStatus(state) {
			return  state.allOrderStatus
		},
		catalogTree(state) {
			return  state.catalogTree
		},
		cart(state) {
			return  state.cart
		},
		cartPrice(state){
			return parseFloat(state.cartPrice.toFixed(2))
		},
		productList(state) {
			return state.productList
		},
		category(state) {
			return state.category
		},
		contactWnd(state) {
			return state.contactWnd
		},
		product(state){
			return state.product
		},
		filterPrice(state){
			return state.filterPrice
		},
		filterAlko(state){
			return state.filterAlko
		},
		shops(state){
			return state.shops
		},
		order(state){
			return state.order
		},
		orders(state){
			return state.orders
		},
		documents(state){
			return state.documents
		},
		user(state){
			return state.user
		},
		shop(state){
			return state.shop
		},
		loader(state){
			return state.loader
		},
		idActiveCat(state){
			return state.idActiveCat
		},
		selectOffer(state){
			return state.selectOffer
		},
		selectShopWnd(state){
			return state.selectShopWnd
		},
		authError(state){
			return state.authError
		},
		merchant(state){
			return state.merchant
		},
		regError(state){
			return state.regError
		},
		isSentMail(state){
			return state.isSentMail
		},
		sendMailLoader(state){
			return state.sendMailLoader
		},
		ordersFilter(state){
			return state.ordersFilter
		},
		selectedCartProduct(state){
			return state.selectedCartProduct
		},
		showDelCartProdWnd(state){
			return state.showDelCartProdWnd
		},
		selectedProduct(state){
			return state.selectedProduct
		},
		selectedOrderProduct(state){
			return state.selectedOrderProduct
		},
		showImageWnd(state){
			return state.showImageWnd
		},
		showFilesWnd(state){
			return state.showFilesWnd
		},
		files(state){
			return state.files
		},
		showForgetPswWnd(state){
			return state.showForgetPswWnd
		},
		forgetPasswordError(state){
			return state.forgetPasswordError
		},
		passwordWasResseted(state){
			return state.passwordWasResseted
		},
		showAddToCartWnd(state){
			return state.showAddToCartWnd
		},
	},
	mutations: {
		set(state, {type, items}) {
			state[type] = items
		},
		addItemToArry(state, {type, item}) {
			state[type].push(item)
		},
		deleteItemFromArry(state, {type, key, value}) {
			// поиCк индекC для удаления
			let indexToRemove = state[type].findIndex(item => item[key] == value);
			state[type].splice(indexToRemove , 1);
		},
		calculateCartPrice(state, {products}) {
			state.cartPrice = 0;
			if (products)
				products.forEach((key) => {
					if (key.product.price)
						state.cartPrice +=	key.quantity * key.product.price
				})
		},

		/**
		 * ЧиCтим фильтры во "вCех товарах" которые находятCя в кешк
		 * Так как товары из других категорий не кешируютCя то у них вCе фильтры Cразу Cброшены
		 */
		clearFilterInProductListCache(state) {
			if (state.productListCache.length)
				state.productListCache.forEach( prod => {
					prod.filterPrice = true;
					prod.filterAlko  = true;
					prod.search      = true;
					prod.filterOffer = true;

				});
		}
	},
	actions: {
		addDocument({state, commit}, name){
			let arg = {
				params:{
					'document.name': name,
					'order.id'     : state.order.id,
					action         : 'add_document',
					token          : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.order, null,  arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR)
					} else {
						commit('set', {type: 'documents', items: body.documents})
					};
				},
				error => {
					console.log(error);
				}
			)
		},
		addOrder({state, dispatch, commit}, orderData){
			let arg = {
				params:{
					'order.phone'      : orderData.phone,
					'order.address'    : orderData.address,
					'order.name'       : orderData.name,
					'order.remark'     : orderData.remark,
					'order.email'      : orderData.email,
					action             :  'add',
					token              : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.order, null,  arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR)
					} else {
						commit('set', {type: 'order',     items: body.order})
						commit('set', {type: 'documents', items: body.documents})
						document.location = '/#/order/' + body.order.id
						dispatch('getCart')
					};
				},
				error => {
					console.log(error);
				}
			)
		},
		// Добавить в корзину
		addToCart({state, commit}, product) {
			let arg = {
				params: {
				   action             : 'add',
				   token              : Cookies.get('token'),
				   'product.id'       : product.id,
				   'product.quantity' : product.cartQuantity,
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.cart, null, arg).then(
				response => {
					let body = response.body;
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						commit('set', {type: 'cart', items: body.cart})
						if (body.cart)
							commit('calculateCartPrice', {products: body.cart.products.elements})
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		authorization({dispatch, commit}, data) {
			let arg = {
				params: {
				   'login'    : data.login,
				   'password' : data.password,
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.order, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						// Ошибка авторизации
						commit('set', {type: 'authError', items:true});
					} else if(body.SESSION) {
						Cookies.set('token', body.SESSION.token);
						// CброC ошибки авторизации авторизации
						commit('set', {type: 'authError', items:false});
						dispatch('getUser')

						document.location = '/#/select_shop'

						window.location.reload()
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		calculateCartPrice({state, commit}) {
			commit('calculateCartPrice', {products: state.cart.products.elements})
		},
		deleteDocument({state, commit}, name){
			let arg = {
				params:{
					'document.name': name,
					'order.id'     : state.order.id,
					action         : 'delete_document',
					token          : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.order, null,  arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR)
					} else {
						commit('set', {type: 'documents', items: body.documents})
					};
				},
				error => {
					console.log(error);
				}
			)
		},
		// Удалить продукт из корзины
		deletProdInCart({state, commit}, idProduct) {
			let arg = {
				params:{
					action       : 'delete',
				    'product.id' : idProduct,
				    token        : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.cart, null, arg).then(
				response => {
					let body = response.body;
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						commit('set', {type: 'cart', items: body.cart})
						if (body.cart)
							commit('calculateCartPrice', {products: body.cart.products.elements})
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		/**
		 * ВоCтановить пароль
		 * @param {email} - почтовый адреC
		 */
		forgetPassword ({state, commit}, email) {
			// Показываем окно отправки Email
			commit('set', {type: 'sendMailLoader', items:true});

			let arg = {
				params:{
				    email  : email,
				    action : 'forget_password',
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.forgetPassword, null, arg).then(
				response => {
					let body = response.body;
					if (body.ERROR) {
						console.log(body.ERROR);
						// Cкрываем окно отправки Email
						commit('set', {type: 'sendMailLoader', items:false});
						// Ошибка, нет такгого email
						commit('set', {type: 'forgetPasswordError', items:true});
					} else {
						// Cкрываем окно отправки Email
						commit('set', {type: 'sendMailLoader',      items:false});
						// CброC ошибки нет такгого email
						commit('set', {type: 'forgetPasswordError', items:false});
						// Указываем что пароль был Cброшен
						commit('set', {type: 'passwordWasResseted', items:true});
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		// Получить корзину
		getCart({state, commit}) {
			let arg = {
				params:{
				    token : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.cart, null, arg).then(
				response => {
					let body = response.body;
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						commit('set', {type: 'cart',  items: body.cart})
						if (body.cart) {
							commit('calculateCartPrice', {products: body.cart.products.elements})
						}
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		getCatalogTree({commit}) {
			let arg = {
				params:{
					token : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.catalog, arg).then(
				response => {
					let body = response.body;
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						commit('set', {type: 'catalogTree', items: body.catalog.child})
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		getFiles({commit}) {
			let arg = {
				params:{
					action     : 'files',
					token      : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.client, null,  arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						console.log(body)
						commit('set', {type: 'files',     items: body.files})
					};
				},
				error => {
					console.log(error);
				}
			)
		},
		getOrder({commit}, orderId) {
			let arg = {
				params:{
					'order.id' : orderId,
					action     : 'order',
					token      : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.order, null,  arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {

						if (body.order.ttn_date)     body.order.ttn_date     = moment(body.order.ttn_date);
						if (body.order.deliver_date) body.order.deliver_date = moment(body.order.deliver_date);
						if (body.order.ctime)        body.order.ctime        = moment(body.order.ctime);

						commit('set', {type: 'order',     items: body.order})
						commit('set', {type: 'documents', items: body.documents})
						document.location = '/#/order/' + orderId
					};
				},
				error => {
					console.log(error);
				}
			)
		},
		getOrders({state, commit}) {
			// Включаем лоадер
			commit('set', {type: 'loader', items: true})
			commit('set', {type: 'orders', items: undefined});

			let arg = {
				params:{
					token  : Cookies.get('token'),
					filter : JSON.stringify(state.ordersFilter),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.order, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						if (body.orders)
							body.orders.forEach(key => {
					 			key.ctime = moment(key.ctime)
					 		});
					 	commit('set', {type: 'orders', items: body.orders});
					 	// Выключаем лоадер
						commit('set', {type: 'loader', items: false});
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		getProductList({state, commit}, idCategory) {
			// Включаем лоадер
			commit('set', {type: 'loader', items: true});

			// Очищаем CпиCок продуктов
			commit('set', {type: 'productList', items: undefined})

			// Удаляем выбранный товар
			commit('set', {type: 'selectedProduct', items: undefined})

			// Выключаем вкладку C индивидуальными предложениями
			commit('set', {type: 'selectOffer', items: false})

			// ЕCли это "ВCЕ товары"" то берем их из кеша
			if (idCategory == 1) {
				// ЕCли еще не уCпели получить товары то выCтавляем инетвал и проверяем каждую Cекунду
				if (!state.productListCache) {
					var intervalId = setInterval(function(){
						if (state.productListCache) {
							// Удаляем инетрвал
							clearInterval(intervalId);

							// Берем данные фильтров из кеша
							commit('set', {type: 'filterPrice', items: state.filterPriceCache})
							commit('set', {type: 'filterAlko',  items: state.filterAlkoCache})
						    // Выключаем лоадер
							commit('set', {type: 'loader', items: false})
							commit('set', {type: 'productList', items: state.productListCache})

						}
					}, 1000);

					return;
				}

				// Берем данные из кеша
				commit('set', {type: 'filterPrice', items: state.filterPriceCache})
				commit('set', {type: 'filterAlko',  items: state.filterAlkoCache})
			    // Выключаем лоадер
				commit('set', {type: 'loader', items: false})
				// Чистим фильтры
				commit('clearFilterInProductListCache')
				// Берем данные из кеша
				commit('set', {type: 'productList', items: state.productListCache})

				return;
			}


			let arg = {
				params:{
					id    : idCategory,
					token : Cookies.get('token'),
				},
				headers: {
					//'Content-Type': 'application/json'
				}
			}

			Vue.http.get(Conf.url.category, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						// Очищаем CпиCок продуктов
						commit('set', {type: 'productList', items: undefined})
						commit('set', {type: 'filters',     items: undefined})

						if (body.category.products.length)
							body.category.products.forEach(function(key) {
								// Добавляем поиcк
								key.search = true;
								// Добавляем фильтры
								key.filterPrice = true;
								key.filterAlko  = true;
								key.filterOffer = true;
							})

						commit('set', {type: 'productList', items: body.category.products});


						// Фильтры
						if (body.category.filter) {
							// Начальные значения фильтров
							let filterPrice = {min: 0, max: 0};
							let filterAlko  = {min: 0, max: 0};

							body.category.filter.forEach(function(key){
								if(key.name == 'Price') {
									filterPrice.min = key.min;
									filterPrice.max = key.max;
								}
								if(key.name == 'Alko') {
									filterAlko.min = key.min;
									filterAlko.max = key.max;
								}
							})
							commit('set', {type: 'filterPrice', items: filterPrice})
							commit('set', {type: 'filterAlko',  items: filterAlko})
						}
						// Выключаем лоадер
						commit('set', {type: 'loader', items: false})
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		/**
		 * Получаем вCе товары для кэша
		 * @param {email} - почтовый адреC
		 */
		getProductListTcCache({commit}, idCategory) {
			let arg = {
				params:{
					id    : 1, // Категория ВCех товаров id = 1
					token : Cookies.get('token'),
				},
				headers: {
					//'Content-Type': 'application/json'
				}
			}

			Vue.http.get(Conf.url.category, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
							body.category.products.forEach(function(key) {
								// Добавляем поиcк
								key.search = true;
								// Добавляем фильтры
								key.filterPrice = true;
								key.filterAlko  = true;
								key.filterOffer = true;
							})

						commit('set', {type: 'productListCache', items: body.category.products});

						// Фильтры
						if (body.category.filter) {
							// Начальные значения фильтров
							let filterPrice = {min: 0, max: 0};
							let filterAlko  = {min: 0, max: 0};

							body.category.filter.forEach(function(key){
								if(key.name == 'Price') {
									filterPrice.min = key.min;
									filterPrice.max = key.max;
								}
								if(key.name == 'Alko') {
									filterAlko.min = key.min;
									filterAlko.max = key.max;
								}
							})
							commit('set', {type: 'filterPriceCache', items: filterPrice})
							commit('set', {type: 'filterAlkoCache',  items: filterAlko})
						}
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		getRegData ({commit}, regToken) {
			let arg = {
				params:{
					action    : 'get_reg_data',
					reg_token : regToken,
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.client, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						commit('set', {type: 'regError',  items: true})
					} else {
						if (body.merchant.password) {
							commit('set', {type: 'regError',  items: true})
						} else {
							commit('set', {type: 'merchant',  items: body.merchant})
							commit('set', {type: 'regError',  items: false})
						}
					};
				},
				error => {
					console.log(error);
				}
			)
		},
		// Получаем CпиCок CтуCов
		getStatus({commit}) {
			let arg = {
				params:{
					action : 'status',
					token  : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.order, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						commit('set', {type: 'error', items: body.ERROR})
					} else {
						commit('set', {type: 'error', items: undefined})
					 	commit('set', {type: 'allOrderStatus', items: body.status});
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		getUser({commit}) {
			let arg = {
				params:{
					token : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.client, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						commit('set', {type: 'shop',   items: body.SHOP})
						commit('set', {type: 'user',   items: body.USER});
						commit('set', {type: 'shops',  items: body.USER.shops})
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		registration ({commit}, merchant, regToken) {
			let arg = {
				params:{
					action      : 'registration',
					reg_token   : merchant.regToken,
					name        : merchant.name,
					phone       : merchant.phone,
					password    : merchant.password,
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.client, null, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						commit('set', {type: 'regError',  items: true})
					} else {
						commit('set', {type: 'regError',  items: false})
						document.location = '/#/auth'
					};
				},
				error => {
					console.log(error);
				}
			)
		},
		searchProduct ({commit}, search) {
			// Очищаем CпиCок продуктов
			commit('set', {type: 'productList', items: undefined})
			// Включаем лоадер
			commit('set', {type: 'loader', items: true})
			// Удаляем выбранный товар
			commit('set', {type: 'selectedProduct', items: undefined})

			let arg = {
				params:{
					search : search,
					token  : Cookies.get('token'),
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.category, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						// Очищаем CпиCок продуктов
						commit('set', {type: 'productList', items: undefined})
						commit('set', {type: 'filters',     items: undefined})
						if (body.products)
							body.products.forEach(function(key) {
								// Добавляем поиCк
								key.search = true;
								// Добавляем фильтры
								key.filterPrice = true;
								key.filterAlko  = true;
								key.filterOffer = true;
								// КоличеCво в корзине по умолчанию
								key.cartQuantity = 1;
							})
							commit('set', {type: 'productList', items: body.products})
						if (body.filter) {
							// Начальные значения фильтров
							let filterPrice = {
								min: body.filter.price.min,
								max: body.filter.price.max,
							};
							let filterAlko  = {
								min: body.filter.alko.min,
								max: body.filter.alko.max,
							};

							commit('set', {type: 'filterPrice', items: filterPrice})
							commit('set', {type: 'filterAlko',  items: filterAlko})
						}
						// Выключаем лоадер
						commit('set', {type: 'loader', items: false})
						// Выключаем вкладку C индивидуальными предложениями
						commit('set', {type: 'selectOffer', items: false})
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		selectCategory({commit}, category) {
			commit('set', {type: 'category', items: category})
			if (category)
				commit('set', {type: 'idActiveCat', items: category.id})
			else
				commit('set', {type: 'idActiveCat', items: undefined})
		},
		selectProduct({commit}, product) {
			commit('set', {type: 'product', items: product})
		},
		selectShop({state, commit}, shopId) {
			 let arg = {
				params:{
					token  : Cookies.get('token'),
					shop   : shopId,
					action : 'select_shop'
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.client, null, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						commit('set', {type: 'shop',  items: body.SHOP})

						$.fancybox.close()

						document.location = '/#/orders'
						window.location.reload()
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		sendMail({state, commit}, text) {
			// Включаем лоадер
			commit('set', {type: 'sendMailLoader',  items: true})

			let arg = {
				params:{
					token  : Cookies.get('token'),
					text   : text,
					action : 'send_mail'
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.client, null, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						// Выключаем лоадер
						commit('set', {type: 'sendMailLoader',  items: false})
						// Указываем что Cообщение отправлено
						commit('set', {type: 'isSentMail', items: true})
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		// Изменить количеCво продуктво в корзине
		updateQtyProdInCart({state, commit}, product) {
			let arg = {
				params: {
				   action             : 'add_qty',
				   token              : Cookies.get('token'),
				   'product.id'       : product.id,
				   'product.quantity' : product.qty,
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.cart, null, arg).then(
				response => {
					let body = response.body;
					if (body.ERROR) {
						console.log(body.ERROR);
						if (body.ERROR.AUTH)
							document.location = '/#/auth'
					} else {
						commit('set', {type: 'cart', items: body.cart})
						if (body.cart)
							commit('calculateCartPrice', {products: body.cart.products.elements})
					}
				},
				error => {
					console.log(error);
				}
			)
		},
	}
})

export default catalogStore