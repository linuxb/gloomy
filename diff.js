/*
***************** gloomy framework *********************
***************** copyright 2016 MIT ********************
***************** Developer Linuxb **********************

 render module and react statemachine components

*/

define(function() {

	var gyRenderTree = null;
	var gyNodes = [];

	var exports = {
		//virtual dom tree
		/*
		* 虚拟dom树节点，元素节点中的children属性作为该节点结构的
		* 子节点，作为子树
		* 树节点结构 ： {
			vt_val : 节点元素引用
			vt_children : [] 子节点（子树根节点引用）
			vt_parent : 父节点引用
			vt_key : number 节点在子节点序列中的标识
		}

		*/
		vtree_treeNodeContructor : function(vt_val,vt_children,vt_parent) {
			//element
			this.vt_val = vt_val || null;
			if (!vt_parent) {
				throw new ReferenceError('error : tree node must hold a reference of its parent');
			}
			if (vt_children) {
				//isArray() implement
				if ('[object Array]' == Object.prototype.toString.call(vt_children)) {
				this.vt_children = vt_children;
				}
				else {
					throw new TypeError('error : type error,children of vTree must be a Array!');
					return;
				}
			}
			else {
				//children nodes
				this.vt_children = [];
			}
		},

		//elemet structure
		/*
		* 节点构造器，可构造文本节点，元素节点内含属性（CSS样式）节点数组
		*/
		vtree_nodeConstructor : function(vn_name,vn_attrs,vn_children,vn_type) {
			if (Array.isArray(vn_attrs)) {
				/*throw new TypeError('error : type error,attributes of a element node must be a Array!');
				return;*/
			}
			if (vn_name) {
				console.log('error : name of this element node must be set');
				return;
			}
			this.name = vn_name;
			this.attrs = vn_attrs;
			//option to create dom node typeof text
			if ('text' === vn_type) {
				if (!vn_children) {
					console.log('error : wrong node constructor');
					return;
				}
				this.children = vn_children;
			}
			else {
				this.children = null;
			}
		},

		vtree_renderTreeBuilder : function() {
			var container = document.getElementById('content');
			//init internal dom tree
			if (gyRenderTree) {
				var renderTree = gy_linkRenderDom(gyRenderTree);
				//insert the render tree into container
				container.appendChild(renderTree);
			}
		},

		/*
		* provide a tree from a component arguments
		* children is not set in this version
		*/
		vtree_nodeFactory : function(name,attrs,children,type,content,parent) {
			if (children) {
				console.log('not surpport in this version');
				return null;
			}
			var _parent = parent;
			//if no parent argument,consider that its parent is the root of virtual tree
			if (!_parent) {
				if (!gyRenderTree) {
					//init the root
					var element = new vtree_nodeConstructor('div',[]);
					gyRenderTree = new vtree_treeNodeContructor(element,[],{});
				}
				_parent = gyRenderTree;
			}
			var element = new vtree_nodeConstructor(name,attrs,content,type);
			var node = new vtree_treeNodeContructor(element,children,_parent);
			vtree_insertNode(node,_parent);
			return node;
		},

		/*
		* insert virtual dom node to vtree
		*/
		vtree_insertNode : function(component,parent) {
			if (!component) {
				throw new ReferenceError('error : component undefined error');
			}
			if (!parent.vt_children) {
				throw new ReferenceError("error : parent of " + component.name + ' must hold a reference');
			}
			parent.vt_children.push(component);
		},

		/*
		* destroy all sub-nodes of root node recursion,it remains a recycled node without children
		*/
		vtree_recursionDestroySubNode : function(root) {
			if (root.vt_children.length === 0) return;
			for (var i = 0; i < root.vt_children.length; i++) {
				vtree_removeNode(root.vt_children[i]);
			}
			Array.prototype.splice.apply(root.vt_children,[0,root.vt_children.length]);
		},

		/*
		* remove node (the sub-tree) of root node, not a recursion process
		*/
		vtree_removeNode : function(node,index) {
			if (index > node.vt_children.length - 1 || index < 0) {
				throw new EvalError('error : out of range of array >> children of treenode');
			}
			//destroy all the sub-nodes of the node to be removed
			vtree_recursionDestroySubNode(node.vt_children[index]);
			node.vt_children.splice(index,1);
		},

		/*
		* gennerate a real dom node to de rendered
		*/
		gy_zygoteRenderDom : function(vtreeNode) {
			if(!vtreeNode) return null;
			if (!vtreeNode.vt_val) {
				throw new ReferenceError('error : no reference for a rendered node instance');
			}
			var name = vtreeNode.vt_val.name;
			var attrs = vtreeNode.vt_val.attrs;
			var instance = document.createElement(name);
			if (attrs) {
				for (key in attrs) {
					if ('gyClass' === key) {
						instance.addClass(attrs[key]);
					}
				}
			}
			if (vtreeNode.vt_val.children) {
				instance.text = vtreeNode.vt_val.children;
			}

			return instance;
		},

		/*
		* link all the generated dom node to a render tree
		*/
		gy_linkRenderDom : function(root) {
			var cache = gy_zygoteRenderDom(root);
			for (var i = 0; i < root.vt_children.length; i++) {
				var child = gy_linkRenderDom(root.vt_children[i]);
				cache.appendChild(child);
			}
			return cache;
		}
	}
	return exports;
});