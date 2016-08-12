<template>
	<section class="item statistics">
	    <div class="inner">
        <div class="cell">
            <h3 class="content-title">数据统计</h3>
            <hr class="m0">
            <div class="content">
				<div class="chart" v-line-chart="lineData"></div>
				<div class="chart-bottom">
					<div class="chart-label">
						<div>{{ statistics.members | currency '' 0}}</div>
						<div>会员数</div>
					</div>
					<div class="chart-pan" v-pie-chart="pieData"></div>
					<a :href="memberUrl" class="fans">
						<div class="icon"><i class="yqy-zhanghu1 secondary"></i></div>
						<div class="label secondary">粉丝 : {{ statistics.fans | memPercentage}}</div>
						<div class="icon"><i class="yqy-zhanghu1"></i></div>
						<div class="label">非粉丝 : {{ notfans | memPercentage }}</div>
					</a>
				</div>
				<div class="chart-bottom text-center">
					<a :href="orderUrl" class="chart-block">
						<div class="top">{{ statistics.orderCount | currency '' 0 }}</div>
						<div class="bottom">订单总数</div>
					</a>
					<a :href="orderUrl" class="chart-block">
						<div class="top">{{ statistics.orderAmount | orderAmount ''}}</div>
						<div class="bottom">订单总金额</div>
					</a>
				</div>
            </div>
        </div>
	    	<div class="statistics-blocker text-center" v-if="!statistics.bind" v-cloak>
				<div>解锁运营数据统计</div>
				<div class="mb25">请授权微信公众号</div>
				<a :href="authUrl" class="btn btn-bind">立即授权</a>
	    	</div>
	    </div>
	</section>
</template>
<script>
	import { chart } from 'src/service.js';
	import PieChart from 'components/directives/pie.js';
	import LineChart from 'components/directives/line.js';
	export default {
		props: ['authUrl', 'orderUrl', 'memberUrl'],
		data () {
			return {
				statistics: {
					bind: true,
					fans: 0,
					members: 0,
					orderCount: 0,
					orderAmount: 0
				},
				lineData: null,
				pieData: null
			}
		},
		computed: {
			notfans () {
				return this.statistics.members - this.statistics.fans;
			}
		},
		methods: {
			getData () {
				chart
					.getData()
					.then((res) => {
						res = res.json();
						if(!res.success) return;
						res = res.data;
						this.statistics.bind = res.bind;
						// TODO REVIEW
						if(this.statistics.bind){
							this.statistics.fans = res.fans;
							this.statistics.members = res.members;
							this.statistics.orderCount = res.orderCount;
							this.statistics.orderAmount = res.orderAmount;
							this.pieData = this.getPieData(res);
							this.lineData = this.getLineData(res);
						}
					})
			}
		},
		directives: {
			PieChart,
			LineChart
		},
		filters: {
			memPercentage (num) {
				var result = Math.round(num/this.statistics.members*100);
				result = isNaN(result)?0:result;
				return  result + ' %';
			},
			orderAmount (value, symbol, fraction) {
				return this.$options.filters.currency(value / 100, symbol, fraction);
			}
		},
		ready () {
			this.getPieData = function(res) {
				return [
					{name: '非粉丝', y: res.members - res.fans, color: '#08a7ec'},
					{name: '粉丝', y: res.fans, color: '#76ae2b'}
				]
			}
			this.getLineData = function(res) {
				return {
					list: res.list,
					fans: res.fans
				};
			}
			this.getData();
		}
	}
</script>