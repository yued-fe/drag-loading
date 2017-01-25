# drag-loading
基于窗体滚动的下拉释放加载或者刷新


## 如何使用
①. 引入JS文件，例如

``` html
<script src="drag-loading.js"></script>
```

②. 绑定

``` javascript
new DragLoading(el, {
	onReload: function() {
	    /** 执行刷新操作
	     * ... 
	    */

	    // loading下拉还原
	    this.origin();
    }
});
```

## 语法
``` javascript
new DragLoading(el, option);
```

其中：
<ul>
	<li><code>el</code>表示隐藏（<code>height:0</code>隐藏）在滚动窗体顶部的下拉元素；</li>
	<li><code>option</code>为可选参数，包括：
		<ul>
			<li><code>trigger</code>，包装器对象，感受下拉操作的容器，默认为<code>$('body')</code>。</li>
			<li><code>maxY</code>，数值，表示loading元素全部展开时候的高度值，也是触发<code>onReload</code>回调的边界高度，默认为<code>40</code>。</li>
			<li><code>onReload</code>，函数，当下拉足够高时候触发的刷新回调方法，默认是空函数。</li>
		</ul>
	</li>
</ul>

### 暴露属性和方法
``` javascript
{
	// el就是loading元素
	el: el,
	// reload回调方法
	callback: {
		reload: function() {}
	},
	// loading元素高度等UI还原
	origin: function() {},
	// 下拉阻尼处理，这个一般用不到
	damping: function () {}
}
```

## 补充tips
<ul>
	<li>本方法依赖jQuery.js或者Zepto.js。</li>
	<li>仅支持窗体滚动，普通元素下拉加载可以自行微调支持，很简单，把<code>trigger</code>和滚动窗体都改成这个可以滚动的普通元素即可。</li>
	<li>loading元素默认高度<code>0</code>隐藏，然后本方法会对底边框进行设置，因此，不要使用<code>border-bottom</code>相关样式。</li>
</ul>
