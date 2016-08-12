// TODO CODE REVIEW
export default {
  bind() {
    this.init = function(data) {
      $(this.el).highcharts({
        chart: {
          type: 'line',
          backgroundColor: false,
          plotBackgroundColor: '#fdf7f3',
          plotBorderWidth: 1,
          plotBorderColor: '#e0e0e0',
          style: {
            fontFamily: 'Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif'
          }
        },
        credits: false,
        legend: { enabled: false },
        plotOptions: {
          series: {
            marker: {
              fillColor: '#fff',
              lineWidth: 2,
              lineColor: null
            }
          }
        },
        series: [{
          name: '粉丝数',
          data: data.list.map((item) => {
            return item.fans;
          }),
          color: '#76ae2b'
        }],
        title: {
          text: '总粉丝数: ' + data.fans,
          style: {
            fontSize: '12px'
          },
          align: 'right'
        },
        tooltip: {
          useHTML: true,
          headerFormat: '<span><i class="yqy-shijian" style="font-size: 14px;"></i>&nbsp;{point.key}</span><br/>',
          pointFormat: '{series.name}: {point.y}<br/>',
          style: {
            fontSize: '13px'
          }
        },
        xAxis: {
          categories: data.list.map((item) => {
            return item.time;
          }),
          tickLength: 0,
          startOnTick: true,
          lineColor: '#e0e0e0',
          gridLineWidth: 1,
          gridLineColor: '#f0f0f0'
        },
        yAxis: {
          allowDecimals: false,
          title: { text: null },
          tickPixelInterval: 30,
          lineColor: '#f4eeea',
          gridLineColor: '#f0f0f0'
        }
      });
    };
  },
  update(newVal) {
    // TODO TYPE CHECK
    if (!newVal) return;
    this.init(newVal);
  }
};
