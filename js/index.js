const index = {
	data: () => {
		return {
			message: "Hello World!",
		}
	},
	components: {
		'rh-navigator': RHNavigator,
	},
	template: `
<div style="height: 100%; display: flex;">
	<rh-navigator :select="$route.params.navid" class="left-nav" />
	<router-view v-if="$route.params.navid" class="mainboard" />
	<div v-else class="mainboard"><el-empty description="请选择服务"></el-empty></div>
</div>
`,
};

const routes = [{
		path: '/',
		component: index,
		children: [
			{
				path: ':navid',
				component: RHMainboard,
			}
		],
	},
	// { path: '/foo', component: Foo },
	// { path: '/bar', component: Bar }
]

const router = new VueRouter({
	routes
});

const app = new Vue({
	router
}).$mount('#app')

// const app = new Vue({
// 	el: "#app",
// 	data: () => {
// 		return {
// 			message: "Hello World!",
// 		}
// 	},
// 	components:{
// 		'rh-navigator': RHNavigator,
// 	}
// });
