// TODO CODE REVIEW
export default {
  bind() {
    this.init = function(data) {
      Highcharts.setOptions({
        lang: {
          thousandsSep: ','
        }
      })
      $(this.el).highcharts({
        chart: {
          type: 'pie',
          spacing: false,
          backgroundColor: 'transparent',
          style: {
            fontFamily: 'Microsoft Yahei, Helvetica Neue, Helvetica, Arial, sans-serif'
          }
        },
        credits: false,
        title: null,
        tooltip: {
          backgroundColor: '#fff',
          headerFormat: '',
          pointFormat: '{point.name}: {point.y}'
        },
        plotOptions: {
          pie: {
            dataLabels: false,
            shadow: false,
            states: {
              hover: false
            }
          }
        },
        series: [{
          size: '120%',
          innerSize: '80%',
          data: data
        }, {
          size: '85%',
          innerSize: '90%',
          data: data
        }]
      });
    };
  },
  update(newVal) {
    if(!newVal) return;
    this.init(newVal);
  }
};
