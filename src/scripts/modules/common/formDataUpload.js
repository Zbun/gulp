/**
 * HTML5 formdata upload method
 * @author Zhao Liubin
 * @date   2016-05-19
 * @return {[type]}
 */
(function () {
  var html5Upload = function () {
    var arg = arguments[0];
    var obj = typeof getTarget == 'function' ? getTarget(arg.obj) : arg.obj; //获取真实DOM节点，作用于上传按钮对象
    if (obj) {
      var name = arg.name || arg.key || obj.name || 'image'; //formData 格式
      var size = (arg.size || 0) + ''; // 最大尺寸，默认K，可传如'3M'格式;
      var type = (arg.type || '').replace('.', ''); //文件类型，jpg,gif 逗号隔开后缀名
      var rules = arg.rules || ''; //自定义规则
      // size = (size + '').replace(/k|m/i, '');
      var url = arg.url || 'https://newvipapi.zolerp.cn/api/UploadFile/UploadImage'; //上传服务器
      var callback = arg.callback || ''; //成功回调
      var errorCallback = arg.error || ''; //失败回调
      var nodeCopy = obj.cloneNode();

      var elShadow = document.createElement('div');//添加一个遮罩，不再叫你的破手胡点八点
      elShadow.style.cssText = 'position: fixed;left: 0;right: 0;top: 0;bottom: 0;background: rgba(0,0,0,0);z-index: 10000;';

      //构造加载进度HTML
      var progressBg = document.createElement('div');
      progressBg.style.cssText = 'position:fixed;left:50%;top:50%;padding:10px 40px 0;border:1px solid #666;box-shadow:inset 0 0 1px #fff;border-radius:4px;text-align:center;color:#fff;background:rgba(0,0,0,.5);z-index:1234;transform:translate(-50%,-50%);';
      var progressBarOuter = document.createElement('div');
      progressBarOuter.style.cssText = 'position:relative;height:6px;width:100px;border-radius:6px;border:1px solid #ddd;';
      var progressBarInner = document.createElement('span');
      progressBarInner.style.cssText = 'position:absolute;left:0;top:0;bottom:0;background:#56C7A8;transition:.3s;';
      var progressNum = document.createElement('p');

      var fnUploadEnd = function () {//上传结束，删除遮罩、删除进度条
        progressBg.parentNode && progressBg.parentNode.removeChild(progressBg);
        elShadow.parentNode && elShadow.parentNode.removeChild(elShadow);

      };
      var fnResetBtnUpload = function () {
        obj.parentNode.replaceChild(nodeCopy, obj);
        html5Upload({
          obj: nodeCopy,
          url: url,
          size: size,
          rules: rules,
          type: type,
          callback: callback,
          name: name,
          errorCallback: errorCallback
        });
      };
      obj.addEventListener('change', function () {
        //FormData上传
        if (window.FormData) {
          var f0 = obj.files[0];
          //尺寸判断
          if (size != 0) {
            var realSize = size;
            if (/m/i.test(size)) {
              realSize = parseFloat(size) * 1024 * 1024;
            } else {
              realSize = parseFloat(size) * 1024;
            }
            if (f0.size > realSize) {
              alert('文件尺寸超出限制，请检查', 'error');
              fnUploadEnd();
              return;
            }
          }
          //类型判断
          if (type.length > 0) {
            var typesArray = type.split(',');
            var isTypeOk = false;
            for (var i = 0; i < typesArray.length; i++) {
              var reg1 = new RegExp('.' + typesArray[i] + '$', 'i');
              if (reg1.test(f0.name)) {
                isTypeOk = true;
                break;
              }
            }
            if (!isTypeOk) {
              alert('文件格式要求 "' + type + '" 后缀名，请检查', 'error');
              fnUploadEnd();
              return;
            }
          }
          //自定规则
          if (rules.length > 0) {
            var regRules = new RegExp(rules);
            if (regRules.test(f0.name)) {
              alert('该文件不合要求，请校对', 'error');
              fnUploadEnd();
              return;
            }
          }

          var indexUploading = 0;
          var fnUpload = '';
          var xhr = new XMLHttpRequest();
          // xhr.withCredentials = true;//发送cookie到服务器，需要服务器支持
          xhr.onload = function () {
            if (xhr.status === 200) {

              var data = JSON.parse(xhr.response);

              //只处理ZMM响应信息部分，其它忽略或修改
              if (data.ResponseID == -1) {
                if (data.Message) {
                  alert(data.Message, 'error');
                  fnUploadEnd();
                  return;
                }
              }
              //处理结束

              if (typeof callback == 'function') {
                callback(data);
              } else {
                console.info('上传成功，但没有callback回调方法传入');
              }
              fnUploadEnd();
              indexUploading++;
              fnUpload();
            } else {
              if (typeof errorCallback == 'function') {
                errorCallback();
              } else {
                alert('上传失败，请稍候重试；若继续错误，请联系我们网站开发人员，感谢。', 'error', '', 5000);
              }
              fnUploadEnd();
              fnResetBtnUpload();
            }
          };
          //加载进度事件
          // xhr.upload.onprogress = function (event) {
          //   if (event.lengthComputable) {
          //     document.body.appendChild(progressBg);
          //     var complete = (event.loaded / event.total * 100 | 0) + '%';
          //     progressBarInner.style.width = complete;
          //     progressNum.innerHTML = '已完成：' + complete;
          //     progressBarOuter.innerHTML = progressBarInner.outerHTML;
          //     progressBg.innerHTML = progressBarOuter.outerHTML + progressNum.outerHTML;
          //   }
          // };

          fnUpload = function () {
            if (indexUploading >= obj.files.length) {
              fnResetBtnUpload();
              return;
            }
            var objFile = obj.files[indexUploading];
            var formData = new FormData();
            formData.append(objFile.name, objFile);
            xhr.open('post', url, true);
            // xhr.setRequestHeader('Content-Type', 'multipart/form-data');
            xhr.send(formData);
            document.body.appendChild(elShadow);//添加遮罩，不让胡点
          };

          fnUpload();
        }
      });
    } else {
      console.error('传入节点没有找到，绑定上传方法失败...');
    }
  };

  typeof module == 'object' && module.exports ? module.exports = html5Upload : window.html5Upload = html5Upload;
})();