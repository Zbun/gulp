/**
 * 路径配置
 */
require.config({
                   baseUrl: ctxStatic+'/common/',
                   urlArgs: 'ewin_ver=' + ewin_ver,
                   paths: {
                       //require及其插件
                       text: 'require/text',
                       css: 'require/css',
                       domReady: 'require/domReady',
                       //avalon及其组件
                       avalon: 'avalon/avalon.shim',
                       scriptS:ctxStatic+'/common/script',
                       //jquery及其插件
                       jquery: ctxStatic+'/jquery/jquery-1.9.1.min',
                       page: 'comp/page',
                       layDate: ctxStatic+'/common/laydate/laydate',
                       laypage: ctxStatic+'/common/laypage/laypage',
                       h5Video: ctxStatic+'/common/html5media.min'
                   },
                   shim: {
                       jquery: {
                           exports: 'jquery'
                       },
                       page: {
                           deps: ['jquery'],
                           exports: 'page'
                       },
                       layDate: {
                           exports: 'layDate'
                       },
                       laypage: {
                           deps: ['jquery'],
                           exports: 'laypage'
                       },
                       scriptS:{
                    	 exports:'scriptS'  
                       },
                       h5Video: {
                           deps: ['jquery'],
                           exports: 'h5Video'
                       }
                   }

               });
