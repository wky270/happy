"use strict";

import Vue from 'vue';
import iView from 'iview';
import CommonService from '../../services/common';
import Router from '../../router/index';

export default {
	data () {
		const validateStartDate1 = (rule, value, callback) => {
            if (value=='') {
                callback(new Error('请选择开始日期'));
            }
			else {
                if (this.service.endDate !== '') {
                    // 对第二个日期单独验证
                    this.$refs.service.validateField('endDate');
                }
                callback();
            }
       };
        const validateEndDate1 = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请选择结束日期'));
            } 
			else if (value < this.service.startDate) {
                callback(new Error('到期日期不能早于开始日期'));
            } else {
                callback();
            }
        };
         const validateStartDate2 = (rule, value, callback) => {
            if (value=='') {
                callback(new Error('请选择开始日期'));
            }
			else {
                if (this.serviceEdit.endDate !== '') {
                    // 对第二个日期单独验证
                    this.$refs.serviceEdit.validateField('endDate');
                }
                callback();
            }
        };
         const validateEndDate2 = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请选择结束日期'));
            } 
			else if (value < this.serviceEdit.startDate) {
                callback(new Error('到期日期不能早于开始日期'));
            } 
            else {
                callback();
            }
        };
		return {
			modalAdd: false,
			modalDel: false,
			modalDetail: false,
			modalReset: false,
			pageSize: 10,
			pageNumber: 1,
			pageNum:1,
			totalCount: 0,
			modalName: '',
			modalAcct: '',
			checkList:[],
			service: {
				id:'',
				partnerName:'',
                serviceCode:'',
                account: '',
                startDate:'',
                endDate:'',
                status:''
			},
			serviceEdit: {
				id:'',
				partnerName:'',
                serviceCode: '',
                account: '',
                startDate:'',
                endDate:'',
                status:''
			},
			columns4: [
				{
					type: 'selection',
					width: 50,
					align: 'center'
				},
                    {
                        title: '合作商名称',
                        key: 'partnerName'
                    },
                    {
                        title: '服务名称',
                        key: 'serviceCode'
                    },
                    {
                        title: '服务开通日期',
                        key: 'startDate'
                    },
                    {
                        title: '服务到期日期',
                        key: 'endDate'
                    },
                    {
                        title: '状态',
                        key: 'status'
                    },
                     {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
                                        }
                                    }
                                }, '详情'),
                            ]);
                        }
                    }
			],
			dataList:[],
			ruleInlineAdd: {
					partnerName: [
						{ required: true, message: '请选择合作商', trigger: 'change' }
					],
					serviceCode: [
						{ required: true, message: '请选择服务', trigger: 'change' }
					],
					account: [
						{ required: true, message: '请输入账号', trigger: 'blur' }
					],
					startDate: [
						{ validator: validateStartDate1, trigger: 'change' }
					],
					endDate: [
						{ validator: validateEndDate1, trigger: 'change' }
					],
					status: [
						{ required: true, message: '请选择状态', trigger: 'change' }
					],
			},
			ruleInlineEdit: {
					partnerName: [
						{ required: true, message: '请选择合作商', trigger: 'change' }
					],
					serviceCode: [
						{ required: true, message: '请选择服务', trigger: 'change' }
					],
					account: [
						{ required: true, message: '请输入账号', trigger: 'blur' }
					],
					startDate: [
						{ validator: validateStartDate2, trigger: 'change' }
					],
					endDate: [
						{ validator: validateEndDate2, trigger: 'change' }
					],
					status: [
						{ required: true, message: '请选择状态', trigger: 'change' }
					],
				}
		}
	},
	mounted:function(){
		this.search(1);
	},
	/*filters: {
		
	},*/
    methods: {
    	   resetCancel (name,name2){
    	   	    this.$name={
				id:'',
				partnerName:'',
                serviceCode: '',
                account: '',
                startDate:'',
                endDate:'',
                status:''
			},
    	   	    this.$refs[name].resetFields();
        		this.$refs[name2].close();
        },
		myFilter(value){
			if(value=="0"){
				return "在用";
			}else if(value=="1"){
				return "停用";
			}else{
				return '';
			}
		},
		dateFilter(tm){
			/*var tt=new Date(parseInt(tm)).toLocaleString();
		    return tt;*/
		    var time = new Date(tm);
			var y = time.getFullYear();//年
			var m = time.getMonth() + 1;//月
			if(m.toString().length==1){
				m="0"+m;
			}
			var d = time.getDate();//日
			if(d.toString().length==1){
				d="0"+d;
			}
			var h = time.getHours();//时
			var mm = time.getMinutes();//分
			var s = time.getSeconds();//秒
			return y+"年"+m+"月"+d+"日";
		},
		dateFilter2(tm){
			var time = new Date(tm);
			var y = time.getFullYear();//年
			var m = time.getMonth() + 1;//月
			if(m.toString().length==1){
				m="0"+m;
			}
			var d = time.getDate();//日
			if(d.toString().length==1){
				d="0"+d;
			}
			var h = time.getHours();//时
			var mm = time.getMinutes();//分
			var s = time.getSeconds();//秒
			var a=y+"-"+m+"-"+d;
			return a.toString();
		},
		serviceNameFilter(value){
			if(value=="0"){
				return "信息服务";
			}else if(value=="1"){
				return "融资服务";
			}else{
				return '结算服务';
			}
		},
		serviceAdd() {
			this.modalAdd=true;
			
		},
		serviceDetail() {
			if(this.checkList.length==1){
				//发送get请求
		CommonService.http({
		 method: 'get',
		 url:'platform/partnerservice/get',
		 data:{
		 	id: this.checkList[0].id,
		 }
		}).then(data => {
			data.data.partnerservice.status=data.data.partnerservice.status.toString();
			this.serviceEdit = data.data.partnerservice;
		})      
				this.modalDetail=true;
			}else{
				this.$Message.info('请选择一条数据进行查看');
			}
		},
		serviceUpdate(name) {
			this.$refs[name].validate((valid) => {
			      if (valid) {
	                	CommonService.http({
	                		url: 'platform/partnerservice/save',
	                		method: 'post',
	                		data:{
	                			id:this.serviceEdit.id,
	                			partnerName:this.serviceEdit.partnerName,
	                			account:this.serviceEdit.account,
	                			serviceCode:this.serviceEdit.serviceCode,
	                			startDate:this.serviceEdit.startDate,
				                endDate:this.serviceEdit.endDate,
				                status:this.serviceEdit.status
	                		}
	                	}).then(data => {
	                		this.$refs[name].resetFields();
                            this.$refs.modalDetail.close();
	                		//this.getUser();
	                		this.search(this.pageNum);
	                    	this.$Message.success('编辑成功!');
	                	});
                }	

			})
		},
		okDel () {
			var id = "";
			for(var i=0;i<this.checkList.length;i++){
				id=id+this.checkList[i].id+',';
			}
			CommonService.http({
			 method: 'get',
			 url: "platform/partnerservice/del",
			 data:{ 
			 	   id:id
			 }
			}).then( data => {
				this.search(1);
				this.$Message.success('删除成功');
				this.checkList = "";
			})
			
		},
		cancelDel () {
		},
		pageNumSize(size){
			 console.log(size);
			 this.pageSize=size;
			 this.search(1);
			
		},
		refresh(page){
             this.search(page);
		},
		check(selection){
			this.checkList = selection;
		},
		del(){
			if(this.checkList.length==0){
				this.$Message.info('请选择至少一条数据进行删除');
			}else{
				this.modalDel = true;
			}
		},
		search(page){
			this.pageNum = page || 1;
			if(typeof(this.search.startDate)!="undefined"&&this.search.startDate!=""){ 
              this.search.startDate=this.search.startDate=this.dateFilter2(this.search.startDate);
             }
			if(typeof(this.search.endDate)!="undefined"&&this.search.endDate!=""){ 
              this.search.endDate=this.search.endDate=this.dateFilter2(this.search.endDate);
            } 
			//发送post请求
			CommonService.http({
			 method: 'post',
			 url:'platform/partnerservice/page',
			 data:{
			 	pageNum: this.pageNum,
                list: [{
                        partnerName: this.search.partnerName,
                        serviceCode: this.search.serviceCode,
                        startDate: this.search.startDate,
                        endDate: this.search.endDate,
                        status: this.search.status
                      }],
                pageSize: this.pageSize
			 }
			}).then(data => {
				var serviceList = data.data.service.list;
			var json = [];
			for(var i=0;i<serviceList.length;i++){
				var val = this.myFilter(serviceList[i].status);
				var val2 = this.dateFilter(serviceList[i].startDate);
				var val3 = this.dateFilter(serviceList[i].endDate);
				serviceList[i].status = val;
				serviceList[i].startDate = val2;
				serviceList[i].endDate = val3;
				json.push(serviceList[i]);
			}
			this.dataList = json;
			this.totalCount = data.data.service.total;
			})
		},
		addService (name){
			this.$refs[name].validate((valid) => {
			      if (valid) {
	                	CommonService.http({
	                		url: 'platform/partnerservice/save',
	                		method: 'post',
	                		data:{
	                			partnerName:this.service.partnerName,
	                			account:this.service.account,
	                			serviceCode:this.service.serviceCode,
	                			startDate:this.service.startDate,
				                endDate:this.service.endDate,
				                status:this.service.status
	                		}
	                	}).then(data => {
	                		this.$refs[name].resetFields();
                            this.$refs.modalAdd.close();
	                		//this.getUser();
	                		this.search(this.pageNum);
	                    	this.$Message.success('添加成功!');
	                	});
                }	
				
				
			})
		},
		 show (index) {
                this.$Modal.info({
                    title: '合作商服务信息',
                    content: `合作商名称：${this.dataList[index].partnerName}<br>服务名称：${this.dataList[index].serviceCode}<br>服务开通日期：${this.dataList[index].startDate}<br>服务到期日期：${this.dataList[index].endDate}<br>状态：${this.dataList[index].status}<br>`
                })
            },
	}
	
}
