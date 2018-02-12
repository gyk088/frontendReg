import Vue         from 'vue'
import Vuex        from 'vuex'
import VueResource from 'vue-resource'
import Conf        from '../../config/url.js'
import Cookies     from 'quasar'
import $           from 'jquery-ajax'
import 'moment/locale/ru'


Vue.use(Vuex)
Vue.use(VueResource)

const notifierStore = new Vuex.Store({
	state: {
		newsList    : undefined, // список новостей,
		managerList : undefined, // список менеджеров,
		news        : undefined, // выбранная новость,
		manager     : undefined, // выбранный менеджер,
		error       : undefined, // ошибка
	},
	getters: {
		newsList(state){
			return state.newsList
		},
		managerList(state){
			return state.managerList
		},
		news(state){
			return state.news
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
		}
	},
	actions: {
		addNews({state, commit, dispatch}, file) {
			var arg = new FormData();

			arg.append('news.title',       state.news.title);
			arg.append('news.text',        state.news.text);
			arg.append('news.description', state.news.description);
			arg.append('upload', file);
			arg.append('action', 'add');

			$.ajax({
				url:  Conf.url.news,
				type: 'POST',
				data: arg,
				processData: false,
				contentType: false,
				beforeSend : function(){

				},
				success : function(json){
					dispatch('newsList')
				}
			});
		},
		addManager({state, commit, dispatch}) {
			console.log('addManager')
			console.log(state.manager)
			let arg = {
				params:{
					'manager.name'     : state.manager.name,
					'manager.email'    : state.manager.email,
					'manager.password' : state.manager.password,
					'manager.phone'    : state.manager.phone,
					action             : 'add'
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.manager, null, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR)
						commit('set', {type: 'error', items: body.ERROR})
					} else {
						dispatch('managerList')
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		deleteNews({state, commit, dispatch}) {
			let arg = {
				params:{
					action    : 'delete',
					'news.id' : state.news.id,
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.news, null, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR)
						commit('set', {type: 'error', items: body.ERROR})
					} else {
						commit('set', {type: 'news', items: undefined})
						dispatch('newsList')
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		deleteManager({state, commit, dispatch}) {
			let arg = {
				params:{
					action    : 'delete',
					'manager.id' : state.manager.id,
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.post(Conf.url.manager, null, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR)
						commit('set', {type: 'error', items: body.ERROR})
					} else {
						commit('set', {type: 'manager', items: undefined})
						dispatch('managerList')
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		newsList({state, commit}) {
			// Очищаем список новостей
			commit('set', {type: 'newsList', items: undefined})

			let arg = {
				params:{
					action : 'list'
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.news, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR)
						commit('set', {type: 'error', items: body.ERROR})
					} else {
						commit('set', {type: 'newsList', items: body.news_list})
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		managerList({state, commit}) {
			// Очищаем список новостей
			commit('set', {type: 'newsList', items: undefined})

			let arg = {
				params:{
					action : 'list'
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.manager, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR)
						commit('set', {type: 'error', items: body.ERROR})
					} else {
						commit('set', {type: 'managerList', items: body.manager_list})
						console.log(body);
					}
				},
				error => {
					console.log(error);
				}
			)
		},
		sendNotification({state, commit}) {
			let arg = {
				params:{
					action : 'send_to',
					id_news: state.news.id,
				},
				headers: {
					'Content-Type': 'text/plain'
				}
			}

			Vue.http.get(Conf.url.firebase, arg).then(
				response => {
					let body = response.body
					if (body.ERROR) {
						console.log(body.ERROR)
						commit('set', {type: 'error', items: body.ERROR})
					} else {
						alert('sdfdsf')
					}
				},
				error => {
					console.log(error);
				}
			)
		},
	}
})

export default notifierStore