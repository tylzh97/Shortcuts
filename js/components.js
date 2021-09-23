const RHNavigator = {
	props: ['select'],
	template: `
<div style="height: 100%;">
	<el-menu style="height: 100%" :default-active="select?select:'clipboard'" :collapse="!isCollapse" class="el-menu-vertical-demo" :unique-opened="true" :router="true">
	  <el-menu-item index="clipboard">
		<i class="el-icon-s-claim"></i>
		<span slot="title">剪切板</span>
	  </el-menu-item>
	  <el-menu-item index="3" disabled>
		<i class="el-icon-document"></i>
		<span slot="title">敬请期待</span>
	  </el-menu-item>
	  <div class="nav-footer" @click="handleClick">
	    <span v-if="!isCollapse" class="iconfont sci-zhankai"></span>
		<span v-else class="iconfont sci-shouqi"></span>
	  </div>
	</el-menu>
</div>
	`,
	data: () => {
		return {
			isCollapse: false
		}
	},
	methods: {
		handleClick() {
			console.log('Hello World!');
			this.isCollapse = !this.isCollapse;
		},
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
		}
	}
};

const RHClipboard = {
	props: [],
	template: `
<div>
  <h1>快捷剪切板</h1>
  <h2>添加剪切板记录</h2>
  <hr />
  <div class="block">
    <el-input
	  class="clipboard-input"
      type="textarea"
      :rows="4"
      placeholder="请输入内容"
      v-model="textarea">
    </el-input>
	<el-button type="primary" @click="submitClipboard" id="get-clipboard-btn">提交记录</el-button>
  </div>
  <h2>复制历史内容</h2>
  <hr />
  <div class="block">
    <el-slider v-model="value" show-input />
  </div>
  <hr />
  <el-table :data="tableData" border style="width: 100%" @row-click="handleRowClick">
  	<el-table-column prop="index" label="序号" width="50"></el-table-column>
  	<el-table-column prop="content" label="内容"></el-table-column>
  </el-table>
<div>
	`,
	data: () => {
		return {
			value: 10,
			textarea: "",
		}
	},
	computed: {
		tableData() {
			const ret = [];
			axios.get("https://service-3f0lbeme-1256734875.gz.apigw.tencentcs.com/clipboard/get?limit="+this.value).then(
				(res, err) => {
					if (!res.data.code == 0) {
						this.$message.error("从服务器拉取数据失败");
						return [];
					}
					for(var i in res.data.list) {
						ret.push({index: i, content: res.data.list[i]})
					}
				}
			)
			return ret;
		}
	},
	methods: {
		submitClipboard() {
			if (!this.textarea) {
				this.$message.info("请输入内容!");
				return ;
			}
			axios({
			   method: "POST",
			   url: 'https://service-3f0lbeme-1256734875.gz.apigw.tencentcs.com/clipboard/add',
			   data: {
				  data: this.textarea,
			   },
			   transformRequest: [
				  function (data) {
					 let ret = ''
					 for (let it in data) {
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					 }
					 ret = ret.substring(0, ret.lastIndexOf('&'));
					 return ret
				  }
				],
				headers: {
				   'Content-Type': 'application/x-www-form-urlencoded'
				}
			}).then((res, err) => {
				console.log(res);
				if (res.data.code == 0) 
				  this.$message.success("记录提交成功");
				else
				  this.$message.error("记录提交失败:" + res.data.msg);
			})
		},
		handleRowClick(row, column, event) {
			// console.log(row, column);
			var clipboard = new ClipboardJS('tr', {
				text: function(trigger) {
					return row.content;
				}
			});
			this.$message.success("成功将内容复制到剪切板");
		},
	},
};

const RHMainboard = {
	props: [],
	components: {
		'clipboard': RHClipboard,
	},
	template: `
<div>
  <div class="main-view">
  <clipboard v-if="$route.params.navid == 'clipboard'" />
  <div v-else> Page render fail: Hash not found! </div>
  </div>
</div>
	`,
	data: () => {
		return {}
	},
	methods: {}
};
